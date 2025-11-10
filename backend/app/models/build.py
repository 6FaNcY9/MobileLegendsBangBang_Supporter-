"""Pydantic models describing hero build information."""
from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class Build(BaseModel):
    """Represents a recommended item build for a hero."""

    items: List[str] = Field(default_factory=list, description="Sequence of items to purchase")
    emblems: List[str] = Field(default_factory=list, description="Recommended emblems")
    spells: List[str] = Field(default_factory=list, description="Recommended battle spells")
    win_rate: float = Field(..., ge=0, le=1, description="Observed win rate for the build")
    usage_rate: float = Field(..., ge=0, le=1, description="Usage rate within sampled matches")
    playstyle_tags: List[str] = Field(
        default_factory=list,
        description="Tags describing how the build plays (e.g. Burst, Sustain)",
    )
    is_off_meta: bool = Field(
        False,
        description="Whether the build is considered off-meta based on heuristics.",
    )
