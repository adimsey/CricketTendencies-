"""
Generate realistic sample data for demo players.
Run this to populate data/processed/sample/ without needing Cricsheet downloads.
"""
import os
import json
import random
import math

SAMPLE_DIR = "../data/processed/sample"

SAMPLE_BATTERS = [
    {
        "name": "Virat Kohli", "team": "India", "country": "in",
        "formats": {
            "tests": {"runs": 8848, "innings": 169, "dismissals": 152, "average": 49.95, "strike_rate": 55.8, "hundreds": 29, "fifties": 28, "fours": 1001, "sixes": 27},
            "odis": {"runs": 13906, "innings": 275, "dismissals": 228, "average": 58.07, "strike_rate": 93.25, "hundreds": 50, "fifties": 72, "fours": 1159, "sixes": 145},
            "t20is": {"runs": 4188, "innings": 125, "dismissals": 99, "average": 52.65, "strike_rate": 137.04, "hundreds": 1, "fifties": 38, "fours": 367, "sixes": 122},
            "ipl": {"runs": 8004, "innings": 243, "dismissals": 209, "average": 36.20, "strike_rate": 129.95, "hundreds": 8, "fifties": 54, "fours": 700, "sixes": 250},
        },
        "phases": {
            "tests": {"first_session": (55.2, 42.1), "second_session": (51.8, 58.3), "third_session": (44.2, 63.5)},
            "odis": {"powerplay": (41.5, 85.2), "middle": (62.3, 91.5), "death": (48.8, 118.4)},
            "t20is": {"powerplay": (43.2, 125.8), "middle": (55.9, 132.4), "death": (38.7, 158.2)},
            "ipl": {"powerplay": (38.4, 123.5), "middle": (42.1, 128.9), "death": (35.2, 152.4)},
        },
        "wagon": [0.07, 0.10, 0.18, 0.12, 0.08, 0.14, 0.16, 0.10, 0.05],
        "dismissals_by": {"caught": 68, "lbw": 22, "bowled": 31, "run out": 8, "stumped": 4, "hit wicket": 2},
    },
    {
        "name": "Steve Smith", "team": "Australia", "country": "au",
        "formats": {
            "tests": {"runs": 9480, "innings": 182, "dismissals": 158, "average": 58.61, "strike_rate": 55.1, "hundreds": 32, "fifties": 38, "fours": 1082, "sixes": 44},
            "odis": {"runs": 4740, "innings": 131, "dismissals": 114, "average": 42.12, "strike_rate": 86.85, "hundreds": 12, "fifties": 29, "fours": 377, "sixes": 88},
            "t20is": {"runs": 984, "innings": 57, "dismissals": 46, "average": 26.59, "strike_rate": 121.78, "hundreds": 0, "fifties": 5, "fours": 80, "sixes": 35},
            "ipl": {"runs": 2804, "innings": 95, "dismissals": 85, "average": 33.58, "strike_rate": 127.12, "hundreds": 1, "fifties": 17, "fours": 212, "sixes": 105},
        },
        "phases": {
            "tests": {"first_session": (62.1, 45.2), "second_session": (58.9, 53.8), "third_session": (52.4, 61.2)},
            "odis": {"powerplay": (35.8, 80.5), "middle": (48.3, 86.4), "death": (42.1, 105.8)},
            "t20is": {"powerplay": (28.4, 115.2), "middle": (32.8, 122.5), "death": (28.9, 148.3)},
            "ipl": {"powerplay": (35.2, 118.4), "middle": (38.5, 126.8), "death": (29.4, 146.2)},
        },
        "wagon": [0.05, 0.09, 0.12, 0.10, 0.09, 0.12, 0.20, 0.15, 0.08],
        "dismissals_by": {"caught": 72, "lbw": 35, "bowled": 28, "run out": 6, "stumped": 3, "hit wicket": 1},
    },
    {
        "name": "Joe Root", "team": "England", "country": "gb",
        "formats": {
            "tests": {"runs": 12617, "innings": 253, "dismissals": 225, "average": 50.64, "strike_rate": 56.2, "hundreds": 35, "fifties": 65, "fours": 1524, "sixes": 67},
            "odis": {"runs": 6973, "innings": 169, "dismissals": 150, "average": 47.77, "strike_rate": 86.52, "hundreds": 16, "fifties": 54, "fours": 619, "sixes": 88},
            "t20is": {"runs": 1671, "innings": 57, "dismissals": 47, "average": 35.55, "strike_rate": 125.23, "hundreds": 0, "fifties": 12, "fours": 148, "sixes": 55},
            "ipl": {"runs": 0, "innings": 0, "dismissals": 0, "average": 0, "strike_rate": 0, "hundreds": 0, "fifties": 0, "fours": 0, "sixes": 0},
        },
        "phases": {
            "tests": {"first_session": (52.8, 44.5), "second_session": (56.2, 57.8), "third_session": (45.8, 65.4)},
            "odis": {"powerplay": (38.4, 82.3), "middle": (55.8, 87.2), "death": (41.2, 108.5)},
            "t20is": {"powerplay": (32.5, 118.4), "middle": (42.8, 128.2), "death": (31.4, 152.8)},
            "ipl": {"powerplay": (0, 0), "middle": (0, 0), "death": (0, 0)},
        },
        "wagon": [0.06, 0.11, 0.14, 0.11, 0.10, 0.12, 0.18, 0.12, 0.06],
        "dismissals_by": {"caught": 95, "lbw": 52, "bowled": 45, "run out": 15, "stumped": 8, "hit wicket": 3},
    },
    {
        "name": "Rohit Sharma", "team": "India", "country": "in",
        "formats": {
            "tests": {"runs": 4301, "innings": 85, "dismissals": 73, "average": 46.75, "strike_rate": 59.2, "hundreds": 12, "fifties": 17, "fours": 502, "sixes": 98},
            "odis": {"runs": 10709, "innings": 243, "dismissals": 211, "average": 49.57, "strike_rate": 89.95, "hundreds": 31, "fifties": 55, "fours": 990, "sixes": 244},
            "t20is": {"runs": 4231, "innings": 151, "dismissals": 129, "average": 32.05, "strike_rate": 140.89, "hundreds": 5, "fifties": 29, "fours": 435, "sixes": 191},
            "ipl": {"runs": 6628, "innings": 243, "dismissals": 223, "average": 31.17, "strike_rate": 130.55, "hundreds": 2, "fifties": 44, "fours": 636, "sixes": 261},
        },
        "phases": {
            "tests": {"first_session": (44.2, 52.8), "second_session": (52.1, 60.4), "third_session": (38.5, 68.2)},
            "odis": {"powerplay": (52.8, 92.5), "middle": (55.4, 88.2), "death": (42.8, 118.5)},
            "t20is": {"powerplay": (48.5, 138.4), "middle": (38.2, 138.8), "death": (29.5, 162.4)},
            "ipl": {"powerplay": (45.2, 140.8), "middle": (35.8, 132.5), "death": (28.4, 158.2)},
        },
        "wagon": [0.09, 0.14, 0.18, 0.10, 0.08, 0.10, 0.14, 0.12, 0.05],
        "dismissals_by": {"caught": 75, "lbw": 28, "bowled": 35, "run out": 12, "stumped": 5, "hit wicket": 1},
    },
    {
        "name": "Kane Williamson", "team": "New Zealand", "country": "nz",
        "formats": {
            "tests": {"runs": 8896, "innings": 175, "dismissals": 155, "average": 54.19, "strike_rate": 52.8, "hundreds": 32, "fifties": 36, "fours": 1004, "sixes": 35},
            "odis": {"runs": 6554, "innings": 157, "dismissals": 140, "average": 47.48, "strike_rate": 81.82, "hundreds": 13, "fifties": 44, "fours": 575, "sixes": 62},
            "t20is": {"runs": 2265, "innings": 89, "dismissals": 80, "average": 33.31, "strike_rate": 125.58, "hundreds": 0, "fifties": 18, "fours": 201, "sixes": 65},
            "ipl": {"runs": 2502, "innings": 89, "dismissals": 79, "average": 31.67, "strike_rate": 121.59, "hundreds": 0, "fifties": 20, "fours": 218, "sixes": 72},
        },
        "phases": {
            "tests": {"first_session": (57.2, 43.8), "second_session": (60.5, 53.2), "third_session": (49.8, 61.8)},
            "odis": {"powerplay": (40.2, 78.5), "middle": (52.8, 82.4), "death": (38.5, 102.8)},
            "t20is": {"powerplay": (35.8, 118.2), "middle": (38.4, 128.5), "death": (28.2, 148.2)},
            "ipl": {"powerplay": (32.4, 118.8), "middle": (36.5, 122.4), "death": (25.8, 142.5)},
        },
        "wagon": [0.06, 0.10, 0.14, 0.12, 0.10, 0.14, 0.18, 0.11, 0.05],
        "dismissals_by": {"caught": 80, "lbw": 38, "bowled": 25, "run out": 7, "stumped": 4, "hit wicket": 1},
    },
    {
        "name": "Babar Azam", "team": "Pakistan", "country": "pk",
        "formats": {
            "tests": {"runs": 4581, "innings": 97, "dismissals": 88, "average": 45.81, "strike_rate": 50.2, "hundreds": 10, "fifties": 28, "fours": 538, "sixes": 16},
            "odis": {"runs": 5795, "innings": 134, "dismissals": 118, "average": 56.22, "strike_rate": 88.01, "hundreds": 19, "fifties": 34, "fours": 545, "sixes": 54},
            "t20is": {"runs": 4107, "innings": 116, "dismissals": 103, "average": 43.71, "strike_rate": 128.95, "hundreds": 4, "fifties": 34, "fours": 390, "sixes": 100},
            "ipl": {"runs": 0, "innings": 0, "dismissals": 0, "average": 0, "strike_rate": 0, "hundreds": 0, "fifties": 0, "fours": 0, "sixes": 0},
        },
        "phases": {
            "tests": {"first_session": (48.5, 42.5), "second_session": (50.2, 51.8), "third_session": (42.8, 58.4)},
            "odis": {"powerplay": (48.5, 85.4), "middle": (62.4, 90.2), "death": (44.8, 112.8)},
            "t20is": {"powerplay": (45.8, 122.4), "middle": (48.5, 130.5), "death": (35.2, 155.2)},
            "ipl": {"powerplay": (0, 0), "middle": (0, 0), "death": (0, 0)},
        },
        "wagon": [0.05, 0.09, 0.15, 0.13, 0.09, 0.13, 0.18, 0.12, 0.06],
        "dismissals_by": {"caught": 58, "lbw": 20, "bowled": 28, "run out": 9, "stumped": 6, "hit wicket": 1},
    },
    {
        "name": "David Warner", "team": "Australia", "country": "au",
        "formats": {
            "tests": {"runs": 8786, "innings": 176, "dismissals": 162, "average": 44.59, "strike_rate": 71.5, "hundreds": 26, "fifties": 37, "fours": 1066, "sixes": 108},
            "odis": {"runs": 6932, "innings": 161, "dismissals": 151, "average": 45.31, "strike_rate": 96.19, "hundreds": 22, "fifties": 33, "fours": 702, "sixes": 200},
            "t20is": {"runs": 2265, "innings": 92, "dismissals": 84, "average": 32.14, "strike_rate": 142.69, "hundreds": 1, "fifties": 18, "fours": 218, "sixes": 99},
            "ipl": {"runs": 6397, "innings": 184, "dismissals": 168, "average": 41.56, "strike_rate": 140.06, "hundreds": 4, "fifties": 58, "fours": 637, "sixes": 234},
        },
        "phases": {
            "tests": {"first_session": (45.8, 65.8), "second_session": (48.2, 72.4), "third_session": (40.5, 78.2)},
            "odis": {"powerplay": (55.8, 98.5), "middle": (48.4, 96.2), "death": (38.8, 118.4)},
            "t20is": {"powerplay": (38.5, 148.2), "middle": (35.8, 142.5), "death": (29.8, 165.8)},
            "ipl": {"powerplay": (42.5, 150.8), "middle": (45.2, 140.5), "death": (32.8, 158.4)},
        },
        "wagon": [0.08, 0.12, 0.20, 0.12, 0.06, 0.10, 0.14, 0.12, 0.06],
        "dismissals_by": {"caught": 82, "lbw": 35, "bowled": 38, "run out": 5, "stumped": 2, "hit wicket": 2},
    },
    {
        "name": "Ben Stokes", "team": "England", "country": "gb",
        "formats": {
            "tests": {"runs": 6469, "innings": 169, "dismissals": 147, "average": 36.56, "strike_rate": 58.4, "hundreds": 13, "fifties": 30, "fours": 738, "sixes": 150},
            "odis": {"runs": 2924, "innings": 105, "dismissals": 92, "average": 40.33, "strike_rate": 95.64, "hundreds": 3, "fifties": 21, "fours": 258, "sixes": 108},
            "t20is": {"runs": 928, "innings": 51, "dismissals": 43, "average": 24.42, "strike_rate": 132.28, "hundreds": 0, "fifties": 5, "fours": 76, "sixes": 51},
            "ipl": {"runs": 921, "innings": 36, "dismissals": 33, "average": 27.90, "strike_rate": 136.74, "hundreds": 0, "fifties": 4, "fours": 72, "sixes": 52},
        },
        "phases": {
            "tests": {"first_session": (38.2, 52.8), "second_session": (40.5, 61.4), "third_session": (35.8, 72.5)},
            "odis": {"powerplay": (35.8, 88.4), "middle": (42.5, 94.8), "death": (38.2, 118.5)},
            "t20is": {"powerplay": (28.4, 122.5), "middle": (30.8, 132.8), "death": (25.5, 158.4)},
            "ipl": {"powerplay": (28.5, 128.4), "middle": (32.8, 138.5), "death": (22.5, 162.8)},
        },
        "wagon": [0.08, 0.13, 0.18, 0.08, 0.05, 0.10, 0.16, 0.14, 0.08],
        "dismissals_by": {"caught": 68, "lbw": 24, "bowled": 32, "run out": 10, "stumped": 4, "hit wicket": 3},
    },
]

