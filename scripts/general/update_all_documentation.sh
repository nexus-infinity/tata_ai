#!/bin/bash
echo "=== Updating all Tata AI documentation ==="
echo "1. Updating main READMEs..."
node scripts/general/update_all_readmes.js
echo "2. Generating directory READMEs..."
node scripts/general/generate_directory_readmes.js
echo "=== Documentation update complete ==="
