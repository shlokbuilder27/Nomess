# 📐 NOMESS — The Editorial Second Brain Desktop App

> *"Design is not just what it looks like and feels like. Design is how it works."* — Steve Jobs  
> *"Never do with two chips what you can do with one."* — Steve Wozniak

**Nomess** transforms raw, fragmented, messy notes and scanned handwritten pages into museum-grade, structured **Second Brain** knowledge artifacts.

Built from first principles as a **native desktop application** (Tauri v2 + Rust) without running any bloated background localhost servers.

---

## 🏛️ The Dieter Rams / Editorial Bauhaus Design System
- **Archival Paper Canvas**: `#FBFBF9` 120gsm laid-cotton texture with hairline blind debossed rules (`#E6E4DC`).
- **Typographic Discipline**: Classical optical pairing (`Newsreader` serif for editorial presence, `Inter` for Swiss grotesque legibility, `JetBrains Mono` for code and YAML).
- **Zero Chrome Distraction**: Everything stripped down to the bare essence of the thought artifact.

---

## 🧠 The 10 Curated Second-Brain Templates
1. **Cornell Study System**: Dual-column active recall with synthesis anchor.
2. **Feynman First-Principles**: Explain like I'm five, expose knowledge gaps, first-principles rebuild.
3. **Executive Decisional Memo**: Context, Problem, Evaluated Options with explicit trade-offs, Irreversible vs Reversible classification.
4. **Zettelkasten Atomic Note**: Single concept thesis, interconnected `[[wiki-links]]`, reference source, and evergreen tags.
5. **First-Principles Architecture Spec**: System invariants, memory/latency budgets, component topology, and failure modes.
6. **Meeting & Action Cluster**: Resolves rambling discussion into finalized decisions and individual action items.
7. **Stoic Daily Reflection**: Marcus Aurelius format: Dichotomy of control, obstacle inversion (*Amor Fati*), evening postmortem.
8. **Book & Podcast Digest**: Strips filler stories into 3 load-bearing insights, memorable verbatim quotes, and behavioral changes.
9. **Precision SOP Checklist**: Gawande-style flight checklist with non-negotiable sequence and abort conditions.
10. **Founder Pitch Memo**: Peter Thiel / Steve Jobs thesis: The Secret Insight, status quo pain, unfair advantage, and compounding flywheel.

---

## ⚡ Native First-Principles Architecture
- **Desktop Runtime**: Tauri v2 + Rust OS Native WebView2 (Zero localhost server, sub-15MB installer, sub-35MB RAM).
- **Vault Contract**: Local-first UTF-8 `.md` files with RFC-822 / YAML frontmatter (`Nomess_Vault/*.md`). 100% interoperable with Obsidian, Git, or File Explorer.
- **Google Drive Sync**: Mirrors notes directly into your local Google Drive folder for instant mobile synchronization without proprietary cloud lock-in.
- **Token-Frugal AI Engine**: Strict single-shot JSON structured ingest using Google Gemini 1.5/2.0 Flash (with multimodal OCR for photos of physical notebooks) or local Ollama for 100% offline air-gapped notes.

---

## 🚀 Development & Build

### Running in Development
```bash
# Install dependencies
npm install

# Run native desktop app in dev mode
npx tauri dev

# Or run frontend interface preview
npm run dev
```

### Compiling Production Native Desktop Binary
```bash
npm run build
npx tauri build
```
The compiled Windows `.exe` installer will be located in:
`src-tauri/target/release/bundle/msi/` or `nsis/`.

---

## ⌨️ Keyboard Shortcuts
- `Ctrl + N`: Restructure New Messy Note (Brain Dump or Photo Scan)
- `Ctrl + P`: Precision Editorial Print & Vector PDF Export
- `Ctrl + S`: Save active note to local vault and Google Drive mirror
