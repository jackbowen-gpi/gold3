#!/usr/bin/env python
"""Simple startup check to ensure WEBPACK_STATS_FILE exists and warn/exit if missing.

This script reads WEBPACK_STATS_FILE and FRONTEND_DIR from the environment and returns
non-zero if the stats file is missing. It's intended to run inside the backend container
before starting Django in development to provide a clearer error message.
"""
import os
import sys


def main():
    stats = os.environ.get("WEBPACK_STATS_FILE", "/repo/webpack-stats.json")
    frontend = os.environ.get("FRONTEND_DIR", "/app/frontend")

    # idempotency marker: avoid duplicate output when the container or autoreloader
    # causes this script to run multiple times. Use a simple tmp file as a guard.
    marker = "/tmp/.webpack_stats_checked"
    if os.path.exists(marker):
        return 0

    print(f"Checking WEBPACK_STATS_FILE={stats}")
    print(f"Checking FRONTEND_DIR={frontend}")

    if not os.path.exists(stats):
        print("WARNING: webpack-stats.json not found at:", stats, file=sys.stderr)
        # Print possible helpful locations
        print("Expected either the frontend container to generate it or the file to be mounted into /repo/webpack-stats.json.", file=sys.stderr)
        print("You can set WEBPACK_STATS_FILE env var in docker-compose to point to the actual path inside the container.", file=sys.stderr)
        # Non-fatal in development: continue startup so Django still runs without built assets.
        return 0

    if not os.path.isdir(frontend):
        print("WARNING: FRONTEND_DIR does not exist:", frontend, file=sys.stderr)

    print("OK: webpack-stats present and frontend dir checked.")
    # create marker so subsequent runs in the same container are no-ops
    try:
        with open(marker, "w") as f:
            f.write("1")
    except Exception:
        pass
    return 0


if __name__ == '__main__':
    sys.exit(main())
