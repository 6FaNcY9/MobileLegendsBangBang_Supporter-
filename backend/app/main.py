"""FastAPI application factory."""
import logging

from fastapi import FastAPI

from .api import heroes, tier_lists, off_meta
from .config import settings


def configure_logging() -> None:
    """Configure root logging for the service."""

    logging.basicConfig(level=settings.log_level, format="%(asctime)s [%(levelname)s] %(name)s - %(message)s")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""

    configure_logging()
    app = FastAPI(title=settings.app_name)

    app.include_router(heroes.router)
    app.include_router(tier_lists.router)
    app.include_router(off_meta.router)

    return app


app = create_app()
