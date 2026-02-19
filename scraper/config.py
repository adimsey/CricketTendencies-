"""
Configuration for Cricsheet data download and processing.
"""

CRICSHEET_BASE = "https://cricsheet.org/downloads"

# Format slugs as used by Cricsheet
FORMATS = {
    "tests": {"url": f"{CRICSHEET_BASE}/tests_male_csv2.zip", "label": "Test"},
    "odis": {"url": f"{CRICSHEET_BASE}/odis_male_csv2.zip", "label": "ODI"},
    "t20is": {"url": f"{CRICSHEET_BASE}/t20s_male_csv2.zip", "label": "T20I"},
    "ipl": {"url": f"{CRICSHEET_BASE}/ipl_male_csv2.zip", "label": "IPL"},
    "bbl": {"url": f"{CRICSHEET_BASE}/bbl_male_csv2.zip", "label": "BBL"},
    "psl": {"url": f"{CRICSHEET_BASE}/psl_male_csv2.zip", "label": "PSL"},
}

# Phases by format
PHASES = {
    "tests": {
        "first_session": (1, 30),
        "second_session": (31, 60),
        "third_session": (61, 90),
    },
    "odis": {
        "powerplay": (1, 10),
        "middle": (11, 40),
        "death": (41, 50),
    },
    "t20is": {
        "powerplay": (1, 6),
        "middle": (7, 15),
        "death": (16, 20),
    },
    "ipl": {
        "powerplay": (1, 6),
        "middle": (7, 15),
        "death": (16, 20),
    },
}

# Scoring zones for wagon wheel (angle ranges in degrees from straight)
WAGON_WHEEL_ZONES = {
    "fine_leg": (157.5, 202.5),
    "square_leg": (112.5, 157.5),
    "midwicket": (67.5, 112.5),
    "mid_on": (22.5, 67.5),
    "straight": (-22.5, 22.5),
    "mid_off": (-67.5, -22.5),
    "cover": (-112.5, -67.5),
    "point": (-157.5, -112.5),
    "third_man": (202.5, 247.5),  # wraps around
}

RAW_DATA_DIR = "../data/raw"
PROCESSED_DATA_DIR = "../data/processed"
SAMPLE_DATA_DIR = "../data/processed/sample"
