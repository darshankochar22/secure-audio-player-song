# Secure Audio Player

A password-protected Node.js audio player that streams your WAV file only after authentication.

## Features

- Access code login before playback
- Signed auth cookie (HTTP-only, strict same-site)
- Protected streaming endpoint with byte-range support
- Security headers via Helmet
- Ready for Render deployment

## Local setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env`
3. Update `.env` values for:
   - `ACCESS_CODE`
   - `JWT_SECRET` (long random string)
4. Start app:
   - `npm start`
5. Open:
   - `http://localhost:3000`

## Push to GitHub

1. Initialize git:
   - `git init`
2. Add and commit:
   - `git add .`
   - `git commit -m "Create secure audio player app"`
3. Create empty GitHub repo and copy its URL.
4. Connect and push:
   - `git branch -M main`
   - `git remote add origin <YOUR_GITHUB_REPO_URL>`
   - `git push -u origin main`

## Deploy on Render

1. Push this project to GitHub.
2. In Render, create a new Web Service from this repo.
3. Render auto-detects `render.yaml`.
4. Set secret env vars in Render:
   - `ACCESS_CODE`
   - `JWT_SECRET`
5. Deploy and open your service URL.
