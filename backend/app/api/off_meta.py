"""Off-meta build endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from ..dependencies import get_off_meta_service
from ..models.build import Build
from ..services.off_meta_service import OffMetaDetectionService

router = APIRouter(prefix="/off-meta-builds", tags=["off-meta"])


@router.get("", response_model=list[Build])
def get_off_meta_builds(
    off_meta_service: OffMetaDetectionService = Depends(get_off_meta_service),
) -> list[Build]:
    """Return builds that have been flagged as off-meta."""

    return off_meta_service.detect_off_meta_builds()
