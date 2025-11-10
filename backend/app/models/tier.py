"""Pydantic models describing tier list data."""
from __future__ import annotations

from pydantic import BaseModel, Field


class TierEntry(BaseModel):
    """Tier list entry for a hero."""

    hero_id: int = Field(..., description="Hero identifier that the tier is attached to")
    hero_name: str = Field(..., description="Hero name for quick display")
    tier: str = Field(..., description="Tier label (S, A, B, etc.)")
    win_rate: float = Field(..., ge=0, le=1, description="Win rate used in the calculation")
    usage_rate: float = Field(..., ge=0, le=1, description="Usage rate used in the calculation")
