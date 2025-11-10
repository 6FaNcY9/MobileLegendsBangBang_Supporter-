"""Services for aggregating hero builds from providers."""
from __future__ import annotations

from typing import List

from ..data_providers.base import AbstractDataProvider
from ..models.build import Build
from ..models.hero import Hero


class BuildAggregationService:
    """Aggregate build data from the provider into typed models."""

    def __init__(self, provider: AbstractDataProvider) -> None:
        self._provider = provider

    def list_heroes(self) -> List[Hero]:
        """Return all heroes with their builds."""

        heroes = []
        for raw in self._provider.get_heroes():
            builds = [
                Build(
                    items=build.get("items", []),
                    emblems=build.get("emblems", []),
                    spells=build.get("spells", []),
                    win_rate=build.get("win_rate", 0.0),
                    usage_rate=build.get("usage_rate", 0.0),
                    playstyle_tags=build.get("playstyle_tags", []),
                )
                for build in raw.get("builds", [])
            ]
            heroes.append(
                Hero(
                    id=int(raw["id"]),
                    name=str(raw["name"]),
                    roles=list(raw.get("roles", [])),
                    lanes=list(raw.get("lanes", [])),
                    difficulty=str(raw.get("difficulty", "Unknown")),
                    builds=builds,
                    attributes=raw.get("attributes", {}),
                )
            )
        return heroes

    def get_hero(self, hero_id: int) -> Hero | None:
        """Return a single hero by id."""

        for hero in self.list_heroes():
            if hero.id == hero_id:
                return hero
        return None
