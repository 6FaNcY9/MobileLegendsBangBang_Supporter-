"""Integration-style tests for the FastAPI application with mocked data provider."""
from __future__ import annotations

from typing import Any, Dict, List

import pytest
from fastapi.testclient import TestClient

from backend.app import dependencies
from backend.app.main import app
from backend.app.data_providers.base import AbstractDataProvider


class FakeDataProvider(AbstractDataProvider):
    """Deterministic data provider used for tests."""

    def __init__(self, payload: List[Dict[str, Any]]) -> None:
        self._payload = payload

    def get_heroes(self) -> List[Dict[str, Any]]:
        return self._payload


@pytest.fixture()
def client() -> TestClient:
    """Return a TestClient with dependencies overridden to use fake data."""

    fake_payload = [
        {
            "id": 10,
            "name": "Gusion",
            "roles": ["Assassin", "Mage"],
            "lanes": ["Mid"],
            "difficulty": "Hard",
            "builds": [
                {
                    "items": ["Arcane Boots", "Calamity Reaper", "Holy Crystal"],
                    "emblems": ["Mage"],
                    "spells": ["Execute"],
                    "win_rate": 0.6,
                    "usage_rate": 0.08,
                    "playstyle_tags": ["Burst"],
                },
                {
                    "items": ["Arcane Boots", "Genius Wand", "Divine Glaive"],
                    "emblems": ["Mage"],
                    "spells": ["Retribution"],
                    "win_rate": 0.52,
                    "usage_rate": 0.22,
                    "playstyle_tags": ["Objective"],
                },
            ],
            "attributes": {"burst": 10},
        },
        {
            "id": 11,
            "name": "Lolita",
            "roles": ["Tank", "Support"],
            "lanes": ["Roam"],
            "difficulty": "Medium",
            "builds": [
                {
                    "items": ["Tough Boots", "Athena's Shield", "Dominance Ice"],
                    "emblems": ["Tank"],
                    "spells": ["Flicker"],
                    "win_rate": 0.49,
                    "usage_rate": 0.18,
                    "playstyle_tags": ["Peel"],
                },
                {
                    "items": ["Tough Boots", "Blade Armor", "Immortality"],
                    "emblems": ["Tank"],
                    "spells": ["Flicker"],
                    "win_rate": 0.55,
                    "usage_rate": 0.04,
                    "playstyle_tags": ["Counter"],
                },
            ],
            "attributes": {"defense": 8},
        },
    ]

    fake_provider = FakeDataProvider(fake_payload)
    dependencies.get_data_provider.cache_clear()
    app.dependency_overrides[dependencies.get_data_provider] = lambda: fake_provider

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    dependencies.get_data_provider.cache_clear()


def test_list_heroes_returns_enriched_data(client: TestClient) -> None:
    response = client.get("/heroes")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 2
    assert payload[0]["tier"]["tier"] == "S"
    assert payload[1]["tier"]["tier"] in {"A", "B", "C"}


def test_get_hero_returns_single_entry(client: TestClient) -> None:
    response = client.get("/heroes/10")
    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "Gusion"
    assert payload["tier"]["tier"] == "S"


def test_tier_list_endpoint(client: TestClient) -> None:
    response = client.get("/tier-lists")
    assert response.status_code == 200
    tiers = response.json()
    tier_labels = {entry["tier"] for entry in tiers}
    assert "S" in tier_labels
    assert tier_labels & {"A", "B", "C"}


def test_off_meta_endpoint(client: TestClient) -> None:
    response = client.get("/off-meta-builds")
    assert response.status_code == 200
    builds = response.json()
    assert len(builds) == 2
    assert all(build["is_off_meta"] for build in builds)
