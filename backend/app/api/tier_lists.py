"""Tier list endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from ..dependencies import get_tier_service
from ..models.tier import TierEntry
from ..services.tier_service import TierListService

router = APIRouter(prefix="/tier-lists", tags=["tier-lists"])


@router.get("", response_model=list[TierEntry])
def get_tier_list(tier_service: TierListService = Depends(get_tier_service)) -> list[TierEntry]:
    """Return the computed tier list."""

    return tier_service.generate_tier_list()
