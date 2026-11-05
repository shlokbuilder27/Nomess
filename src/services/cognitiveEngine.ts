import type { NoteTemplate } from '../types/note';
import type { AIResponse } from './aiService';

interface ParsedSentence {
  text: string;
  isQuestion: boolean;
  isAction: boolean;
  hasCausality: boolean;
  hasDefinition: boolean;
  hasNegativeSentiment: boolean;
  keywords: string[];
}

export class CognitiveEngine {
  /**
   * Pure Algorithmic Cognitive Synthesizer
   * Transforms raw chaotic text into 10 Second-Brain templates with 0ms latency,
   * zero tokens spent, and zero API keys needed.
   */
  static synthesize(rawInput: string, template: NoteTemplate): AIResponse {
    const cleanInput = rawInput.trim();
    if (!cleanInput) {
      return {
        title: `Untitled ${template.name}`,
        markdown: template.skeletonMarkdown,
        tags: [template.category.toLowerCase()],
        tokensUsed: 0,
        providerUsed: 'Pure Engineering Engine (Zero-API)'
      };
    }

    const sentences = this.tokenizeSentences(cleanInput);
    const parsed = sentences.map(s => this.analyzeSentence(s));
    const title = this.extractTitle(cleanInput, parsed);
    const tags = this.extractTags(cleanInput, template);

    let structuredMarkdown = '';

    switch (template.id) {
      case 'cornell-study':
        structuredMarkdown = this.synthesizeCornell(title, parsed, cleanInput);
        break;
      case 'feynman-technique':
        structuredMarkdown = this.synthesizeFeynman(title, parsed, cleanInput);
        break;
      case 'executive-memo':
        structuredMarkdown = this.synthesizeExecutiveMemo(title, parsed, cleanInput);
        break;
      case 'zettelkasten':
        structuredMarkdown = this.synthesizeZettelkasten(title, parsed, cleanInput);
        break;
      case 'architecture-spec':
        structuredMarkdown = this.synthesizeArchitectureSpec(title, parsed, cleanInput);
        break;
      case 'meeting-decisional':
        structuredMarkdown = this.synthesizeMeetingDecisional(title, parsed, cleanInput);
        break;
      case 'stoic-journal':
        structuredMarkdown = this.synthesizeStoicJournal(title, parsed, cleanInput);
        break;
      case 'book-podcast-digest':
        structuredMarkdown = this.synthesizeBookDigest(title, parsed, cleanInput);
        break;
      case 'sop-checklist':
        structuredMarkdown = this.synthesizeSOP(title, parsed, cleanInput);
        break;
      case 'founder-pitch':
        structuredMarkdown = this.synthesizeFounderPitch(title, parsed, cleanInput);
        break;
      default:
        structuredMarkdown = this.synthesizeDefault(title, parsed, cleanInput);
        break;
    }

    return {
      title,
      markdown: structuredMarkdown,
      tags,
      tokensUsed: 0,
      providerUsed: 'Pure Engineering Engine (Zero-API)'
    };
  }

  // --- Specialized Template Generators ---

  private static synthesizeCornell(title: string, sentences: ParsedSentence[], raw: string): string {
    const cues: string[] = [];
    const notes: string[] = [];

    sentences.forEach((s) => {
      if (s.isQuestion) {
        cues.push(`- **Recall**: ${s.text}`);
      } else if (s.hasCausality) {
        const parts = s.text.split(/because|due to|in order to|so that|leads to/i);
        if (parts.length > 1) {
          cues.push(`- **Why / Mechanism**: What causes ${parts[0].trim().toLowerCase()}?`);
          notes.push(`- **Causal Law**: ${s.text}`);
        } else {
          notes.push(`- **Core Mechanism**: ${s.text}`);
        }
      } else if (s.hasDefinition) {
        cues.push(`- **Definition**: What is ${s.keywords[0] || 'the core concept'}?`);
        notes.push(`- **Invariant**: ${s.text}`);
      } else {
        notes.push(`- **Key Observation**: ${s.text}`);
      }
    });

    if (cues.length === 0) {
      cues.push(`- **Core Thesis**: What is the irreducible takeaway of ${title}?`);
      cues.push(`- **Boundary**: What are the non-negotiable constraints?`);
    }

    const summary = sentences[0]?.text || raw.slice(0, 140);

    return `# ${title}

> **Core Subject & Scope:** ${summary}

### Cues & Key Questions (Recall Prompts)
${cues.slice(0, 4).join('\n')}

### Synthesized Notes & Core Concepts
${notes.slice(0, 6).join('\n')}

### Actionable Summary (The Synthesis Anchor)
> **First-Principles Synthesis:** ${this.generateSummarySentence(sentences)}`;
  }

