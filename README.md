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

## Deploy on Vercel (recommended)

1. Push this project to GitHub.
2. In Vercel, click **Add New Project** and import this repo.
3. Add these environment variables in Vercel Project Settings:
   - `ACCESS_CODE`
   - `JWT_SECRET`
   - `AUDIO_FILE` = `Aadhi Aadhi_FINAL_MASTER_48Khz_16BIt_07_.wav`
4. Deploy.

This repo includes Vercel serverless API routes in `api/`:
- `POST /api/login`
- `POST /api/logout`
- `GET /api/session`
- `GET /api/audio`

## Deploy on Render

1. Push this project to GitHub.
2. In Render, create a new Web Service from this repo.
3. Render auto-detects `render.yaml`.
4. Set secret env vars in Render:
   - `ACCESS_CODE`
   - `JWT_SECRET`
5. Deploy and open your service URL.

## GitHub Pages note

GitHub Pages is static hosting only, so it cannot securely protect your audio endpoint with server-side auth.  
If you deploy to GitHub Pages, your audio file can be downloaded by anyone with the direct file URL.
