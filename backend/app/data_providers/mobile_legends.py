"""Mobile Legends data provider implementation."""
from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Optional

import requests

from .base import AbstractDataProvider
from .static_data import DEFAULT_DATA

LOGGER = logging.getLogger(__name__)


class MobileLegendsDataProvider(AbstractDataProvider):
    """Fetch hero data from a public Mobile Legends dataset with caching."""

    def __init__(
        self,
        data_source_url: str,
        cache_ttl_seconds: int,
        request_timeout: int,
    ) -> None:
        self._data_source_url = data_source_url
        self._cache_ttl_seconds = cache_ttl_seconds
        self._request_timeout = request_timeout
        self._cached_payload: Optional[List[Dict[str, Any]]] = None
        self._cache_expiry: float = 0

    def get_heroes(self) -> List[Dict[str, Any]]:
        """Return hero data, using cached data or falling back to static defaults."""

        current_time = time.time()
        if self._cached_payload and current_time < self._cache_expiry:
            return self._cached_payload

        try:
            LOGGER.debug("Fetching hero data from %s", self._data_source_url)
            response = requests.get(self._data_source_url, timeout=self._request_timeout)
            response.raise_for_status()
            payload = self._normalize_payload(response.json())
            if not payload:
                raise ValueError("Remote payload was empty")
            self._cached_payload = payload
            self._cache_expiry = current_time + self._cache_ttl_seconds
            LOGGER.info("Fetched %s heroes from remote source", len(payload))
        except Exception as exc:  # noqa: BLE001 - we deliberately catch broadly to ensure fallback
            LOGGER.warning("Falling back to static data because remote fetch failed: %s", exc)
            self._cached_payload = DEFAULT_DATA
            self._cache_expiry = current_time + self._cache_ttl_seconds

        return self._cached_payload

    @staticmethod
    def _normalize_payload(raw_payload: Any) -> List[Dict[str, Any]]:
        """Convert raw API data into the structure expected by downstream services."""

        if isinstance(raw_payload, dict) and "data" in raw_payload:
            raw_payload = raw_payload["data"]

        if not isinstance(raw_payload, list):
            return []

        normalized: List[Dict[str, Any]] = []
        for entry in raw_payload:
            if not isinstance(entry, dict):
                continue

            builds = entry.get("builds") or entry.get("recommended_builds") or []
            formatted_builds = []
            for build in builds:
                if not isinstance(build, dict):
                    continue
                formatted_builds.append(
                    {
                        "items": build.get("items", []),
                        "emblems": build.get("emblems", []),
                        "spells": build.get("spells", []),
                        "win_rate": float(build.get("win_rate", 0)),
                        "usage_rate": float(build.get("usage_rate", 0)),
                        "playstyle_tags": build.get("playstyle_tags", []),
                    }
                )

            normalized.append(
                {
                    "id": entry.get("id") or entry.get("hero_id") or entry.get("number"),
                    "name": entry.get("name") or entry.get("hero"),
                    "roles": entry.get("roles") or entry.get("role", []),
                    "lanes": entry.get("lanes") or entry.get("lane", []),
                    "difficulty": entry.get("difficulty", "Unknown"),
                    "builds": formatted_builds,
                    "attributes": entry.get("attributes", {}),
                }
            )

        return [hero for hero in normalized if hero.get("id") and hero.get("name")]