  private static synthesizeFeynman(title: string, sentences: ParsedSentence[], raw: string): string {
    const keyTerms = this.extractKeywords(raw, 4);
    const coreRule = sentences.find(s => s.hasDefinition || s.hasCausality)?.text || sentences[0]?.text || raw.slice(0, 100);

    return `# ${title}

> **The 30-Second Child Analogy (ELI5):** Imagine ${keyTerms[0] || 'this system'} is like a playground where every child must follow a single physical rule: ${coreRule.toLowerCase().replace(/\.$/, '')}. If anyone breaks it, the game resets instantly.

### First-Principles Breakdown
1. **The Invariant Law**: ${coreRule}
2. **How It Operates**:
${sentences.slice(1, 4).map((s, i) => `   - *Step ${i + 1}*: ${s.text}`).join('\n') || '   - *Core Mechanism*: Input flows deterministically through state transitions.'}
3. **The Common Misconception**: Most people confuse the external manifestation with the internal mechanism. The truth is grounded in conservation of resources.

### Identified Knowledge Gaps & Questions
- [ ] How does ${keyTerms[1] || 'the secondary component'} behave under extreme boundary conditions?
- [ ] What is the exact mathematical trade-off between speed and correctness here?

### First-Principles Derivation
\`\`\`
[Input Stimulus] ---> [Invariant Filter (${keyTerms[0] || 'Core'})] ---> [Predictable Output]
\`\`\``;
  }

  private static synthesizeExecutiveMemo(title: string, sentences: ParsedSentence[], raw: string): string {
    const actionItems = sentences.filter(s => s.isAction || /need to|must|should|will/i.test(s.text));
    const problem = sentences.find(s => s.hasNegativeSentiment)?.text || sentences[0]?.text || 'Current architecture faces cognitive and operational friction.';

    return `# Decision Memo: ${title}

| Metric / Dimension | Detail |
| :--- | :--- |
| **Owner / Lead** | Core Engineering |
| **Decision Type** | Type 1 (Irreversible Architectural Commitment) |
| **Urgency** | Immediate Execution |

### 1. Strategic Context & Problem Statement
${problem} If we defer this decision, technical debt will compound quadratically.

### 2. Evaluated Options & Trade-Offs
- **Option A: The Status Quo**
  - *Upside*: Zero immediate migration effort.
  - *Downside / Cost*: Compounding maintenance friction and architectural decay.
- **Option B: First-Principles Rebuild**
  - *Upside*: Pure speed, zero unnecessary dependencies, 100% data sovereignty.
  - *Downside / Cost*: Requires focused upfront engineering discipline.

### 3. The Recommended Decision & Rationale
> **Decision**: Execute Option B immediately.
> **First-Principles Reason**: Simplicity is the ultimate sophistication. By removing third-party fragility, we control our own destiny.

### 4. Immediate Commitments & Next Milestones
| Task Description | Status | Verification Criteria |
| :--- | :--- | :--- |
${(actionItems.length > 0 ? actionItems : sentences.slice(0, 3)).map(s => `| ${s.text.replace(/\|/g, '')} | Pending | Verified in production |`).join('\n')}`;
  }

  private static synthesizeZettelkasten(title: string, sentences: ParsedSentence[], raw: string): string {
    const uid = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
    const thesis = sentences[0]?.text || raw.slice(0, 100);
    const tags = this.extractKeywords(raw, 3).map(k => `#${k.toLowerCase()}`).join(' ');

    return `# [[${title}]]

**UID**: \`${uid}\` | **Tags**: ${tags}

### The Core Thesis
> ${thesis}

### Elaboration & Mechanism
${sentences.slice(1, 4).map(s => s.text).join(' ') || raw}

### Interconnected Nodes
- ⬆️ **Upward Context**: [[First-Principles Epistemology]]
- ↔️ **Parallel Tension**: [[The Fallacy of Premature Complexity]]
- ⬇️ **Downward Manifestation**: [[Applied Systems Engineering]]

### Spark / Source Attribution
*Capture Context*: Extracted from spontaneous cognitive dump.`;
  }

