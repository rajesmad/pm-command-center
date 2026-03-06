# Thursday PM Command Center

A browser-based project status dashboard for DS Implementation weekly PM review calls.

## What It Does

- PMs submit weekly RAG status updates before Thursday's call
- Ragu sees a live consolidated dashboard sorted by priority (Red → Amber → Green)
- Auto-generates the Thursday call agenda with time allocations
- All data stored permanently in Google Sheets

## Live Tool

**[→ Open PM Command Center](https://YOUR-USERNAME.github.io/pm-command-center/)**

> First-time users: paste the Google Apps Script URL in the banner at the top and click Connect.

## Setup

See the full setup guide in the `docs/` folder or refer to the Word document provided separately.

### Files

| File | Purpose |
|------|---------|
| `index.html` | The main tool — open this in any browser |
| `docs/apps-script.gs` | Paste this into Google Apps Script (backend) |
| `README.md` | This file |

## Stack

- Pure HTML/CSS/JS — no framework, no dependencies
- Google Apps Script — free serverless backend
- Google Sheets — permanent data storage
- GitHub Pages — free static hosting

## Access Levels

| Role | Access |
|------|--------|
| PM / End User | Opens the tool URL, submits updates via form |
| Ragu (Dashboard) | Opens the tool URL, views Dashboard + Agenda tabs |
| Admin | Google Sheet (data), Apps Script (backend code) |
