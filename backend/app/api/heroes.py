"""Hero related API routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_build_service, get_tier_service
from ..models.hero import Hero
from ..services.build_service import BuildAggregationService
from ..services.tier_service import TierListService

router = APIRouter(prefix="/heroes", tags=["heroes"])


@router.get("", response_model=list[Hero])
def list_heroes(
    build_service: BuildAggregationService = Depends(get_build_service),
    tier_service: TierListService = Depends(get_tier_service),
) -> list[Hero]:
    """Return all heroes enriched with tier data."""

    heroes = build_service.list_heroes()
    tier_entries = {entry.hero_id: entry for entry in tier_service.generate_tier_list()}
    for hero in heroes:
        hero.tier = tier_entries.get(hero.id)
    return heroes


@router.get("/{hero_id}", response_model=Hero)
def get_hero(
    hero_id: int,
    build_service: BuildAggregationService = Depends(get_build_service),
    tier_service: TierListService = Depends(get_tier_service),
) -> Hero:
    """Return a single hero by id."""

    hero = build_service.get_hero(hero_id)
    if not hero:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hero not found")
    tier_entries = {entry.hero_id: entry for entry in tier_service.generate_tier_list()}
    hero.tier = tier_entries.get(hero.id)
    return hero