SAMPLE_BOWLERS = [
    {
        "name": "James Anderson", "team": "England", "country": "gb",
        "formats": {
            "tests": {"wickets": 704, "overs": 5386.4, "runs": 17298, "economy": 2.95, "average": 26.45, "strike_rate": 53.8},
            "odis": {"wickets": 269, "overs": 1803.5, "runs": 7861, "economy": 4.86, "average": 29.22, "strike_rate": 36.0},
            "t20is": {"wickets": 18, "overs": 98.0, "runs": 568, "economy": 5.80, "average": 31.56, "strike_rate": 32.7},
        },
        "phases": {
            "tests": {"first_session": (2.8, 12), "second_session": (2.95, 8), "third_session": (3.10, 15)},
            "odis": {"powerplay": (4.2, 45), "middle": (4.9, 35), "death": (5.8, 18)},
            "t20is": {"powerplay": (5.2, 8), "middle": (5.8, 5), "death": (7.2, 4)},
        },
        "wicket_types": {"caught": 320, "lbw": 180, "bowled": 165, "caught & bowled": 39},
        "pitch_preferred_length": "good",
        "pitch_preferred_line": "outside_off",
        "vs_rhb_economy": 2.85,
        "vs_lhb_economy": 3.12,
    },
    {
        "name": "Pat Cummins", "team": "Australia", "country": "au",
        "formats": {
            "tests": {"wickets": 305, "overs": 2358.1, "runs": 7104, "economy": 3.01, "average": 23.31, "strike_rate": 46.4},
            "odis": {"wickets": 231, "overs": 1418.4, "runs": 6278, "economy": 4.92, "average": 27.17, "strike_rate": 33.1},
            "t20is": {"wickets": 67, "overs": 262.5, "runs": 1468, "economy": 5.59, "average": 21.91, "strike_rate": 23.5},
            "ipl": {"wickets": 174, "overs": 620.4, "runs": 4262, "economy": 8.65, "average": 24.49, "strike_rate": 16.9},
        },
        "phases": {
            "tests": {"first_session": (3.0, 18), "second_session": (3.05, 12), "third_session": (3.18, 22)},
            "odis": {"powerplay": (4.5, 52), "middle": (4.8, 42), "death": (5.8, 28)},
            "t20is": {"powerplay": (4.8, 18), "middle": (5.6, 12), "death": (7.8, 10)},
            "ipl": {"powerplay": (7.2, 38), "middle": (8.4, 22), "death": (11.2, 28)},
        },
        "wicket_types": {"caught": 125, "lbw": 65, "bowled": 88, "caught & bowled": 15, "stumped": 5},
        "pitch_preferred_length": "good",
        "pitch_preferred_line": "off_stump",
        "vs_rhb_economy": 3.02,
        "vs_lhb_economy": 2.95,
    },
    {
        "name": "Jasprit Bumrah", "team": "India", "country": "in",
        "formats": {
            "tests": {"wickets": 195, "overs": 1124.2, "runs": 3354, "economy": 2.98, "average": 19.54, "strike_rate": 39.5},
            "odis": {"wickets": 149, "overs": 751.2, "runs": 3582, "economy": 4.77, "average": 24.04, "strike_rate": 30.2},
            "t20is": {"wickets": 90, "overs": 348.0, "runs": 2032, "economy": 5.83, "average": 22.58, "strike_rate": 23.2},
            "ipl": {"wickets": 154, "overs": 556.3, "runs": 3839, "economy": 6.90, "average": 24.93, "strike_rate": 21.7},
        },
        "phases": {
            "tests": {"first_session": (2.85, 22), "second_session": (3.05, 15), "third_session": (3.15, 28)},
            "odis": {"powerplay": (4.2, 48), "middle": (4.8, 38), "death": (5.2, 42)},
            "t20is": {"powerplay": (4.5, 22), "middle": (5.8, 18), "death": (6.5, 28)},
            "ipl": {"powerplay": (5.8, 35), "middle": (6.8, 28), "death": (8.5, 52)},
        },
        "wicket_types": {"caught": 65, "lbw": 38, "bowled": 52, "caught & bowled": 8, "stumped": 12},
        "pitch_preferred_length": "yorker",
        "pitch_preferred_line": "off_stump",
        "vs_rhb_economy": 5.85,
        "vs_lhb_economy": 5.72,
    },
    {
        "name": "Kagiso Rabada", "team": "South Africa", "country": "za",
        "formats": {
            "tests": {"wickets": 305, "overs": 1872.4, "runs": 5821, "economy": 3.11, "average": 22.05, "strike_rate": 42.5},
            "odis": {"wickets": 177, "overs": 886.0, "runs": 4138, "economy": 4.67, "average": 23.38, "strike_rate": 30.0},
            "t20is": {"wickets": 81, "overs": 298.2, "runs": 1788, "economy": 5.99, "average": 22.07, "strike_rate": 22.1},
            "ipl": {"wickets": 130, "overs": 442.0, "runs": 3412, "economy": 7.72, "average": 26.25, "strike_rate": 20.4},
        },
        "phases": {
            "tests": {"first_session": (3.05, 20), "second_session": (3.12, 14), "third_session": (3.25, 24)},
            "odis": {"powerplay": (4.4, 55), "middle": (4.7, 40), "death": (5.5, 35)},
            "t20is": {"powerplay": (5.2, 20), "middle": (5.9, 15), "death": (7.5, 22)},
            "ipl": {"powerplay": (7.0, 32), "middle": (7.8, 28), "death": (10.2, 35)},
        },
        "wicket_types": {"caught": 122, "lbw": 58, "bowled": 100, "caught & bowled": 18, "stumped": 4},
        "pitch_preferred_length": "good",
        "pitch_preferred_line": "off_stump",
        "vs_rhb_economy": 6.15,
        "vs_lhb_economy": 6.05,
    },
    {
        "name": "Shaheen Afridi", "team": "Pakistan", "country": "pk",
        "formats": {
            "tests": {"wickets": 138, "overs": 908.3, "runs": 2688, "economy": 2.96, "average": 24.12, "strike_rate": 48.9},
            "odis": {"wickets": 103, "overs": 478.4, "runs": 2276, "economy": 4.76, "average": 22.10, "strike_rate": 27.9},
            "t20is": {"wickets": 83, "overs": 299.2, "runs": 1762, "economy": 5.89, "average": 21.23, "strike_rate": 21.6},
            "ipl": {"wickets": 23, "overs": 72.1, "runs": 610, "economy": 8.46, "average": 26.52, "strike_rate": 18.8},
        },
        "phases": {
            "tests": {"first_session": (2.9, 18), "second_session": (3.0, 12), "third_session": (3.18, 20)},
            "odis": {"powerplay": (4.2, 45), "middle": (4.85, 32), "death": (5.4, 28)},
            "t20is": {"powerplay": (5.0, 25), "middle": (5.95, 16), "death": (7.2, 18)},
            "ipl": {"powerplay": (7.5, 8), "middle": (8.5, 5), "death": (11.0, 10)},
        },
        "wicket_types": {"caught": 52, "lbw": 25, "bowled": 48, "caught & bowled": 8, "stumped": 2},
        "pitch_preferred_length": "full",
        "pitch_preferred_line": "outside_off",
        "vs_rhb_economy": 5.8,
        "vs_lhb_economy": 6.15,
    },
    {
        "name": "Trent Boult", "team": "New Zealand", "country": "nz",
        "formats": {
            "tests": {"wickets": 317, "overs": 1980.5, "runs": 5855, "economy": 2.96, "average": 27.74, "strike_rate": 56.2},
            "odis": {"wickets": 180, "overs": 862.0, "runs": 3978, "economy": 4.62, "average": 22.10, "strike_rate": 28.7},
            "t20is": {"wickets": 65, "overs": 226.0, "runs": 1295, "economy": 5.73, "average": 19.92, "strike_rate": 20.8},
            "ipl": {"wickets": 107, "overs": 362.5, "runs": 2888, "economy": 7.95, "average": 26.99, "strike_rate": 20.3},
        },
        "phases": {
            "tests": {"first_session": (2.85, 16), "second_session": (3.0, 11), "third_session": (3.12, 18)},
            "odis": {"powerplay": (4.1, 52), "middle": (4.65, 38), "death": (5.5, 32)},
            "t20is": {"powerplay": (4.8, 20), "middle": (5.75, 14), "death": (7.2, 18)},
            "ipl": {"powerplay": (7.0, 30), "middle": (8.0, 22), "death": (10.5, 32)},
        },
        "wicket_types": {"caught": 130, "lbw": 55, "bowled": 98, "caught & bowled": 25, "stumped": 4},
        "pitch_preferred_length": "full",
        "pitch_preferred_line": "outside_off",
        "vs_rhb_economy": 4.55,
        "vs_lhb_economy": 4.75,
    },
]

