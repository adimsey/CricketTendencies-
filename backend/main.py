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


def has_real_data() -> bool:
    """Check if processed real data (non-sample) index exists."""
    return (PROCESSED_DIR / "index.json").exists()


def load_index() -> dict:
    if has_real_data():
        idx_path = PROCESSED_DIR / "index.json"
    else:
        idx_path = SAMPLE_DIR / "index.json"
    if idx_path.exists():
        with open(idx_path) as f:
            return json.load(f)
    return {}


def load_player_file(slug: str, fmt: str, role: str) -> Optional[dict]:
    data_dir = PROCESSED_DIR if has_real_data() else SAMPLE_DIR
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
            {"key": "bbl", "label": "BBL", "overs": 20, "phases": ["powerplay", "middle", "death"]},
            {"key": "psl", "label": "PSL", "overs": 20, "phases": ["powerplay", "middle", "death"]},
        ]
    }


@app.get("/api/search")
def search_players(q: str = "", format: Optional[str] = None, role: Optional[str] = None, limit: int = 30):
    """Search players by name substring across all teams."""
    if not q or len(q) < 2:
        return {"results": []}

    index = load_index()
    results = []
    seen: set = set()
    q_lower = q.lower()

    for team, formats_data in index.items():
        for fmt, roles_data in formats_data.items():
            if format and fmt != format:
                continue
            for role_key, players in roles_data.items():
                inferred_role = "batter" if role_key == "batters" else "bowler"
                if role and inferred_role != role:
                    continue
                for player in players:
                    key = (player, fmt, inferred_role)
                    if q_lower in player.lower() and key not in seen:
                        seen.add(key)
                        results.append({
                            "name": player,
                            "team": team,
                            "format": fmt,
                            "role": inferred_role,
                        })
                        if len(results) >= limit:
                            return {"results": results}

    return {"results": results}
