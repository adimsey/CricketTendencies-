"""
Download ball-by-ball CSV data from Cricsheet.org for all configured formats.
Run this once to populate data/raw/ before processing.
"""
import os
import zipfile
import requests
from tqdm import tqdm
from config import FORMATS, RAW_DATA_DIR


def download_file(url: str, dest_path: str) -> None:
    """Stream-download a file with a progress bar."""
    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()
    total = int(r.headers.get("content-length", 0))
    with open(dest_path, "wb") as f, tqdm(
        desc=os.path.basename(dest_path),
        total=total,
        unit="B",
        unit_scale=True,
        unit_divisor=1024,
    ) as bar:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
            bar.update(len(chunk))


def extract_zip(zip_path: str, extract_to: str) -> None:
    """Extract a zip file into a subdirectory."""
    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(extract_to)
    os.remove(zip_path)


def main():
    os.makedirs(RAW_DATA_DIR, exist_ok=True)

    for fmt_key, fmt in FORMATS.items():
        dest_dir = os.path.join(RAW_DATA_DIR, fmt_key)
        if os.path.exists(dest_dir) and os.listdir(dest_dir):
            print(f"[{fmt['label']}] Already downloaded — skipping.")
            continue

        os.makedirs(dest_dir, exist_ok=True)
        zip_path = os.path.join(RAW_DATA_DIR, f"{fmt_key}.zip")

        print(f"[{fmt['label']}] Downloading from {fmt['url']}")
        try:
            download_file(fmt["url"], zip_path)
            print(f"[{fmt['label']}] Extracting...")
            extract_zip(zip_path, dest_dir)
            files = len([f for f in os.listdir(dest_dir) if f.endswith(".csv")])
            print(f"[{fmt['label']}] Done — {files} match files")
        except Exception as e:
            print(f"[{fmt['label']}] ERROR: {e}")


if __name__ == "__main__":
    main()
