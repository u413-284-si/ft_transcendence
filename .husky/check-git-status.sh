#!/bin/sh

# See also https://stackoverflow.com/a/2659808

# Prevent push if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ You have uncommitted changes. Please commit before pushing."
    exit 1
fi

# Prevent push if there are untracked files
if [ -n "$(git ls-files --others --exclude-standard)" ]; then
    echo "❌ You have untracked files. Please commit or ignore them before pushing."
    exit 1
fi

echo "✅ All changes committed. Proceeding with push."
exit 0
