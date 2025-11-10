"""Service for detecting off-meta builds."""
from __future__ import annotations

from typing import List

from ..models.build import Build
from ..models.hero import Hero
from .build_service import BuildAggregationService


class OffMetaDetectionService:
    """Identify builds that perform well despite low popularity."""

    def __init__(self, build_service: BuildAggregationService) -> None:
        self._build_service = build_service

    def detect_off_meta_builds(self) -> List[Build]:
        """Return builds flagged as off-meta using heuristic thresholds."""

        off_meta_builds: List[Build] = []
        for hero in self._build_service.list_heroes():
            for build in hero.builds:
                # Heuristic documentation:
                #  * Usage rate below 10% indicates the build is rarely played.
                #  * Win rate above 52% signals strong performance relative to meta.
                #  * Builds tagged with niche playstyles further support the off-meta label.
                if build.usage_rate < 0.1 and build.win_rate > 0.52:
                    build.is_off_meta = True
                    off_meta_builds.append(build)
        return off_meta_builds
