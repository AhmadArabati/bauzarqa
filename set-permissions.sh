#!/bin/bash

CHROME_PATH="/opt/render/.cache/puppeteer/chrome/linux-133.0.6943.53/chrome-linux64/chrome"

if [ -f "$CHROME_PATH" ]; then
  chmod +x "$CHROME_PATH"
  echo "Permissions set for Chromium."
else
  echo "Chromium binary not found at $CHROME_PATH"
fi