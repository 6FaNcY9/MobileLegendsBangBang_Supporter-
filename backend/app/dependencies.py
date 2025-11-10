"""Dependency injection helpers for FastAPI routes."""
from functools import lru_cache

from fastapi import Depends

from .config import settings
from .data_providers.mobile_legends import MobileLegendsDataProvider
from .services.build_service import BuildAggregationService
from .services.tier_service import TierListService
from .services.off_meta_service import OffMetaDetectionService


@lru_cache()
def get_data_provider() -> MobileLegendsDataProvider:
    """Return a cached data provider instance."""

    return MobileLegendsDataProvider(
        data_source_url=settings.data_source_url,
        cache_ttl_seconds=settings.cache_ttl_seconds,
        request_timeout=settings.request_timeout,
    )


def get_build_service(
    provider: MobileLegendsDataProvider = Depends(get_data_provider),
) -> BuildAggregationService:
    """Return the build aggregation service."""

    return BuildAggregationService(provider)


def get_tier_service(
    build_service: BuildAggregationService = Depends(get_build_service),
) -> TierListService:
    """Return the tier list service."""

    return TierListService(build_service)


def get_off_meta_service(
    build_service: BuildAggregationService = Depends(get_build_service),
) -> OffMetaDetectionService:
    """Return the off-meta detection service."""

    return OffMetaDetectionService(build_service)
