# 🛠️ Creating Custom Second-Brain Templates

Nomess allows you to engineer custom cognitive templates tailored to your unique thinking and working workflows.

---

## 📐 Template Architecture Contract

Every template in Nomess satisfies the `NoteTemplate` TypeScript interface defined in [`src/types/note.ts`](file:///F:/APPS/Nomess/src/types/note.ts):

```typescript
export interface NoteTemplate {
  id: TemplateId;
  name: string;
  category: 'Thinking' | 'Learning' | 'Execution' | 'Strategy' | 'Reflection';
  tagline: string;
  description: string;
  iconName: string;
  promptInstructions: string;
  sampleInput: string;
  skeletonMarkdown: string;
}
```

---

## 🧪 Code Snippet: Adding a Custom Template

To add a new template, simply append it to `SECOND_BRAIN_TEMPLATES` in [`src/data/templates.ts`](file:///F:/APPS/Nomess/src/data/templates.ts):

```typescript
{
  id: 'inversion-problem-solver',
  name: 'Munger Inversion Solver',
  category: 'Thinking',
  tagline: 'Invert, always invert: identify failure modes to guarantee success',
  description: 'Charlie Munger mental model: systematically identifies how a project or goal can fail, so you can build airtight defenses against each failure mode.',
  iconName: 'ShieldAlert',
  promptInstructions: `Transform the messy problem or project notes into a Charlie Munger Inversion Analysis.
Output format:
# Inversion Analysis: {Goal or Objective}

> *"All I want to know is where I am going to die, so I'll never go there."* — Charlie Munger

### 1. The Desired Outcome
{One sentence defining what success looks like.}

### 2. The Catastrophic Failure Modes (How to Guarantee Failure)
1. **{Failure Vector 1}**: {How someone could completely ruin this project}
2. **{Failure Vector 2}**: {Subtle trap or cognitive bias that leads to disaster}
3. **{Failure Vector 3}**: {Operational negligence or unexamined assumption}

### 3. Defensive Invariant Rules (What to Strictly Avoid)
- 🚫 **Rule 1**: {Concrete constraint to eliminate Failure Vector 1}
- 🚫 **Rule 2**: {Concrete constraint to eliminate Failure Vector 2}

### 4. Immediate Proactive Defense Checklist
- [ ] {Immediate action to derisk the top failure mode}`,
  sampleInput: `We are launching a new consumer software product. We want it to be successful. We want lots of active users. Worried about people churning, slow performance, buggy onboarding, bad marketing.`,
  skeletonMarkdown: `# Inversion Analysis: Consumer Product Launch

> *"All I want to know is where I am going to die, so I'll never go there."* — Charlie Munger

### 1. The Desired Outcome
Achieve high day-30 retention with sustained word-of-mouth referral loops.

### 2. The Catastrophic Failure Modes (How to Guarantee Failure)
1. **Friction-Ridden Cold Start**: Requiring 5 configuration steps before the user experiences the core "aha!" moment.
2. **Sluggish Runtime Latency**: Application taking >2 seconds to launch or stuttering during typing.
3. **Feature Creep Bloat**: Adding 20 mediocre secondary features instead of perfecting the primary flow.

### 3. Defensive Invariant Rules (What to Strictly Avoid)
- 🚫 **Rule 1**: Under no circumstances should startup time exceed 500ms.
- 🚫 **Rule 2**: The user must reach synthesized output within 3 clicks of first opening the app.`
}
```

---

## 💡 Token-Frugal Prompt Engineering Tips
1. **Strict JSON Schemas**: Nomess instructs Gemini Flash to return strict JSON (`{ title, markdown, tags }`). This eliminates conversational pleasantries ("Sure, here is your note!") and saves 40–60 tokens per invocation.
2. **Deterministic Heuristics**: Leave timestamps, author tags, word counts, and metadata formatting to local code—never ask an LLM to generate things your CPU can compute for free in 0.01ms!
