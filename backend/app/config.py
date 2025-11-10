"""Application configuration utilities."""
from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = Field("MLBB Supporter API", description="Human readable service name")
    data_source_url: str = Field(
        "https://mlbb.vercel.app/api/heroes",
        description="Primary URL for Mobile Legends data",
    )
    cache_ttl_seconds: int = Field(
        600,
        description="How long remote data responses remain cached before refresh is attempted.",
    )
    request_timeout: int = Field(
        5,
        description="Timeout in seconds for outbound HTTP calls to external data sources.",
    )
    log_level: str = Field("INFO", description="Python logging level for the application")

    model_config = SettingsConfigDict(env_prefix="MLBB_", case_sensitive=False)

    @field_validator("cache_ttl_seconds")
    def _validate_cache_ttl(cls, value: int) -> int:  # noqa: D401
        """Ensure cache TTL is positive."""

        if value <= 0:
            raise ValueError("cache_ttl_seconds must be greater than zero")
        return value

    @field_validator("request_timeout")
    def _validate_timeout(cls, value: int) -> int:  # noqa: D401
        """Ensure HTTP request timeout is positive."""

        if value <= 0:
            raise ValueError("request_timeout must be greater than zero")
        return value


@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings instance to avoid repeated environment parsing."""

    return Settings()


settings: Settings = get_settings()
