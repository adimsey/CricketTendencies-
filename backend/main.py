"""
CricketTendencies FastAPI backend.
Serves processed player tendency data from JSON files.
"""
import os
import json
import glob
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CricketTendencies API",
    description="Cricket player tendency data — batting & bowling analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
SAMPLE_DIR = PROCESSED_DIR / "sample"


def get_data_dir(use_sample: bool = True) -> Path:
    """Return the data directory to use."""
    if use_sample or not any(PROCESSED_DIR.glob("*/index.json")):
        return SAMPLE_DIR
    return PROCESSED_DIR


def load_index() -> dict:
    idx_path = SAMPLE_DIR / "index.json"
    if idx_path.exists():
        with open(idx_path) as f:
            return json.load(f)
    return {}


def load_player_file(slug: str, fmt: str, role: str, sample: bool = True) -> Optional[dict]:
    data_dir = get_data_dir(sample)
    fname = f"{slug}_{fmt}_{role}.json"
    path = data_dir / fname
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return None


@app.get("/")
def root():
    return {"status": "ok", "service": "CricketTendencies API"}


@app.get("/api/teams")
def get_teams():
    """List all teams with available data."""
    index = load_index()
    teams = []
    for team_name, formats in index.items():
        available_formats = list(formats.keys())
        teams.append({
            "name": team_name,
            "formats": available_formats,
        })
    return {"teams": sorted(teams, key=lambda t: t["name"])}


@app.get("/api/players")
def get_players(team: str, format: str, role: str):
    """
    List players for a given team/format/role.
    role: 'batter' or 'bowler'
    """
    index = load_index()
    if team not in index:
        raise HTTPException(status_code=404, detail=f"Team '{team}' not found")
    if format not in index[team]:
        raise HTTPException(status_code=404, detail=f"Format '{format}' not available for {team}")

    role_key = "batters" if role == "batter" else "bowlers"
    players = index[team][format].get(role_key, [])
    return {"players": players, "team": team, "format": format, "role": role}


@app.get("/api/player")
def get_player(name: str, format: str, role: str):
    """
    Get tendency data for a specific player.
    name: Player full name (e.g. 'Virat Kohli')
    format: tests | odis | t20is | ipl
    role: batter | bowler
    """
    slug = name.lower().replace(" ", "_")
    role_short = "bat" if role == "batter" else "bowl"
    data = load_player_file(slug, format, role_short)

    if data is None:
        # Try processed dir
        data = load_player_file(slug, format, role_short, sample=False)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail=f"No {role} data found for {name} in {format}",
        )

    return data


@app.get("/api/formats")
def get_formats():
    return {
        "formats": [
            {"key": "tests", "label": "Tests", "overs": "unlimited", "phases": ["first_session", "second_session", "third_session"]},
            {"key": "odis", "label": "ODIs", "overs": 50, "phases": ["powerplay", "middle", "death"]},
            {"key": "t20is", "label": "T20Is", "overs": 20, "phases": ["powerplay", "middle", "death"]},
            {"key": "ipl", "label": "IPL", "overs": 20, "phases": ["powerplay", "middle", "death"]},
        ]
    }
