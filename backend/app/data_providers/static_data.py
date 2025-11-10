"""Fallback static data when the remote Mobile Legends API is unavailable."""
from __future__ import annotations

from typing import List, Dict, Any

DEFAULT_DATA: List[Dict[str, Any]] = [
    {
        "id": 1,
        "name": "Miya",
        "roles": ["Marksman"],
        "lanes": ["Gold"],
        "difficulty": "Easy",
        "builds": [
            {
                "items": [
                    "Swift Boots",
                    "Scarlet Phantom",
                    "Berserker's Fury",
                    "Windtalker",
                    "Blade of Despair",
                    "Malefic Roar",
                ],
                "emblems": ["Marksman"],
                "spells": ["Flicker"],
                "win_rate": 0.54,
                "usage_rate": 0.33,
                "playstyle_tags": ["Burst", "Kiting"],
            },
            {
                "items": [
                    "Swift Boots",
                    "Golden Staff",
                    "Corrosion Scythe",
                    "Demon Hunter Sword",
                    "Wind of Nature",
                    "Malefic Roar",
                ],
                "emblems": ["Marksman"],
                "spells": ["Inspire"],
                "win_rate": 0.58,
                "usage_rate": 0.07,
                "playstyle_tags": ["On-hit", "Sustained"],
            },
        ],
        "attributes": {
            "durability": 3,
            "offense": 8,
            "control_effect": 2,
            "difficulty": 4,
        },
    },
    {
        "id": 2,
        "name": "Khufra",
        "roles": ["Tank"],
        "lanes": ["Roam"],
        "difficulty": "Hard",
        "builds": [
            {
                "items": [
                    "Tough Boots",
                    "Dominance Ice",
                    "Antique Cuirass",
                    "Immortality",
                    "Athena's Shield",
                    "Guardian Helmet",
                ],
                "emblems": ["Tank"],
                "spells": ["Flicker"],
                "win_rate": 0.51,
                "usage_rate": 0.42,
                "playstyle_tags": ["Engage", "Crowd Control"],
            },
            {
                "items": [
                    "Tough Boots",
                    "Cursed Helmet",
                    "Clock of Destiny",
                    "Dominance Ice",
                    "Oracle",
                    "Immortality",
                ],
                "emblems": ["Tank", "Mage"],
                "spells": ["Petrify"],
                "win_rate": 0.56,
                "usage_rate": 0.05,
                "playstyle_tags": ["Hybrid", "AP Tank"],
            },
        ],
        "attributes": {
            "durability": 9,
            "offense": 4,
            "control_effect": 8,
            "difficulty": 6,
        },
    },
]
