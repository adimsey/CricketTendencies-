"""
Vercel serverless entry point.
Imports the FastAPI app from backend/main.py and exposes it for Vercel's Python runtime.
"""
import sys
from pathlib import Path

# Add project root to Python path so backend package is importable
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.main import app  # noqa: F401 — Vercel uses the `app` name
