# Verify ECRLink
ECR Link - coastal road immersive experience.
## Launch
`npm install`; the playwright config serves the app itself.
## Doctor
`python3 .cursor/skills/verify-ecrlink/verify.py`
## Drive
Runs the repo playwright suite (10 tests) in real Chromium.
## Evidence
`.cursor/skills/verify-ecrlink/evidence.json`
## Cleanup
Playwright manages its server.
## Known boundaries
Chromium coverage as configured in the repo.
