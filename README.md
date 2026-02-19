# CricketTendencies

Interactive cricket player tendency analysis across all formats. Select a team, format, and player to explore batting or bowling tendencies with animated visualisations.

## Features

- **Batting**: Wagon wheel scoring zones, phase analysis (powerplay/middle/death), shot distribution, vs pace/spin, dismissal types
- **Bowling**: Pitch map (line & length heatmap), wicket types, economy by phase, vs LHB/RHB
- **Formats**: Tests, ODIs, T20Is, IPL/T20 leagues
- **Animations**: D3.js animated wagon wheels, pitch maps, Framer Motion stat cards

## Project Structure

```
CricketTendencies/
├── scraper/         # Python data pipeline (downloads & processes Cricsheet data)
├── backend/         # FastAPI REST API serving player tendency data
├── data/
│   ├── raw/         # Raw Cricsheet downloads (gitignored — run scraper)
│   └── processed/   # Processed player JSON files
│       └── sample/  # Pre-built sample data for immediate demo
└── frontend/        # React + TypeScript + Vite web app
```

## Quick Start

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Data Pipeline (optional — sample data included)
```bash
cd scraper
pip install -r requirements.txt
python download_cricsheet.py   # Downloads all Cricsheet match files
python process_data.py          # Processes into per-player JSON
```

## Data Source

Ball-by-ball data from [Cricsheet.org](https://cricsheet.org) — free, open, comprehensive coverage of Tests, ODIs, T20Is, and major T20 leagues.
