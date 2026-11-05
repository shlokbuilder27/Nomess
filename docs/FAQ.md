# ❓ Frequently Asked Questions (FAQ) & Troubleshooting

---

### 1. How does Nomess differ from Obsidian or Notion?
- **Notion** is an all-in-one team workspace built on a remote relational database. It is slow to start, requires continuous internet, and locks your data into proprietary block schemas.
- **Obsidian** is an engineer's graph-theory playground. It excels at complex linked networks, but offers zero native cognitive restructuring for messy, raw input or photos of physical notebooks.
- **Nomess** is an **editorial thought-to-artifact engine**. It takes chaotic, ugly, unstructured text or scanned notebook pages and immediately structures them into museum-grade second-brain mental models (Cornell, Feynman, Executive Memos) using Dieter Rams typography. It is local-first, native, and completely serverless.

---

### 2. Does Nomess send my notes to the cloud?
**Only if you choose to use the Google Gemini API.**  
Even then, Nomess uses strict, stateless single-shot requests—no conversational history or personal database is retained on external servers.  
If you want **100% offline air-gapped privacy**, select **Local Ollama** or **Offline Heuristic Engine** in Settings. Zero network packets will leave your machine.

---

### 3. Where are my notes stored on disk? Is there any vendor lock-in?
All notes are written as plain UTF-8 `.md` files with standard RFC-822 / YAML frontmatter in your chosen directory (default: `~/Nomess_Vault/*.md`):
```markdown
---
id: "nm_20261105_001"
title: "Distributed Consensus: Paxos vs Raft"
template: "cornell-study"
created_at: "2026-11-05T16:00:00.000Z"
tags: ["consensus", "distributed-systems", "raft"]
tokens_used: 142
gdrive_synced: true
---

# Distributed Consensus: Paxos vs Raft
...
```
You can open this folder in Obsidian, VS Code, iA Writer, or standard Windows File Explorer at any time. **Zero proprietary database formats. Zero lock-in forever.**

---

### 4. Can I use photos of physical notebooks or whiteboard scrawls?
**Yes.** Open the Restructure Note modal (`Ctrl + N`), switch to **"Photo / Scan of Page"**, and drop a photo taken with your phone or webcam.  
Gemini Flash's multimodal vision engine will transcribe your handwriting, interpret drawings and tables, and map the content into your selected template.

---

### 5. How do I get a free Google Gemini API key?
1. Visit [Google AI Studio](https://aistudio.google.com).
2. Click **Get API key** &rarr; **Create API key**.
3. Copy the key and paste it into Nomess **Settings (`⚙️`)** &rarr; **Google Gemini API Key**.
4. The Gemini Flash free tier includes generous rate limits with zero token charges for everyday personal second-brain notes.

---

### 6. How do I sync to my phone without paying for a cloud subscription?
1. In Nomess **Settings (`⚙️`)**, set the **Google Drive Mirror Folder** to your local Google Drive directory (e.g. `G:\My Drive\Nomess` or `C:\Users\YourUser\Google Drive\Nomess`).
2. Google Drive for Desktop automatically syncs all `.md` files to the cloud.
3. Open the **Google Drive app** or any mobile Markdown reader (*Obsidian Mobile*, *Taio*, *iA Writer*) on your iPhone or Android device to read your formatted notes instantly!

---

### 7. Troubleshooting Common Issues

#### Problem: Window doesn't appear when running `npx tauri dev`
- **Solution**: Make sure `@tauri-apps/cli` is present. Run `npm install` once in the directory. You can also run `npm run dev` to access the full UI in your browser immediately.

#### Problem: "link.exe not found" during native Rust compilation
- **Solution**: Nomess is configured to use your local MinGW GCC toolchain (`stable-x86_64-pc-windows-gnu`). Ensure the GNU toolchain is active by running:
  ```powershell
  rustup default stable-x86_64-pc-windows-gnu
  ```

---

## 📬 Contact, Recommendations & Bug Reports

Have a feature recommendation, template idea, or facing an issue? We'd love to hear from you:

- ✉️ **Direct Email**: [komalmoradiya68@gmail.com](mailto:komalmoradiya68@gmail.com)
- 🐙 **GitHub Issues**: [github.com/shlokbuilder27/Nomess/issues](https://github.com/shlokbuilder27/Nomess/issues)
- 💬 **GitHub Discussions**: [github.com/shlokbuilder27/Nomess/discussions](https://github.com/shlokbuilder27/Nomess/discussions)
- 🌐 **Project Home**: [github.com/shlokbuilder27/Nomess](https://github.com/shlokbuilder27/Nomess)
