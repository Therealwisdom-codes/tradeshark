# TradeShark Ltd — Railway Deployment & Features Guide

This guide outlines how to deploy TradeShark Ltd to **Railway** with automatic deployments on Git push, plus documentation on the newly added Copy Trading and Segregated Payment systems.

---

## 1. Project Railway Architecture

TradeShark has been upgraded from a Vercel static deployment to a full production Node.js + Express web service configured for Railway:

| Component | Description |
|-----------|-------------|
| **`server.js`** | Production Express server serving the Vite-built production SPA (`/dist`) with SPA routing fallback (`/* -> index.html`) and `/api/health` monitoring. Automatically binds to Railway's dynamic `PORT` environment variable (`0.0.0.0:${PORT}`). |
| **`railway.json`** | Railway deployment manifest specifying the `NIXPACKS` builder, build command (`npm install && npm run build`), and restart policies. |
| **`Procfile`** | Process declaration: `web: npm start`. |
| **`nixpacks.toml`** | Nixpacks environment config specifying Node.js 20 LTS runtime. |
| **`package.json`** | Added production start script: `"start": "node server.js"`. |
| **`vercel.json`** | Removed to prevent platform conflicts. |

## 2. Dedicated Portal Links (Separated from Frontend)

The front-end website header and footer are clean public marketing pages with all login/admin desk triggers removed. Use these dedicated URLs to access the respective portals:

* **Public Marketing Website:** `https://your-domain.up.railway.app/`
* **Client / User Login Portal:** `https://your-domain.up.railway.app/#login` (or `/#user`, `/login`)
* **Institutional Admin Back-Office:** `https://your-domain.up.railway.app/#admin` (or `/admin`)

---

## 3. Initialize Git & Push to GitHub (One-Time Setup)

Since you don't currently have a Git repository for this project, run these commands in your project root (`c:\Users\USER\Documents\tradesharkltd-main\tradesharkltd-main`):

```bash
# 1. Stage all project files
git add .

# 2. Create initial commit
git commit -m "Convert TradeShark to Railway deployment + add copy trading & payment enhancements"

# 3. Push to your repository
git branch -M main
git push -u origin main
```

> **Note:** If Git reports that another process is running, simply delete `.git/index.lock` (`del .git\index.lock` in Windows or `rm .git/index.lock`) before running `git add .`.

---

## 3. Connect to Railway for Auto-Deployments

1. Go to [railway.com](https://railway.com) and log in with your GitHub account.
2. Click **"+ New Project"** > **"Deploy from GitHub repo"**.
3. Select your repository: **`Therealwisdom-codes/tradeshark`**.
4. Railway will automatically:
   - Detect the `railway.json`, `Procfile`, and `nixpacks.toml`
   - Run `npm install && npm run build`
   - Start the Express server via `npm start`
   - Assign a public domain (or you can generate one under **Settings > Domains**)
5. **Auto Deployment is Active:** Every time you run `git push origin main`, Railway will automatically build and deploy the update with zero downtime.

---

## 4. Alternative: Deploy directly with Railway CLI (No GitHub needed)

If you prefer to deploy directly from your local terminal without creating a GitHub repository:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project and deploy
railway init
railway up
```

---

## 5. Overview of New Features & Corrections

### A. Enhanced Copy Trading & Trader Selection
- **Visual Trader Profiles with Lively Photos:** All Pro Traders now feature high-resolution profile photography (`avatarUrl`), verified badges, 24M compounding returns, risk scores (1–10), copiers count, and top holdings badges (e.g. `BTC`, `NVDA`, `MSFT`).
- **Discover Pro Traders Tab:** Users can explore the directory of certified lead investors, search by name/asset/strategy, and filter by risk level (Low, Medium, High).
- **Copy Configuration Modal:** Users can click **"Copy This Trader"** on any lead investor to set:
  - Custom allocation amount ($USD) with quick presets ($500, $1,000, $2,500, $5,000, Max Available).
  - Stop Loss Protection slider (e.g. halt copying if equity drops by 15%).
  - Checkbox to mirror open trades immediately.
- **Active Copies Management:** Users can view their live mirrored portfolio, mark-to-market equity, cumulative P&L ($ and %), and stop copying with automatic fund reconciliation.
- **Multi-Trader Copying:** Users can copy multiple Pro Traders simultaneously with independent allocation pools.

### B. Admin Pro Trader Management
- **Manage Pro Traders Tab:** Available in the Admin Portal under the **TRADING DESK** navigation group.
- **Add Pro Trader Modal:** Administrators can publish new lead investors to the live directory:
  - Full Name & Handle (`@handle`)
  - Profile Photo (one-click selection from curated portrait presets or custom image URL)
  - Professional Role / Strategy (e.g. *Macro Crypto Lead*, *Quant Factor Lead*)
  - 24-Month Return (%)
  - Risk Score calibration slider (1–10)
  - Active copiers count & top holdings tags
  - Detailed investment philosophy & biography
- **Live Directory Sync:** Traders added by the admin immediately appear in the client's Copy Trading tab, and actions are logged to the regulatory audit trail.

### C. Realistic Segregated Deposit & Payment System
- **Segregated Bank Transfer Coordinates:**
  - Beneficiary: *TradeShark Global Securities Ltd (Client Segregated)*
  - Bank Name: *Barclays Bank PLC - Corporate Banking Desk*
  - Account Number / IBAN: *GB29 BUKB 2000 0084 7291 03*
  - SWIFT / BIC: *BUKBGB22*
  - Sort Code / Routing: *20-00-84*
  - **Dynamic Payment Reference:** Unique code (`TS-USR891-DEP`) that users must include for automated matching, with one-click copy feedback.
- **Official Crypto Transfer Rails:**
  - Multi-network selection: **USDT (TRC20)**, **USDT (ERC20)**, **Bitcoin (BTC)**, and **Ethereum (ETH)**.
  - Official TradeShark segregated deposit wallet addresses with copy button.
  - Interactive visual QR code matrix for mobile wallet scanning.
  - Network confirmation estimates and safety instructions.
- **Security Authentication & Proof Verification:**
  - Transaction tracking hash / TXID input.
  - Receipt / proof of transfer file attachment.
  - 2FA Security Confirmation Code verification.
- **Treasury Approval Queue Sync:**
  - Submissions register as `Pending` funding transactions in the Admin Treasury Queue.
  - Live 4-step progress tracker for client reassurance.
  - Administrators can review the deposit proof, verify incoming settlement, and click "Approve" to instantly credit the client's live trading account.