TEAMS = {
    "India": ["in", "Virat Kohli", "Rohit Sharma", "Jasprit Bumrah"],
    "Australia": ["au", "Steve Smith", "David Warner", "Pat Cummins"],
    "England": ["gb", "Joe Root", "Ben Stokes", "James Anderson", "Trent Boult"],
    "New Zealand": ["nz", "Kane Williamson", "Trent Boult"],
    "Pakistan": ["pk", "Babar Azam", "Shaheen Afridi"],
    "South Africa": ["za", "Kagiso Rabada"],
}


def generate_wagon_wheel(weights, total_runs, boundaries_4, boundaries_6):
    zones = ["fine_leg", "square_leg", "midwicket", "mid_on",
             "straight", "mid_off", "cover", "point", "third_man"]
    angles = [-160, -120, -80, -40, 0, 40, 80, 120, 160]
    result = []
    for i, z in enumerate(zones):
        w = weights[i]
        result.append({
            "zone": z,
            "runs": round(total_runs * w),
            "fours": round(boundaries_4 * w),
            "sixes": round(boundaries_6 * w),
            "angle": angles[i],
        })
    return result


def generate_pitch_map(preferred_length, preferred_line):
    lengths = ["full_toss", "yorker", "full", "good", "short_of_good", "short"]
    lines = ["wide_outside_off", "outside_off", "off_stump", "middle_stump", "leg_stump", "outside_leg"]
    cells = []
    for li, length in enumerate(lengths):
        for lo, line in enumerate(lines):
            is_preferred = (length == preferred_length or line == preferred_line)
            base_freq = 0.6 if is_preferred else 0.2
            freq = max(0.01, base_freq + random.gauss(0, 0.15))
            balls = max(1, int(freq * 1000))
            wicket_rate = 0.06 if is_preferred else 0.03
            cells.append({
                "length": length,
                "line": line,
                "balls": balls,
                "wickets": max(0, int(balls * wicket_rate + random.gauss(0, 1))),
                "economy": round(max(2.0, random.gauss(5.5 if is_preferred else 7.0, 0.8)), 2),
            })
    return cells


