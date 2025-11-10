"""Pydantic models for hero data."""
from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from .build import Build
from .tier import TierEntry


class Hero(BaseModel):
    """Represents a Mobile Legends hero with associated builds."""

    id: int = Field(..., description="Hero identifier")
    name: str = Field(..., description="Hero name")
    roles: List[str] = Field(default_factory=list, description="Hero roles (e.g. Marksman)")
    lanes: List[str] = Field(default_factory=list, description="Preferred lanes")
    difficulty: str = Field("Unknown", description="Difficulty description from the dataset")
    builds: List[Build] = Field(default_factory=list, description="Recommended builds for the hero")
    attributes: Dict[str, int] = Field(
        default_factory=dict,
        description="Arbitrary hero attribute values from the data provider",
    )
    tier: Optional[TierEntry] = Field(None, description="Calculated tier information")
