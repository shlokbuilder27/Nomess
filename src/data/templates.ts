import type { NoteTemplate } from '../types/note';

export const SECOND_BRAIN_TEMPLATES: NoteTemplate[] = [
  {
    id: 'cornell-study',
    name: 'Cornell Study System',
    category: 'Learning',
    tagline: 'Dual-column active recall with synthesis anchor',
    description: 'Divides thoughts into Left Cues/Questions (for active recall), Right Detailed Synthesized Notes, and a Bottom First-Principles Summary.',
    iconName: 'Columns',
    promptInstructions: `Transform the messy raw notes into a high-yield Cornell Study Sheet.
Output format:
# {Title}

> **Core Subject & Scope:** {One concise sentence}

### Cues & Key Questions (Recall Prompts)
- [Q1]: {Key question}
- [Q2]: {Fundamental distinction}
- [Q3]: {Formula or mental model trigger}

### Synthesized Notes & Core Concepts
- **{Concept 1}**: {Precise explanation}
- **{Concept 2}**: {Mechanism, evidence, or derivation}
- **{Key Nuance}**: {Common pitfall or edge case}

### Actionable Summary (The Synthesis Anchor)
> {2-3 sentence distillation explaining the essence as if teaching someone in 30 seconds.}`,
    sampleInput: `Lecture on distributed consensus: Paxos and Raft. Paxos hard to understand, 2 phases prepare and accept. Raft easier, leader election, log replication, safety. If leader dies, election timeout. Term numbers prevent stale leaders. Heartbeats reset timer. Consensus is agreement on state machine log.`,
    skeletonMarkdown: `# Distributed Consensus: Paxos vs Raft

> **Core Subject & Scope:** Mechanisms for achieving state machine consensus across untrusted asynchronous networks.

### Cues & Key Questions (Recall Prompts)
- **Why consensus?**: How do nodes agree on ordering without a central clock?
- **Paxos vs Raft**: What makes Raft more cognitively ergonomic than Multi-Paxos?
- **Split-Vote Prevention**: How does randomized election timeout prevent split-brain deadlock?

### Synthesized Notes & Core Concepts
- **Consensus Objective**: Replicated state machine safety—every honest node executes commands in the identical deterministic sequence.
- **Raft Architecture**:
  - *Leader Election*: Heartbeat suppression with randomized countdown (150-300ms).
  - *Log Replication*: Two-phase commit controlled by the single recognized leader.
  - *Term Monotonicity*: Stale leaders instantly step down upon witnessing higher terms.

### Actionable Summary (The Synthesis Anchor)
> Raft decomposes consensus into isolated leader election, log broadcast, and state safety. By making leader election deterministic through randomized timeouts, it achieves equivalent mathematical safety to Paxos while eliminating state ambiguity.`
  },
  {
    id: 'feynman-technique',
    name: 'Feynman First-Principles',
    category: 'Learning',
    tagline: 'Explain like I am five, pinpoint gaps, derive from scratch',
    description: 'Forces complete understanding by demanding clear analogies, zero jargon, identified blindspots, and a first-principles rebuild.',
    iconName: 'Flame',
    promptInstructions: `Apply Richard Feynman's learning technique to the messy raw thoughts.
Output format:
# {Topic / Thesis}

> **The 30-Second Child Analogy (ELI5):** {Explain the whole thing without any academic jargon using a visceral real-world metaphor.}

### First-Principles Breakdown
1. **The Invariant Law**: {What is physically or mathematically non-negotiable?}
2. **How It Actually Works**: {Step-by-step mechanical progression}
3. **The Common Misconception**: {What do 90% of people misunderstand about this?}

### Identified Knowledge Gaps & Questions
- [ ] {Question where understanding becomes fuzzy}
- [ ] {Edge case that requires deeper verification}

### First-Principles Derivation
\`\`\`
{Simple ASCII / flow diagram or step derivation}
\`\`\``,
    sampleInput: `Quantum computing qubits superposition entanglement. Bit is 0 or 1, qubit can be both until measured. Entanglement spooky action at distance. Bloch sphere represents state. Grover search faster, Shor breaks RSA. Decoherence is hard because environmental noise destroys phase.`,
    skeletonMarkdown: `# Quantum Superposition & Entanglement

> **The 30-Second Child Analogy (ELI5):** A regular computer bit is like a coin lying flat on a table—it is strictly Heads or Tails. A qubit is a coin spinning rapidly in mid-air: while spinning, it holds a probability blend of both states until you slap your hand down to observe it.

### First-Principles Breakdown
1. **The Invariant Law**: Quantum states exist as linear probability amplitudes in Hilbert space until collapsed by measurement.
2. **Superposition**: Not "doing two calculations at once", but rather phase-interference between computational paths where wrong answers cancel out and right answers amplify.
3. **Entanglement**: The joint state cannot be factored into two independent single-particle states; measuring one instantly reveals the correlated property of the other regardless of distance.

### Identified Knowledge Gaps & Questions
- [ ] How does quantum error correction maintain phase coherence without directly measuring (and destroying) the logical qubit?
- [ ] What is the exact mathematical difference between classical mixed-state uncertainty and pure quantum superposition?`
  },
  {
    id: 'executive-memo',
    name: 'Executive Decisional Memo',
    category: 'Strategy',
    tagline: 'Amazon/Stripe 6-pager condensed to a decisive sheet',
    description: 'Strips fluff to focus on Context, The Hard Problem, Strategic Options with explicit trade-offs, The Irreversible Decision, and Next Milestones.',
    iconName: 'Briefcase',
    promptInstructions: `Condense the messy notes into a crisp, decisive Executive Memo in the style of Steve Jobs / Andy Grove.
Output format:
# Decision Memo: {Clear Outcome Title}

| Metric / Dimension | Detail |
| :--- | :--- |
| **Owner / Decider** | {Name / Role} |
| **Decision Type** | Type 1 (Irreversible Door) / Type 2 (Reversible Experiment) |
| **Urgency** | {Immediate / High / Strategic} |

### 1. Strategic Context & Problem Statement
{Define the core tension in 2-3 uncompromising sentences. What happens if we do nothing?}

### 2. Evaluated Options & Trade-Offs
- **Option A: {Name}**
  - *Upside*: {Key leverage}
  - *Downside / Cost*: {Risk}
- **Option B: {Name}**
  - *Upside*: {Key leverage}
  - *Downside / Cost*: {Risk}

### 3. The Recommended Decision & Rationale
> **Decision**: {Definitive chosen option}.
> **First-Principles Reason**: {Why this choice creates an unfair long-term compounding advantage.}

### 4. Immediate 72-Hour Commitments
- [ ] **Owner**: {Action item with deadline}`,
    sampleInput: `Should we build Nomess as an Electron app or Tauri? Electron is easy, tons of docs, everyone uses it. But it hogs 200MB memory on idle, ships with 80MB chromium installer, feels sluggish. Tauri uses Rust, uses native OS webview, 10MB installer, 30MB memory, but Rust compilation is slower. We want top performance and elegance.`,
    skeletonMarkdown: `# Decision Memo: Native Architecture for Nomess

| Metric / Dimension | Detail |
| :--- | :--- |
| **Owner / Decider** | Shlok (Technical Lead & Founder) |
| **Decision Type** | Type 1 (Irreversible Foundational Framework) |
| **Urgency** | High (Sprint 0 Blocker) |

### 1. Strategic Context & Problem Statement
Our core value proposition is an ultra-fast, aesthetically transcendent desktop Second Brain. If our binary weighs 120MB and consumes 300MB RAM just sitting open, we compromise our Dieter Rams ethos before the user writes a single note.

### 2. Evaluated Options & Trade-Offs
- **Option A: Electron.js**
  - *Upside*: Ubiquitous ecosystem, rapid prototyping, familiar web packaging.
  - *Downside / Cost*: Massive memory bloat, 80MB+ installer, unacceptable latency for keyboard-first editors.
- **Option B: Tauri v2 + Rust**
  - *Upside*: Sub-15MB installer, zero background port-binding, native OS WebView2 rendering, memory usage under 35MB.
  - *Downside / Cost*: Requires Rust toolchain and strict memory-safe IPC boundary.

### 3. The Recommended Decision & Rationale
> **Decision**: Adopt Tauri v2 with Rust backend.
> **First-Principles Reason**: Software dignity and speed are features. Tauri gives us native binary respect while maintaining modern typography control via CSS.`
  },
  {
    id: 'zettelkasten',
    name: 'Zettelkasten Atomic Note',
    category: 'Thinking',
    tagline: 'One idea per card, cross-linked into a compound web',
    description: 'Niklas Luhmann style slip-box note. Isolates a single conceptual unit with unique identifier, connections to parents, and forward hooks.',
    iconName: 'Network',
    promptInstructions: `Convert the messy notes into an Atomic Zettelkasten card.
Output format:
# [[{Atomic Concept Title}]]

**UID**: \`{Timestamp/ID}\` | **Tags**: #{tag1} #{tag2}

### The Core Thesis
> {Single sentence capturing the irreducible truth of this concept.}

### Elaboration & Mechanism
{Explain why this is true, how it operates, and why it matters in 1-2 paragraphs.}

### Interconnected Nodes
- ⬆️ **Upward Context**: [[Parent Concept]]
- ↔️ **Parallel Tension**: [[Contrasting Concept]]
- ⬇️ **Downward Concrete Manifestation**: [[Applied Example]]

### Raw Spark / Citation
*Source*: {Source attribution, page, or original brainstorm snippet}`,
    sampleInput: `Thought on compounding: Einstein said compounding is 8th wonder. It applies to code and knowledge too, not just money. When you learn first principles, new knowledge fits into existing trees rather than isolated facts. It compounds exponentially.`,
    skeletonMarkdown: `# [[Knowledge Compounding on First Principles]]

**UID**: \`20261105-1650\` | **Tags**: #mental-models #epistemology #compounding

### The Core Thesis
> Knowledge compounds exponentially only when organized onto a structured lattice of first principles rather than stored as disconnected facts.

### Elaboration & Mechanism
When information is memorized as raw trivia, cognitive retrieval scales linearly (\(O(n)\)). In contrast, when grounded in foundational axioms (physics, thermodynamics, algorithmic complexity), every incoming insight attaches to a pre-existing branch, reducing cognitive friction and unlocking combinatorial creativity.

### Interconnected Nodes
- ⬆️ **Upward Context**: [[First-Principles Reasoning]]
- ↔️ **Parallel Tension**: [[The Collector's Fallacy]]
- ⬇️ **Downward Concrete Manifestation**: [[Nomess Vault Schema Architecture]]`
  },
  {
    id: 'architecture-spec',
    name: 'First-Principles Architecture Spec',
    category: 'Execution',
    tagline: 'Carmack/Wozniak style engineering blueprint',
    description: 'A pure technical contract: System Invariants, Memory & Latency Targets, Component Topology, IPC Boundary, and Failure Modes.',
    iconName: 'Cpu',
    promptInstructions: `Convert the messy technical scribbles into a Carmack-grade Architecture Spec.
Output format:
# Technical Spec: {System Name}

### 1. Invariants & Budget Constraints
- **Latency Budget**: {e.g. Sub-16ms frame render / Sub-50ms IPC}
- **Memory Footprint**: {e.g. < 40MB resident RAM}
- **Storage Contract**: {e.g. 100% plain UTF-8 text on disk, zero proprietary binary blobs}

### 2. Data Flow & Component Topology
\`\`\`
[Input Pipeline] ---> [Rust Native Core] ---> [Encrypted Storage]
\`\`\`

### 3. Interface & Type Definition
\`\`\`typescript
// Core Data Schema
\`\`\`

### 4. Failure Modes & Graceful Degradation
| Failure Event | Fallback Behavior | Data Loss Risk |
| :--- | :--- | :--- |
| Cloud API Offline | Fallback to local heuristic / Ollama | 0% (Saved to local vault) |`,
    sampleInput: `Architecture for our vault saver. We need to save files as markdown with yaml headers. Path should be configurable. When user edits note, debounce 500ms then write to file. If disk write fails show banner. Also mirror into google drive folder if selected.`,
    skeletonMarkdown: `# Technical Spec: Nomess Local Vault Storage Engine

### 1. Invariants & Budget Constraints
- **Latency Budget**: Disk write debounce under 400ms; disk read under 5ms.
- **Memory Footprint**: Vault index held in resident memory under 12MB for 5,000 notes.
- **Storage Contract**: Pure UTF-8 \`.md\` with RFC-822 / YAML frontmatter header. Zero lock-in.

### 2. Component Topology
\`\`\`
[User Input] -> [Debounce Ring (400ms)] -> [Tauri IPC Channel] -> [Atomic File Write (.tmp -> rename)] -> [GDrive Folder Mirror]
\`\`\`

### 3. Failure Modes & Graceful Degradation
| Failure Event | Fallback Behavior | Data Loss Risk |
| :--- | :--- | :--- |
| Disk Full / Permissions Error | Persist to in-memory ring buffer & alert user | 0% (Retained in memory until resolved) |
| Cloud Sync Timeout | Queue offline delta sync for background retry | 0% (Local vault remains primary source of truth) |`
  },
  {
    id: 'meeting-decisional',
    name: 'Meeting & Action Cluster',
    category: 'Execution',
    tagline: 'Eliminate pointless chat: decisions, trade-offs, and RACI owners',
    description: 'Transforms rambling meeting transcripts into crisp agreements, unresolved tensions, and explicit individual action items.',
    iconName: 'Users',
    promptInstructions: `Parse the meeting ramblings into an uncompromising Meeting & Action Cluster.
Output format:
# Meeting Brief: {Topic}

**Date**: {Date} | **Participants**: {List}

### Key Disagreements & Debates
- *Debate 1*: {Perspective A vs Perspective B and the tension}

### Finalized Decisions
1. **{Decision 1}**: {What was locked in}
2. **{Decision 2}**: {What was deferred}

### Action Items & Ownership
| Task Description | Owner | Strict Deadline | Verification Criteria |
| :--- | :--- | :--- | :--- |
| {Task} | {Name} | {Date} | {How we verify done} |`,
    sampleInput: `Sync with frontend team today. Discussed color scheme. Some wanted dark mode default, others wanted paper white. Decided to launch with Dieter Rams warm paper white as default, with dark mode toggle. Also talked about Google Drive sync. Shlok will write the Tauri fs plugin integration by Friday. Need test cases by Monday.`,
    skeletonMarkdown: `# Meeting Brief: UI Theme & Vault Sync Alignment

**Date**: 2026-11-05 | **Participants**: Shlok, Design Team, Core Eng

### Key Disagreements & Debates
- *Visual Theme*: Dark-mode default vs Editorial Paper-laid aesthetic. Resolved that our brand identity is tactile paper clarity; paper-laid \`#FBFBF9\` is the flagship experience.

### Finalized Decisions
1. **Primary Palette**: Ship Dieter Rams Bauhaus warm paper (\`#FBFBF9\`) as standard canvas.
2. **Local-First Precedence**: Vault writes to disk first before attempting any cloud replication.

### Action Items & Ownership
| Task Description | Owner | Strict Deadline | Verification Criteria |
| :--- | :--- | :--- | :--- |
| Implement Tauri FS local write pipe | Shlok | Friday EOD | Tested with 1,000 automated write cycles |
| Verify A4 print margin styling | UI Eng | Monday 12:00 | Zero text cutoff on standard physical printer |`
  },
  {
    id: 'stoic-journal',
    name: 'Stoic Daily Reflection',
    category: 'Reflection',
    tagline: 'Marcus Aurelius Meditations format: control, obstacle, amor fati',
    description: 'Dichotomy of control, turning obstacles into fuel, evening postmortem of virtue and focus.',
    iconName: 'Compass',
    promptInstructions: `Structure the raw personal journal or brain dump into a Marcus Aurelius style Stoic Reflection.
Output format:
# Stoic Reflection: {Date}

> *"The impediment to action advances action. What stands in the way becomes the way."* — Marcus Aurelius

### 1. Dichotomy of Control
- **Within My Power**: {Effort, focus, patience, integrity}
- **Outside My Power**: {Others' reactions, delays, market turbulence}

### 2. The Obstacle Inversion (Amor Fati)
- **The Friction Encountered**: {What was frustrating today?}
- **The Inversion**: {How does this exact challenge train my character, patience, or skill?}

### 3. Evening Postmortem
- ⚖️ *Where was I disciplined?*: {Specific win}
- ⚠️ *Where did I leak energy or seek cheap dopamine?*: {Unfiltered self-truth}
- 🎯 *One Non-Negotiable Tomorrow*: {Single most critical leverage point}`,
    sampleInput: `Had a frustrating day with build errors. Windows rust compilation gave weird errors. Felt like wasting time. But I learned how Tauri 2.0 changed plugin configuration. Need to be more patient and read compiler errors carefully instead of getting annoyed. Tomorrow I will finish the template engine.`,
    skeletonMarkdown: `# Stoic Reflection: The Discipline of Deep Debugging

> *"The impediment to action advances action. What stands in the way becomes the way."* — Marcus Aurelius

### 1. Dichotomy of Control
- **Within My Power**: Methodical error reading, disciplined toolchain diagnosis, emotional stillness.
- **Outside My Power**: Upstream framework changes, compiler quirks, past hours spent.

### 2. The Obstacle Inversion (Amor Fati)
- **The Friction Encountered**: Breaking changes in Tauri v2 build pipeline.
- **The Inversion**: This friction forced a complete mastery of the underlying IPC architecture, ensuring our codebase is permanently robust.

### 3. Evening Postmortem
- ⚖️ *Where was I disciplined?*: Refused to quit or hack together a brittle workaround; studied the exact root cause.
- ⚠️ *Where did I leak energy?*: Initial frustration before stepping back to first principles.
- 🎯 *One Non-Negotiable Tomorrow*: Complete the 10-template engine and verified export suite.`
  },
  {
    id: 'book-podcast-digest',
    name: 'Book & Podcast Digest',
    category: 'Learning',
    tagline: 'Extract signal from 300 pages into 3 load-bearing insights',
    description: 'Strips filler stories and anecdotes down to core load-bearing mental models, memorable verbatim quotes, and behavioral changes.',
    iconName: 'BookOpen',
    promptInstructions: `Distill the notes on a book, podcast, or lecture into a high-density Digest.
Output format:
# Digest: {Title}
*Author / Creator*: {Name} | *Medium*: {Book / Podcast / Paper}

### The Core Thesis
{One clear paragraph describing the central argument of the work.}

### 3 Load-Bearing Insights
1. **{Insight 1}**: {Deep explanation}
2. **{Insight 2}**: {Deep explanation}
3. **{Insight 3}**: {Deep explanation}

### Memorable Quotes & Provocations
> "{Quote 1}"
> "{Quote 2}"

### Personal Behavioral Shift
- **Before this**: {Old assumption}
- **From today forward**: {New non-negotiable behavior}`,
    sampleInput: `Notes on 'Working in Public' by Nadia Eghbal. Open source has changed. It's not cathedral and bazaar anymore with equal contributors. Now it's creators and huge audiences. Maintainers are burned out by passive users demanding free support like an influencer managing comments. Need new funding and community models.`,
    skeletonMarkdown: `# Digest: Working in Public: The Making and Maintenance of Open Source
*Author / Creator*: Nadia Eghbal | *Medium*: Book

### The Core Thesis
Modern open-source development has shifted from collaborative collective peer production ("The Bazaar") to a creator-audience dynamic ("The Stadium"). Maintainers are essentially solo digital artisans servicing massive, non-contributing consumer bases.

### 3 Load-Bearing Insights
1. **The Attention Trap**: Open code means zero distribution friction, which creates catastrophic inbound demand for maintainer attention while contribution rates remain flat.
2. **Federations vs Stadiums**: Successful software projects now resemble platforms with a charismatic core curator rather than decentralized committees.
3. **Intrinsic Stewardship**: Long-term software quality is preserved by small, passionate custodians, not by crowdsourcing features.

### Memorable Quotes & Provocations
> "Open source was never designed to handle millions of people showing up to watch and ask questions without helping."`
  },
  {
    id: 'sop-checklist',
    name: 'Precision SOP Checklist',
    category: 'Execution',
    tagline: 'Fail-safe flight checklist for repeatable execution',
    description: 'Gawande-style checklist: Prerequisites, Non-negotiable sequence, Verification criteria, and Abort conditions.',
    iconName: 'CheckSquare',
    promptInstructions: `Convert the messy process instructions into a flight-grade Standard Operating Procedure (SOP).
Output format:
# SOP: {Standard Operating Procedure Name}

**Objective**: {Clear outcome definition}
**Target Frequency**: {Daily / Per Release / Incident}

### 0. Mandatory Prerequisites
- [ ] {Required access, tool, or environment flag}
- [ ] {Pre-flight backup verification}

### 1. Sequential Execution Protocol
1. **{Phase 1: Step Name}**
   - Action: \`{command or direct action}\`
   - *Verification*: {Expected output / state change}
2. **{Phase 2: Step Name}**
   - Action: \`{command or direct action}\`
   - *Verification*: {Expected output / state change}

### 2. Abort & Rollback Criteria
> **Immediate Abort Condition**: {If X happens, immediately halt and execute rollback protocol: Y.}`,
    sampleInput: `How to deploy Nomess desktop release. First make sure version bumped in package.json and tauri.conf.json. Run npm run build to verify typescript passes. Then run npm run tauri build. Check that the .exe or .msi is generated in target/release/bundle. Test installing it on a clean machine. Tag git commit with version.`,
    skeletonMarkdown: `# SOP: Production Desktop Release & Validation

**Objective**: Produce, verify, and package an immutable native installer release.
**Target Frequency**: Per Production Version Tag

### 0. Mandatory Prerequisites
- [ ] Working directory is completely clean (\`git status\` reports no unstaged changes).
- [ ] Version number synchronized across \`package.json\`, \`src-tauri/Cargo.toml\`, and \`tauri.conf.json\`.

### 1. Sequential Execution Protocol
1. **Lint & Type Invariant Verification**
   - Action: \`npm run build\`
   - *Verification*: Zero TypeScript errors, zero warnings.
2. **Native Rust Compilation**
   - Action: \`npx tauri build\`
   - *Verification*: Binary generated cleanly under \`src-tauri/target/release/bundle/\`.
3. **Clean-Box Smoke Verification**
   - Action: Launch executable on clean Windows environment without Node installed.
   - *Verification*: Application window opens in < 300ms, Dieter Rams canvas renders.

### 2. Abort & Rollback Criteria
> **Immediate Abort Condition**: If cold-start startup exceeds 600ms or binary size exceeds 25MB, cancel release immediately.`
  },
  {
    id: 'founder-pitch',
    name: 'Founder Pitch Memo',
    category: 'Strategy',
    tagline: 'The unfair secret, burning problem, and market thesis',
    description: 'Peter Thiel & Steve Jobs inspired product thesis: The Secret Insight, The Status Quo Pain, Product Architecture, and Compounding Flywheel.',
    iconName: 'Sparkles',
    promptInstructions: `Distill the raw product brainstorm into an irresistible Founder Pitch Memo.
Output format:
# Venture Memo: {Product / Feature Name}

> **The One-Sentence Secret:** {What important truth do very few people agree with you on?}

### 1. The Burning Problem (Status Quo Breakdown)
{Explain why existing tools are noisy, ugly, bloated, or failing the user.}

### 2. The Unfair Architectural Advantage
- **Zero Distraction**: {Why our aesthetic choices unlock cognitive flow}
- **First-Principles Speed**: {Why our native engineering outperforms incumbents}
- **Data Sovereignty**: {Why local-first ownership wins long-term trust}

### 3. The Compounding Flywheel
\`\`\`
Messy Notes Ingest -> Beautiful Second Brain -> Cognitive Clarity -> Daily Reliance -> Vault Compounding
\`\`\`

### 4. Milestones
- [ ] **Alpha**: {Initial validation criteria}
- [ ] **Beta**: {Expansion and power user feedback}`,
    sampleInput: `Pitch for Nomess. Everyone has messy notes in Apple notes or notebooks or voice memos. They never look at them again because they are ugly and unstructured. Notion is too slow and heavy, Obsidian is too nerdy with too many plugins. Nomess takes your messy scribbles or photos of pages and instantly turns them into gorgeous, printable, second brain knowledge notes. It works offline, no bloated web servers.`,
    skeletonMarkdown: `# Venture Memo: Nomess — The Thought-to-Artifact Engine

> **The One-Sentence Secret:** People do not stop reviewing their notes because they lack discipline; they stop because disorganized, ugly digital text repulses the human brain.

### 1. The Burning Problem (Status Quo Breakdown)
The world is drowning in fragmented capture tools (Apple Notes, voice memos, photo rolls of whiteboards, margins of books). 95% of captured thoughts die in digital graveyards because turning chaos into structure requires painful manual reformatting. Notion is a bloated project manager; Obsidian is an engineer's graph puzzle.

### 2. The Unfair Architectural Advantage
- **Instant Aesthetic Elevation**: One click turns raw, scrawled human input into Dieter Rams archival paper sheets.
- **Native Dignity**: Engineered in Tauri v2 + Rust—launches instantly, operates offline, zero localhost servers.
- **True Physicality**: Print-first architecture means notes can be bound into physical notebooks or archived into Google Drive.

### 3. The Compounding Flywheel
\`\`\`
Messy Scrawls / Scans -> Instant AI Second-Brain Elevation -> Tactile Print & Vault Retention -> Higher Trust -> Daily Cognitive Operating System
\`\`\``
  }
];