def generate_batter_data(batter, fmt_key):
    if fmt_key not in batter["formats"]:
        return None
    s = batter["formats"][fmt_key]
    if s["innings"] == 0:
        return None
    ph_data = batter["phases"].get(fmt_key, {})
    phase_labels = {
        "tests": ["first_session", "second_session", "third_session"],
        "odis": ["powerplay", "middle", "death"],
        "t20is": ["powerplay", "middle", "death"],
        "ipl": ["powerplay", "middle", "death"],
    }.get(fmt_key, ["powerplay", "middle", "death"])

    phases = {}
    for ph in phase_labels:
        avg, sr = ph_data.get(ph, (30.0, 80.0))
        phases[ph] = {
            "average": avg,
            "strike_rate": sr,
            "boundary_pct": round(sr * 0.15 + random.uniform(-2, 2), 1),
            "dot_pct": round(max(5, 60 - sr * 0.25 + random.uniform(-5, 5)), 1),
        }

    return {
        "name": batter["name"],
        "team": batter["team"],
        "country": batter["country"],
        "format": fmt_key,
        "role": "batter",
        "stats": {
            "runs": s["runs"],
            "innings": s["innings"],
            "dismissals": s["dismissals"],
            "not_outs": s["innings"] - s["dismissals"],
            "average": s["average"],
            "strike_rate": s["strike_rate"],
            "hundreds": s["hundreds"],
            "fifties": s["fifties"],
            "fours": s["fours"],
            "sixes": s["sixes"],
            "boundary_pct": round((s["fours"] * 4 + s["sixes"] * 6) / max(1, s["runs"]) * 100 * 0.8, 1),
            "dot_pct": round(random.uniform(25, 45), 1),
        },
        "phases": phases,
        "dismissals_breakdown": batter["dismissals_by"],
        "wagon_wheel": generate_wagon_wheel(batter["wagon"], s["runs"], s["fours"], s["sixes"]),
        "vs_pace": {
            "average": round(s["average"] * random.uniform(0.9, 1.1), 2),
            "strike_rate": round(s["strike_rate"] * random.uniform(0.88, 1.05), 2),
        },
        "vs_spin": {
            "average": round(s["average"] * random.uniform(0.95, 1.15), 2),
            "strike_rate": round(s["strike_rate"] * random.uniform(0.92, 1.12), 2),
        },
        "vs_left_arm": {
            "average": round(s["average"] * random.uniform(0.88, 1.05), 2),
            "strike_rate": round(s["strike_rate"] * random.uniform(0.90, 1.08), 2),
        },
        "vs_right_arm": {
            "average": round(s["average"] * random.uniform(0.95, 1.08), 2),
            "strike_rate": round(s["strike_rate"] * random.uniform(0.95, 1.05), 2),
        },
    }