  private static synthesizeArchitectureSpec(title: string, sentences: ParsedSentence[], raw: string): string {
    return `# Technical Spec: ${title}

### 1. Invariants & Budget Constraints
- **Latency Budget**: Sub-16ms UI frame render; Sub-1ms heuristic execution.
- **Memory Footprint**: < 30MB resident RAM footprint.
- **Storage Contract**: Pure UTF-8 Plaintext Markdown on disk with YAML frontmatter.

### 2. Component Topology
\`\`\`
[Messy Ingest] ---> [Syntactic Lexer] ---> [Markdown Sheet] ---> [Disk Vault]
\`\`\`

### 3. Core System Logic
${sentences.map(s => `- **${s.keywords[0] || 'Invariant'}**: ${s.text}`).join('\n')}

### 4. Failure Modes & Degradation Matrix
| Failure Event | Fallback Strategy | Data Loss |
| :--- | :--- | :--- |
| Network Unavailable | Fallback to Pure-Engineering AST Engine | 0% |
| API Rate Limit Exceeded | Instant offline synthesis | 0% |`;
  }

  private static synthesizeMeetingDecisional(title: string, sentences: ParsedSentence[], raw: string): string {
    return `# Meeting Brief: ${title}

**Timestamp**: ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

### Key Agreements & Conclusions
${sentences.slice(0, 3).map((s, i) => `${i + 1}. **${s.keywords[0] || 'Agreement'}**: ${s.text}`).join('\n')}

### Action Items & Ownership
| Task Description | Priority | Target Status |
| :--- | :--- | :--- |
${sentences.slice(3, 7).map(s => `| ${s.text.replace(/\|/g, '')} | High | Non-Negotiable |`).join('\n') || '| Review synthesized architecture | High | Complete |'}`;
  }

  private static synthesizeStoicJournal(title: string, sentences: ParsedSentence[], raw: string): string {
    const frictions = sentences.filter(s => s.hasNegativeSentiment);
    const positiveActions = sentences.filter(s => !s.hasNegativeSentiment);

    return `# Stoic Reflection: ${title}

> *"The impediment to action advances action. What stands in the way becomes the way."* — Marcus Aurelius

### 1. Dichotomy of Control
- **Within My Power**: Focus, methodical effort, stillness, how I respond to friction.
- **Outside My Power**: ${frictions[0]?.text || 'External platform boundaries and unexpected friction.'}

### 2. The Obstacle Inversion (Amor Fati)
- **The Friction**: ${frictions.map(f => f.text).join(' ') || 'Encountering unexpected friction during deep work.'}
- **The Inversion**: This friction reveals where our system was brittle. By confronting it directly, we strengthen our engineering foundation.

### 3. Evening Postmortem
- ⚖️ *Discipline*: Maintained commitment to first principles without taking cognitive shortcuts.
- 🎯 *One Non-Negotiable Tomorrow*: Execute the primary objective with zero hesitation.`;
  }

  private static synthesizeBookDigest(title: string, sentences: ParsedSentence[], raw: string): string {
    return `# Digest: ${title}
*Medium*: Synthesis Artifact

### The Core Thesis
${sentences[0]?.text || raw.slice(0, 120)}

### 3 Load-Bearing Insights
${sentences.slice(1, 4).map((s, i) => `${i + 1}. **Insight ${i + 1}**: ${s.text}`).join('\n\n')}

### Behavioral Shift
- **Before this**: Relying on passive intuition.
- **From today forward**: Grounding decisions in clear first-principles frameworks.`;
  }

  private static synthesizeSOP(title: string, sentences: ParsedSentence[], raw: string): string {
    return `# SOP: ${title}

**Objective**: Guaranteed deterministic execution without operational error.

### 0. Mandatory Prerequisites
- [ ] Working environment clean and verified.
- [ ] Target parameters confirmed.

### 1. Sequential Execution Protocol
${sentences.map((s, i) => `${i + 1}. **Step ${i + 1}**\n   - Action: ${s.text}\n   - *Verification*: Target state verified.`).join('\n')}

### 2. Abort Criteria
> **Immediate Abort Condition**: If unexpected state deviation occurs, halt execution immediately and review invariants.`;
  }

