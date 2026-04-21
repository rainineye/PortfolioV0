# push-craft.ps1 — finalize and push the Craft tab work in one go.
# Run from C:\Users\eau12\PortfolioV0 in PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\push-craft.ps1
# Or double-click if you allow PowerShell scripts.

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Step($n, $msg) {
  Write-Host "`n[$n] $msg" -ForegroundColor Cyan
}

# -------------------------------------------------------------------------
# 1. Clean stale lock files left from interrupted operations
# -------------------------------------------------------------------------
Step 1 "Cleaning stale .git/*.lock files"
Get-ChildItem -Path ".git" -Filter "*.lock" -Recurse -Force -ErrorAction SilentlyContinue |
  Remove-Item -Force -ErrorAction SilentlyContinue

# -------------------------------------------------------------------------
# 2. Unstage any unintended prior staging (e.g. a ghost vercel.json deletion)
# -------------------------------------------------------------------------
Step 2 "Unstaging any unintended staged changes"
git restore --staged vercel.json 2>$null

# -------------------------------------------------------------------------
# 3. Discard working-tree noise on files the Craft work did NOT touch.
#    These show as "modified" only because of line-ending (CRLF/LF) churn
#    introduced when the VM read/wrote them. Revert to exactly what origin/main
#    has so only real Craft changes remain.
# -------------------------------------------------------------------------
Step 3 "Discarding line-ending noise on unrelated files"
$noiseFiles = @(
  ".gitignore", "README.md", "about.html", "design_system.md", "vercel.json",
  "css/about.css", "css/main.css", "css/trillion.css",
  "006_Trillion.html",
  "js/navbar.js", "js/project-renderer.js", "js/projects-data.js", "js/trillion.js",
  "assets/README.md", "assets/autoscroll/README.md"
)
foreach ($f in $noiseFiles) {
  git checkout -- $f 2>$null
}
# Icon folders
git checkout -- "assets/icons/" 2>$null
git checkout -- "assets/library/icon-full-story-lock.svg" 2>$null
git checkout -- "assets/library/icon-full-story.svg" 2>$null
git checkout -- "assets/library/icon-product.svg" 2>$null
git checkout -- "assets/library/icon-whitepaper.svg" 2>$null

# -------------------------------------------------------------------------
# 4. Stage exactly the Craft work
# -------------------------------------------------------------------------
Step 4 "Staging Craft files"
git add index.html
git add js/main.js
git add css/craft.css
git add js/craft.js
git add js/craft-data.js
git add "assets/craft"
git add serve.bat
git add push-craft.ps1

# -------------------------------------------------------------------------
# 5. Show staged summary
# -------------------------------------------------------------------------
Step 5 "Staged summary"
git diff --cached --stat

Write-Host ""
Write-Host "If the list above looks right (Craft files only), press Enter to commit & push." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to abort." -ForegroundColor Yellow
Read-Host -Prompt "Ready?"

# -------------------------------------------------------------------------
# 6. Commit
# -------------------------------------------------------------------------
Step 6 "Committing"
$msgSubject = "feat(craft): add Craft tab with editorial slide viewer"
$msgBody = @"
17 slides across Objects / Drawings / Renders. Images use object-fit:
contain so nothing is cropped. Navigation uses keyboard arrows, touch
swipe, SVG Prev/Next buttons in the caption panel, and a subtle
neutral-grey dots progress indicator at the bottom.

Tabs and hash routing extended to include #craft alongside #about.
All captions are in English.
"@
git commit -m $msgSubject -m $msgBody

# -------------------------------------------------------------------------
# 7. Push
# -------------------------------------------------------------------------
Step 7 "Pushing to origin/main"
git push origin main

Write-Host ""
Write-Host "Done. Craft tab is live on the main branch." -ForegroundColor Green
Write-Host "Note: stash@{0} may still hold earlier Trillion working-tree state." -ForegroundColor DarkYellow
Write-Host "Drop it later if not needed:   git stash drop" -ForegroundColor DarkYellow