def generate_bowler_data(bowler, fmt_key):
    if fmt_key not in bowler["formats"]:
        return None
    s = bowler["formats"][fmt_key]
    if s["wickets"] == 0:
        return None
    ph_data = bowler["phases"].get(fmt_key, {})
    phase_labels = {
        "tests": ["first_session", "second_session", "third_session"],
        "odis": ["powerplay", "middle", "death"],
        "t20is": ["powerplay", "middle", "death"],
        "ipl": ["powerplay", "middle", "death"],
    }.get(fmt_key, ["powerplay", "middle", "death"])

    phases = {}
    for ph in phase_labels:
        eco, wkts = ph_data.get(ph, (5.0, 10))
        phases[ph] = {
            "economy": eco,
            "wickets": wkts,
            "average": round(eco * random.uniform(6, 10), 2),
            "boundary_pct": round(random.uniform(8, 18), 1),
            "dot_pct": round(random.uniform(35, 55), 1),
        }

    return {
        "name": bowler["name"],
        "team": bowler["team"],
        "country": bowler["country"],
        "format": fmt_key,
        "role": "bowler",
        "stats": {
            "overs": s["overs"],
            "wickets": s["wickets"],
            "runs_conceded": s["runs"],
            "economy": s["economy"],
            "average": s["average"],
            "strike_rate": s["strike_rate"],
        },
        "phases": phases,
        "wicket_types": bowler["wicket_types"],
        "pitch_map": generate_pitch_map(bowler["pitch_preferred_length"], bowler["pitch_preferred_line"]),
        "vs_rhb": {"economy": bowler["vs_rhb_economy"], "wickets": round(s["wickets"] * 0.65)},
        "vs_lhb": {"economy": bowler["vs_lhb_economy"], "wickets": round(s["wickets"] * 0.35)},
    }


