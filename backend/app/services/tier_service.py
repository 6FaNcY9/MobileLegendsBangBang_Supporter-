"""Services for calculating tier lists from hero data."""
from __future__ import annotations

from typing import List

from ..models.hero import Hero
from ..models.tier import TierEntry
from .build_service import BuildAggregationService


class TierListService:
    """Calculate hero tier lists based on win rate and usage heuristics."""

    def __init__(self, build_service: BuildAggregationService) -> None:
        self._build_service = build_service

    def generate_tier_list(self) -> List[TierEntry]:
        """Generate a tier list using the best build per hero."""

        tier_entries: List[TierEntry] = []
        for hero in self._build_service.list_heroes():
            if not hero.builds:
                continue
            best_build = max(hero.builds, key=lambda build: build.win_rate)
            tier_label = self._determine_tier(best_build.win_rate, best_build.usage_rate)
            tier_entry = TierEntry(
                hero_id=hero.id,
                hero_name=hero.name,
                tier=tier_label,
                win_rate=best_build.win_rate,
                usage_rate=best_build.usage_rate,
            )
            hero.tier = tier_entry
            tier_entries.append(tier_entry)
        tier_entries.sort(key=lambda entry: ("SABCD".find(entry.tier), -entry.win_rate))
        return tier_entries

    @staticmethod
    def _determine_tier(win_rate: float, usage_rate: float) -> str:
        """Heuristic mapping of win/usage rates to tier labels."""

        # Documented heuristic: prioritize high win rate; adjust by usage to avoid anomalies.
        if win_rate >= 0.57:
            return "S"
        if win_rate >= 0.53:
            return "A"
        if win_rate >= 0.5 or usage_rate >= 0.2:
            return "B"
        if win_rate >= 0.47 or usage_rate >= 0.1:
            return "C"
        return "D"
