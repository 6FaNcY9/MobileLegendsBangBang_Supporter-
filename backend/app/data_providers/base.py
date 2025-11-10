"""Abstract data provider for Mobile Legends data."""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Dict, Any


class AbstractDataProvider(ABC):
    """Base interface for data providers."""

    @abstractmethod
    def get_heroes(self) -> List[Dict[str, Any]]:
        """Return raw hero dictionaries with build and metadata information."""

        raise NotImplementedError
