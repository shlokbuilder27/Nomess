# 📖 Nomess — The Complete User Guide
*A First-Principles Guide to Turning Mental Chaos into Museum-Grade Second Brain Artifacts*

---

## ⚡ Quick Start (Under 60 Seconds)

### 1. Launch Nomess
- **Method A**: Double-click `launch.bat` in the root folder.
- **Method B**: Run in PowerShell:
  ```powershell
  cd F:\APPS\Nomess
  npx tauri dev
  ```
- **Method C (Fast Browser Preview)**:
  ```powershell
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | **Restructure Note** | Opens the dual-input transformation chamber |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> | **Print &amp; Share** | Opens the precision print dialog / PDF export |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | **Save Vault** | Forces immediate atomic save to disk &amp; Google Drive mirror |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | **Search Notes** | Focuses the instant search filter in the left sidebar |

---

## 🧠 The Dual-Input Ingestion Chamber

Press **`Ctrl + N`** or click the **`+ Restructure Note`** button in the header.

### Option A: Raw Braindump (Text)
1. Paste unstructured bullet points, rambling audio transcripts, or fleeting thoughts into the textarea.
2. Select your target **Second Brain Template** (e.g. *Cornell Study*, *Feynman Technique*, *Carmack Architecture Spec*).
3. Click **"Elevate to Second Brain"**. Within 1–2 seconds, the raw dump is synthesized into an editorial layout.

### Option B: Photo Scan / OCR of Physical Notebooks
1. Switch to the **"Photo / Scan of Page"** tab.
2. Drag and drop a photo taken with your phone of a physical paper notebook, whiteboard diagram, or book margin.
3. Google Gemini Flash's multimodal vision engine will parse the handwriting, diagrams, and marginalia into structured text, mapping it directly into your chosen template.

---

## 🏛️ Selecting the Right Mental Model

| If your messy notes are... | Choose This Template | Mental Model Benefit |
| :--- | :--- | :--- |
| Lecture notes, textbook readings, podcasts | **Cornell Study System** | Left cue questions trigger active recall; bottom synthesis anchors retention. |
| Complex technical concepts, algorithmic theory | **Feynman First-Principles** | Forces an ELI5 analogy, exposes blind spots, and derives from scratch. |
| Hard company forks, architecture bets, buy vs build | **Executive Decisional Memo** | Context, explicit trade-off matrix, Type 1 vs Type 2 doors, 72-hr owners. |
| One atomic idea connecting to existing knowledge | **Zettelkasten Atomic Note** | One core thesis per card with `[[wiki-links]]` and tags. |
| Memory/latency budgets, API protocols, storage | **Architecture Spec** | Carmack-grade invariants, component topology, and graceful degradation. |
| Group discussions, calls, syncs | **Meeting &amp; Action Cluster** | Strips small-talk; locks in finalized agreements and RACI task owners. |
| Emotional frustration, deep work setbacks | **Stoic Daily Reflection** | Marcus Aurelius dichotomy of control, obstacle inversion (*Amor Fati*). |
| Book digests, interviews, essays | **Book &amp; Podcast Digest** | Strips 300 pages into 3 load-bearing insights and behavioral shifts. |
| Deployment workflows, release validation | **Precision SOP Checklist** | Flight-checklist with prerequisites, step verification, and abort triggers. |
| Startup ideas, product bets, investor briefs | **Founder Pitch Memo** | The secret insight, burning pain, unfair advantage, and compounding flywheel. |

---

## 📱 Seamless Phone Sync via Google Drive

Nomess believes in **local data sovereignty**. You do not need a paid SaaS subscription to read your notes on your phone:

1. Open **Settings** (`⚙️`) in the top-right header.
2. Under **Google Drive Mirror Folder**, enter your local Google Drive sync directory:
   - Example: `G:\My Drive\Nomess` or `C:\Users\YourName\Google Drive\Nomess`.
3. Click **Save Vault Config**.
4. Every note you create or edit in Nomess is automatically mirrored as a standard `.md` file into that folder.
5. On your phone, open the **Google Drive app** (or mobile markdown viewer like *Obsidian Mobile*, *Taio*, or *iA Writer*) to instantly view, read, and search all your formatted second-brain notes anywhere!

---

## 🖨️ Precision Editorial Print Suite

Nomess includes an engineered `@media print` stylesheet designed to look like classical printed editorial publications:
- **Zero Orphan Headings**: Section headings automatically stay glued to their text blocks (`break-after: avoid`).
- **A4 &amp; US Letter Margins**: 18mm margins calibrated for physical notebook binders.
- **True Carbon Black Ink**: Crisp 300+ DPI vector font rendering without browser UI chrome.

To print or export to vector PDF:
1. Click **Print &amp; Share** in the header (or press `Ctrl + P`).
2. Select **Physical Print / Vector PDF**.
3. Choose your physical printer or select **"Save as PDF"**.

---

## 🛡️ 100% Offline Air-Gapped Setup (Local Ollama)

If you are working with proprietary confidential ideas or want zero internet reliance:
1. Install [Ollama](https://ollama.ai) on your computer.
2. Pull a lightweight model:
   ```bash
   ollama run llama3.2
   ```
3. In Nomess, open **Settings (`⚙️`)** and select **Local Ollama**.
4. Set Endpoint to `http://localhost:11434` and Model to `llama3.2`.
5. Now, every single note transformation happens 100% locally on your own CPU/GPU with **zero data transmitted over the wire**.