def main():
    random.seed(42)
    os.makedirs(SAMPLE_DIR, exist_ok=True)

    players_index = {}  # team -> format -> {batters, bowlers}

    all_formats = ["tests", "odis", "t20is", "ipl"]

    for batter in SAMPLE_BATTERS:
        for fmt_key in all_formats:
            data = generate_batter_data(batter, fmt_key)
            if not data:
                continue
            slug = batter["name"].lower().replace(" ", "_")
            filename = f"{slug}_{fmt_key}_bat.json"
            with open(os.path.join(SAMPLE_DIR, filename), "w") as f:
                json.dump(data, f, indent=2)
            team = batter["team"]
            players_index.setdefault(team, {}).setdefault(fmt_key, {"batters": [], "bowlers": []})
            if batter["name"] not in players_index[team][fmt_key]["batters"]:
                players_index[team][fmt_key]["batters"].append(batter["name"])

    for bowler in SAMPLE_BOWLERS:
        for fmt_key in all_formats:
            data = generate_bowler_data(bowler, fmt_key)
            if not data:
                continue
            slug = bowler["name"].lower().replace(" ", "_")
            filename = f"{slug}_{fmt_key}_bowl.json"
            with open(os.path.join(SAMPLE_DIR, filename), "w") as f:
                json.dump(data, f, indent=2)
            team = bowler["team"]
            players_index.setdefault(team, {}).setdefault(fmt_key, {"batters": [], "bowlers": []})
            if bowler["name"] not in players_index[team][fmt_key]["bowlers"]:
                players_index[team][fmt_key]["bowlers"].append(bowler["name"])

    # Write index
    with open(os.path.join(SAMPLE_DIR, "index.json"), "w") as f:
        json.dump(players_index, f, indent=2)

    print(f"Sample data generated in {SAMPLE_DIR}/")
    print(f"Teams: {list(players_index.keys())}")


if __name__ == "__main__":
    main()
