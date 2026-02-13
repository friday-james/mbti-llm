/**
 * Generate README.md from experiment results.
 * Usage: npx tsx scripts/generate-readme.ts results.json > README.md
 */

import { readFileSync } from "fs";

const typeNames: Record<string, string> = {
  INTJ: "Architect", INTP: "Logician", ENTJ: "Commander", ENTP: "Debater",
  INFJ: "Advocate", INFP: "Mediator", ENFJ: "Protagonist", ENFP: "Campaigner",
  ISTJ: "Logistician", ISFJ: "Defender", ESTJ: "Executive", ESFJ: "Consul",
  ISTP: "Virtuoso", ISFP: "Adventurer", ESTP: "Entrepreneur", ESFP: "Entertainer",
};

function bar(pct: number, width: number = 20): string {
  const filled = Math.round((pct / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/generate-readme.ts results.json");
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(file, "utf-8"));
  const results = data.results || [];
  const errors = data.errors || [];
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }) : "Unknown";

  // Type distribution
  const typeCounts: Record<string, string[]> = {};
  results.forEach((r: any) => {
    if (!typeCounts[r.type]) typeCounts[r.type] = [];
    typeCounts[r.type].push(r.modelLabel);
  });
  const sortedTypes = Object.entries(typeCounts).sort(
    (a, b) => (b[1] as string[]).length - (a[1] as string[]).length
  );

  let md = `# MBTI x LLM

> What personality type does each AI model have?

We send a **48-question MBTI personality questionnaire** to the most popular LLM models via [OpenRouter](https://openrouter.ai) and mechanically score their answers. Same test, different minds.

**Last run:** ${timestamp} &middot; **Models tested:** ${results.length} &middot; **Questions:** 48 (12 per dimension)

---

## Results

### Type Distribution

| Type | Name | Models | Count |
|------|------|--------|-------|
`;

  for (const [type, models] of sortedTypes) {
    const name = typeNames[type] || "";
    const avatar = `<img src="public/avatars/${type.toLowerCase()}.svg" width="24" height="24" />`;
    md += `| ${avatar} **${type}** | ${name} | ${(models as string[]).join(", ")} | ${(models as string[]).length} |\n`;
  }

  md += `\n### Model Personality Chart\n\n`;
  md += `| Model | Type | | E/I | S/N | T/F | J/P |\n`;
  md += `|-------|------|---|-----|-----|-----|-----|\n`;

  for (const r of results) {
    const ei = r.dimensions.EI;
    const sn = r.dimensions.SN;
    const tf = r.dimensions.TF;
    const jp = r.dimensions.JP;
    const avatar = `<img src="public/avatars/${r.type.toLowerCase()}.svg" width="28" height="28" />`;
    md += `| ${r.modelLabel} | **${r.type}** | ${avatar} | ${ei.letter} ${ei.score}% | ${sn.letter} ${sn.score}% | ${tf.letter} ${tf.score}% | ${jp.letter} ${jp.score}% |\n`;
  }

  md += `\n### Dimension Breakdown\n\n`;

  for (const r of results) {
    const ei = r.dimensions.EI;
    const sn = r.dimensions.SN;
    const tf = r.dimensions.TF;
    const jp = r.dimensions.JP;
    const avatar = `<img src="public/avatars/${r.type.toLowerCase()}.svg" width="48" height="48" align="right" />`;
    md += `<details>\n<summary><strong>${r.modelLabel}</strong> — ${r.type} (${typeNames[r.type] || ""})</summary>\n\n${avatar}\n\n`;
    md += `\`\`\`\n`;
    md += `E/I: ${ei.letter} ${bar(ei.score)} ${ei.score}%\n`;
    md += `S/N: ${sn.letter} ${bar(sn.score)} ${sn.score}%\n`;
    md += `T/F: ${tf.letter} ${bar(tf.score)} ${tf.score}%\n`;
    md += `J/P: ${jp.letter} ${bar(jp.score)} ${jp.score}%\n`;
    md += `\`\`\`\n\n</details>\n\n`;
  }

  if (errors.length > 0) {
    md += `### Failed Models\n\n`;
    md += `| Model | Error |\n|-------|-------|\n`;
    for (const e of errors) {
      md += `| ${e.model} | ${e.error?.slice(0, 80)} |\n`;
    }
    md += `\n`;
  }

  md += `---

## How It Works

1. **Fetch models** — We query OpenRouter's \`/api/v1/models\` endpoint to get the current list of available models, then pick the top 25 by popularity.
2. **Send questionnaire** — Each model receives the same 48 personality statements and is asked to rate each on a 1-7 Likert scale (Strongly Disagree → Strongly Agree).
3. **Score mechanically** — Answers are scored without LLM interpretation. Each question has a known polarity:
   - "Positive" statements → agreement leans toward E, S, T, or J
   - "Negative" statements → agreement leans toward I, N, F, or P
   - Scores are averaged per dimension and converted to percentages
4. **Display results** — The web app and this README show the comparison.

## Methodology

### The 48 Questions

12 questions per MBTI dimension (6 positive-pole, 6 negative-pole):

- **E/I** — Extraversion vs. Introversion (social energy, interaction style)
- **S/N** — Sensing vs. Intuition (information processing, abstraction)
- **T/F** — Thinking vs. Feeling (decision-making, empathy)
- **J/P** — Judging vs. Perceiving (structure, spontaneity)

### Scoring

For positive-pole questions: \`score = (answer - 1) / 6\`
For negative-pole questions: \`score = 1 - (answer - 1) / 6\`

Each dimension's score is the average of its 12 questions, yielding a 0-100% scale.

### Parameters

- **Temperature:** 0.7 (allows some personality variance)
- **No system prompt** — models answer from their default persona
- **JSON array output** — models return raw numbers, minimizing framing effects

## Run It Yourself

\`\`\`bash
# Clone and install
git clone https://github.com/friday-james/mbti-llm.git
cd mbti-llm
npm install

# Set your OpenRouter API key
export OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Run the web app
npm run dev

# Or run the CLI experiment directly
npx tsx scripts/run-experiment.ts > results.json
npx tsx scripts/generate-readme.ts results.json
\`\`\`

## License

MIT
`;

  console.log(md);
}

main();
