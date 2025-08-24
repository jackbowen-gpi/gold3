#!/bin/bash
set -euo pipefail

# wrapper to the real build script
exec "$(dirname "$0")/config/deployment/render_build.sh" "$@"