  private static synthesizeFounderPitch(title: string, sentences: ParsedSentence[], raw: string): string {
    return `# Venture Memo: ${title}

> **The One-Sentence Secret:** Most products fail not from lack of features, but because ugly, cluttered tools create cognitive friction that repels human attention.

### 1. The Burning Problem
${sentences[0]?.text || raw.slice(0, 100)}

### 2. The Unfair Advantage
- **Zero API Lock-In**: Operates 100% offline with zero external server dependencies.
- **Dieter Rams Dignity**: Pristine typography that treats human thinking with respect.
- **Local-First Sovereignty**: 100% human-readable Markdown stored directly on user devices.

### 3. The Compounding Flywheel
\`\`\`
Mental Chaos -> Instant Pure-Engineering Elevation -> Cognitive Clarity -> Daily Relied Habit
\`\`\``;
  }

  private static synthesizeDefault(title: string, sentences: ParsedSentence[], raw: string): string {
    return `# ${title}

> **Synthesized Knowledge Artifact**

${sentences.map(s => `- ${s.text}`).join('\n')}`;
  }

  // --- NLP & Syntactic Helpers ---

  private static tokenizeSentences(text: string): string[] {
    return text
      .split(/(?<=[.?!])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 5);
  }

  private static analyzeSentence(sentence: string): ParsedSentence {
    const lower = sentence.toLowerCase();
    const isQuestion = sentence.endsWith('?') || /^(why|how|what|when|where|who|is it|can we)/i.test(lower);
    const isAction = /^(todo|need to|must|should|will|implement|build|fix|deploy|verify|call|write)/i.test(lower) || /by (monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow)/i.test(lower);
    const hasCausality = /because|due to|in order to|so that|leads to|causes|therefore/i.test(lower);
    const hasDefinition = /\b(is|means|defined as|refers to|stands for)\b/i.test(lower);
    const hasNegativeSentiment = /bug|error|fail|frustrated|slow|hard|difficult|stuck|problem|friction|issue/i.test(lower);

    const words = sentence.match(/\b[A-Za-z]{4,}\b/g) || [];
    const keywords = words.filter(w => !/^(this|that|with|from|have|were|they|their|what|when|your|then|than|some|more|about|into)$/i.test(w));

    return {
      text: sentence,
      isQuestion,
      isAction,
      hasCausality,
      hasDefinition,
      hasNegativeSentiment,
      keywords: keywords.slice(0, 3)
    };
  }

  private static extractTitle(raw: string, sentences: ParsedSentence[]): string {
    const firstLine = raw.split('\n')[0]?.replace(/^[#\-* ]+/, '').trim();
    if (firstLine && firstLine.length < 60) {
      return firstLine.replace(/[.?!]$/, '');
    }

    const firstSentence = sentences[0]?.text;
    if (firstSentence) {
      const words = firstSentence.split(' ').slice(0, 7).join(' ');
      return words.replace(/[.?!]$/, '');
    }

    return 'Synthesized Thought Artifact';
  }

  private static extractTags(raw: string, template: NoteTemplate): string[] {
    const tags = new Set<string>();
    tags.add(template.category.toLowerCase());
    tags.add(template.id);

    // Extract hashtags if present in input
    const hashtagMatches = raw.match(/#([a-zA-Z0-9_-]+)/g);
    if (hashtagMatches) {
      hashtagMatches.forEach(t => tags.add(t.replace('#', '').toLowerCase()));
    }

    const keywords = this.extractKeywords(raw, 2);
    keywords.forEach(k => tags.add(k.toLowerCase()));

    return Array.from(tags).slice(0, 4);
  }

  private static extractKeywords(text: string, count: number): string[] {
    const words = text.match(/\b[A-Za-z]{5,}\b/g) || [];
    const stopWords = new Set(['about', 'their', 'which', 'there', 'would', 'could', 'should', 'these', 'first', 'system', 'other']);
    const frequency: Record<string, number> = {};

    words.forEach(w => {
      const lower = w.toLowerCase();
      if (!stopWords.has(lower)) {
        frequency[lower] = (frequency[lower] || 0) + 1;
      }
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, count);
  }

  private static generateSummarySentence(sentences: ParsedSentence[]): string {
    const keyPoints = sentences.slice(0, 2).map(s => s.text.replace(/\.$/, '')).join('; furthermore, ');
    return `${keyPoints}. This establishes the foundational invariant of the system.`;
  }
}
