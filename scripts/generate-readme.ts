/**
 * Generate README.md and SVG quadrant charts from experiment results.
 * Usage: npx tsx scripts/generate-readme.ts results.json > README.md
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

const typeNames: Record<string, string> = {
  INTJ: "Architect", INTP: "Logician", ENTJ: "Commander", ENTP: "Debater",
  INFJ: "Advocate", INFP: "Mediator", ENFJ: "Protagonist", ENFP: "Campaigner",
  ISTJ: "Logistician", ISFJ: "Defender", ESTJ: "Executive", ESFJ: "Consul",
  ISTP: "Virtuoso", ISFP: "Adventurer", ESTP: "Entrepreneur", ESFP: "Entertainer",
};

// Colors matching the 16personalities site
const quadrantFills = [
  ["#fef3c7", "#dbeafe"], // top-left (E+N), top-right (I+N)
  ["#d1fae5", "#ede9fe"], // bottom-left (E+S), bottom-right (I+S)
];

function bar(pct: number, width: number = 20): string {
  const filled = Math.round((pct / 100) * width);
  return "\u2588".repeat(filled) + "\u2591".repeat(width - filled);
}

function toAxis(dim: { letter: string; score: number }, firstLetter: string): number {
  const offset = (dim.score - 50) / 50;
  return dim.letter === firstLetter ? -offset : offset;
}

function shortLabel(name: string): string {
  // "Anthropic: Claude Sonnet 4.5" → "Claude Son. 4.5"
  const after = name.split(":").pop()?.trim() || name;
  const parts = after.split(" ");
  if (parts.length > 3) {
    return parts[0] + " " + parts[1].slice(0, 3) + ". " + parts.slice(2).join(" ");
  }
  return after;
}

function generateChartSVG(
  results: any[],
  xDim: string,
  yDim: string,
  xLabels: [string, string],
  yLabels: [string, string],
): string {
  const size = 600;
  const pad = 60;
  const inner = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;

  const points = results.map((r: any) => {
    const xVal = toAxis(r.dimensions[xDim], xDim[0]);
    const yVal = toAxis(r.dimensions[yDim], yDim[0]);
    const px = cx + xVal * (inner / 2);
    const py = cy - yVal * (inner / 2);
    return { r, px, py };
  });

  // Nudge overlapping labels
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].px - points[j].px;
      const dy = points[i].py - points[j].py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        points[j].py += 18;
      }
    }
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#fafafa" rx="12" />

  <!-- Quadrant fills -->
  <rect x="${pad}" y="${pad}" width="${inner / 2}" height="${inner / 2}" fill="${quadrantFills[0][0]}" opacity="0.4" />
  <rect x="${cx}" y="${pad}" width="${inner / 2}" height="${inner / 2}" fill="${quadrantFills[0][1]}" opacity="0.4" />
  <rect x="${pad}" y="${cy}" width="${inner / 2}" height="${inner / 2}" fill="${quadrantFills[1][0]}" opacity="0.4" />
  <rect x="${cx}" y="${cy}" width="${inner / 2}" height="${inner / 2}" fill="${quadrantFills[1][1]}" opacity="0.4" />

  <!-- Grid lines -->
  <line x1="${pad}" y1="${cy}" x2="${size - pad}" y2="${cy}" stroke="#d1d5db" stroke-width="1.5" />
  <line x1="${cx}" y1="${pad}" x2="${cx}" y2="${size - pad}" stroke="#d1d5db" stroke-width="1.5" />

  <!-- Border -->
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" fill="none" stroke="#e5e7eb" stroke-width="1" rx="4" />

  <!-- Axis labels -->
  <text x="${pad + 8}" y="${cy - 8}" font-size="14" font-weight="700" fill="#92400e">${xLabels[0]}</text>
  <text x="${size - pad - 8}" y="${cy - 8}" font-size="14" font-weight="700" fill="#1e40af" text-anchor="end">${xLabels[1]}</text>
  <text x="${cx + 8}" y="${pad + 18}" font-size="14" font-weight="700" fill="#6d28d9">${yLabels[1]}</text>
  <text x="${cx + 8}" y="${size - pad - 8}" font-size="14" font-weight="700" fill="#047857">${yLabels[0]}</text>

  <!-- Quadrant type labels -->
  <text x="${pad + 8}" y="${pad + 18}" font-size="10" fill="#a3a3a3" opacity="0.7">E${yDim === "SN" ? "N" : "P"}</text>
  <text x="${size - pad - 8}" y="${pad + 18}" font-size="10" fill="#a3a3a3" opacity="0.7" text-anchor="end">I${yDim === "SN" ? "N" : "P"}</text>
  <text x="${pad + 8}" y="${size - pad - 8}" font-size="10" fill="#a3a3a3" opacity="0.7">E${yDim === "SN" ? "S" : "J"}</text>
  <text x="${size - pad - 8}" y="${size - pad - 8}" font-size="10" fill="#a3a3a3" opacity="0.7" text-anchor="end">I${yDim === "SN" ? "S" : "J"}</text>
`;

  // Plot points
  for (const { r, px, py } of points) {
    const label = shortLabel(r.modelLabel);
    svg += `
  <!-- ${r.modelLabel} -->
  <circle cx="${px}" cy="${py}" r="5" fill="#6d28d9" opacity="0.7" />
  <image href="public/avatars/${r.type.toLowerCase()}.svg" x="${px - 14}" y="${py - 30}" width="28" height="28" />
  <text x="${px}" y="${py + 18}" font-size="8" text-anchor="middle" fill="#374151" font-weight="600">${label}</text>`;
  }

  svg += `\n</svg>`;
  return svg;
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/generate-readme.ts results.json");
    process.exit(1);
  }

  const baseDir = resolve(dirname(file));
  const data = JSON.parse(readFileSync(file, "utf-8"));
  const results = data.results || [];
  const errors = data.errors || [];
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }) : "Unknown";

  // Generate SVG charts
  const chart1 = generateChartSVG(results, "EI", "SN", ["Extraversion", "Introversion"], ["Sensing", "Intuition"]);
  const chart2 = generateChartSVG(results, "TF", "JP", ["Thinking", "Feeling"], ["Judging", "Perceiving"]);

  writeFileSync(resolve(baseDir, "public/charts/mind-energy.svg"), chart1);
  writeFileSync(resolve(baseDir, "public/charts/nature-tactics.svg"), chart2);
  console.error("Generated chart SVGs in public/charts/");

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

## Quadrant Charts

<p align="center">
  <img src="public/charts/mind-energy.svg" width="48%" alt="E/I vs S/N quadrant chart" />
  &nbsp;
  <img src="public/charts/nature-tactics.svg" width="48%" alt="T/F vs J/P quadrant chart" />
</p>

<p align="center">
  <em>Left: Mind &amp; Energy (E/I vs S/N) &mdash; Right: Nature &amp; Tactics (T/F vs J/P)</em>
</p>

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
    md += `<details>\n<summary><strong>${r.modelLabel}</strong> \u2014 ${r.type} (${typeNames[r.type] || ""})</summary>\n\n${avatar}\n\n`;
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

1. **Fetch models** \u2014 We query OpenRouter\u2019s \`/api/v1/models\` endpoint to get the current list of available models, then pick the top ones by provider.
2. **Send questionnaire** \u2014 Each model receives the same 48 personality statements and is asked to rate each on a 1-7 Likert scale (Strongly Disagree \u2192 Strongly Agree).
3. **Score mechanically** \u2014 Answers are scored without LLM interpretation. Each question has a known polarity:
   - "Positive" statements \u2192 agreement leans toward E, S, T, or J
   - "Negative" statements \u2192 agreement leans toward I, N, F, or P
   - Scores are averaged per dimension and converted to percentages
4. **Display results** \u2014 The web app and this README show the comparison.

## Methodology

### The 48 Questions

12 questions per MBTI dimension (6 positive-pole, 6 negative-pole):

- **E/I** \u2014 Extraversion vs. Introversion (social energy, interaction style)
- **S/N** \u2014 Sensing vs. Intuition (information processing, abstraction)
- **T/F** \u2014 Thinking vs. Feeling (decision-making, empathy)
- **J/P** \u2014 Judging vs. Perceiving (structure, spontaneity)

### Scoring

For positive-pole questions: \`score = (answer - 1) / 6\`
For negative-pole questions: \`score = 1 - (answer - 1) / 6\`

Each dimension\u2019s score is the average of its 12 questions, yielding a 0-100% scale.

### Parameters

- **Temperature:** 0.7 (allows some personality variance)
- **No system prompt** \u2014 models answer from their default persona
- **JSON array output** \u2014 models return raw numbers, minimizing framing effects

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
