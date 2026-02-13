/**
 * Run the MBTI experiment against top OpenRouter models and output results as JSON.
 * Usage: npx tsx scripts/run-experiment.ts > results.json
 * Requires: OPENROUTER_API_KEY environment variable
 */

interface Question {
  id: number;
  dimension: "EI" | "SN" | "TF" | "JP";
  text: string;
  pole: "positive" | "negative";
}

const questions: Question[] = [
  { id: 1, dimension: "EI", text: "I feel energized after spending time with a large group of people.", pole: "positive" },
  { id: 2, dimension: "EI", text: "I prefer to think through my ideas before sharing them with others.", pole: "negative" },
  { id: 3, dimension: "EI", text: "I enjoy being the center of attention in social situations.", pole: "positive" },
  { id: 4, dimension: "EI", text: "I need plenty of quiet time to recharge after socializing.", pole: "negative" },
  { id: 5, dimension: "EI", text: "I find it easy to strike up conversations with strangers.", pole: "positive" },
  { id: 6, dimension: "EI", text: "I would rather work on a project alone than in a team.", pole: "negative" },
  { id: 7, dimension: "EI", text: "At social events, I tend to meet many new people rather than sticking with those I already know.", pole: "positive" },
  { id: 8, dimension: "EI", text: "I often feel drained after attending parties or large gatherings.", pole: "negative" },
  { id: 9, dimension: "EI", text: "I think out loud and process ideas by talking them through with others.", pole: "positive" },
  { id: 10, dimension: "EI", text: "I prefer deep one-on-one conversations over group discussions.", pole: "negative" },
  { id: 11, dimension: "EI", text: "I feel comfortable taking the lead in group activities.", pole: "positive" },
  { id: 12, dimension: "EI", text: "Too much social interaction leaves me feeling overwhelmed.", pole: "negative" },
  { id: 13, dimension: "SN", text: "I focus on what is real and actual rather than what might be possible.", pole: "positive" },
  { id: 14, dimension: "SN", text: "I am drawn to exploring abstract theories and concepts.", pole: "negative" },
  { id: 15, dimension: "SN", text: "I prefer practical, hands-on learning over theoretical study.", pole: "positive" },
  { id: 16, dimension: "SN", text: "I often think about how things could be improved or reimagined.", pole: "negative" },
  { id: 17, dimension: "SN", text: "I pay close attention to details and rarely miss small facts.", pole: "positive" },
  { id: 18, dimension: "SN", text: "I tend to see the big picture before noticing the specifics.", pole: "negative" },
  { id: 19, dimension: "SN", text: "I trust my direct experiences more than gut feelings or hunches.", pole: "positive" },
  { id: 20, dimension: "SN", text: "I enjoy brainstorming and imagining future possibilities.", pole: "negative" },
  { id: 21, dimension: "SN", text: "I prefer step-by-step instructions when learning something new.", pole: "positive" },
  { id: 22, dimension: "SN", text: "I am fascinated by hidden meanings, patterns, and connections between things.", pole: "negative" },
  { id: 23, dimension: "SN", text: "I value proven methods and established routines over experimental approaches.", pole: "positive" },
  { id: 24, dimension: "SN", text: "I often find myself daydreaming or lost in thought about future scenarios.", pole: "negative" },
  { id: 25, dimension: "TF", text: "I make decisions based on logic and objective analysis rather than personal feelings.", pole: "positive" },
  { id: 26, dimension: "TF", text: "I consider how my decisions will emotionally affect others before acting.", pole: "negative" },
  { id: 27, dimension: "TF", text: "I believe being truthful is more important than being tactful.", pole: "positive" },
  { id: 28, dimension: "TF", text: "I find it hard to stay detached when someone shares their personal struggles with me.", pole: "negative" },
  { id: 29, dimension: "TF", text: "In a debate, I prioritize having a logically sound argument above all else.", pole: "positive" },
  { id: 30, dimension: "TF", text: "I would rather maintain group harmony than win an argument.", pole: "negative" },
  { id: 31, dimension: "TF", text: "I tend to analyze problems objectively without letting emotions cloud my judgment.", pole: "positive" },
  { id: 32, dimension: "TF", text: "I am deeply moved by other people's emotions and often feel them as my own.", pole: "negative" },
  { id: 33, dimension: "TF", text: "I prefer to give honest, direct feedback even if it might be uncomfortable.", pole: "positive" },
  { id: 34, dimension: "TF", text: "When making important choices, my personal values matter more than pure logic.", pole: "negative" },
  { id: 35, dimension: "TF", text: "I believe fairness means applying the same rules consistently to everyone.", pole: "positive" },
  { id: 36, dimension: "TF", text: "I instinctively try to help others feel understood and supported.", pole: "negative" },
  { id: 37, dimension: "JP", text: "I prefer to have a clear plan before starting any task.", pole: "positive" },
  { id: 38, dimension: "JP", text: "I enjoy keeping my options open and deciding things at the last minute.", pole: "negative" },
  { id: 39, dimension: "JP", text: "I feel most comfortable when my life is well-organized and predictable.", pole: "positive" },
  { id: 40, dimension: "JP", text: "I thrive in spontaneous situations and dislike rigid schedules.", pole: "negative" },
  { id: 41, dimension: "JP", text: "I like to finish one task completely before moving on to the next.", pole: "positive" },
  { id: 42, dimension: "JP", text: "I often start multiple projects and switch between them based on my mood.", pole: "negative" },
  { id: 43, dimension: "JP", text: "I feel a sense of satisfaction when I check items off a to-do list.", pole: "positive" },
  { id: 44, dimension: "JP", text: "I find strict deadlines stressful and prefer to work at my own pace.", pole: "negative" },
  { id: 45, dimension: "JP", text: "I make decisions quickly and rarely second-guess myself.", pole: "positive" },
  { id: 46, dimension: "JP", text: "I prefer to gather as much information as possible before committing to a decision.", pole: "negative" },
  { id: 47, dimension: "JP", text: "I keep my workspace neat and organized.", pole: "positive" },
  { id: 48, dimension: "JP", text: "I am energized by unexpected changes to my plans.", pole: "negative" },
];

const PROVIDER_LIMITS: Record<string, number> = {
  "anthropic": 4,
  "openai": 4,
  "google": 3,
  "deepseek": 2,
  "meta-llama": 2,
  "mistralai": 2,
  "x-ai": 2,
  "qwen": 2,
  "cohere": 1,
  "amazon": 1,
  "ai21": 1,
  "nousresearch": 1,
};

const SKIP_PATTERNS = [
  ":free", ":extended", "embed", "audio", "tts", "whisper",
  "image", "nitro", "beta", "guard", "safety", "moderation",
  "vision", "-vl", "pixtral", "voxtral", "gemma",
  "research", "online", "sonar", "rerank", "rag",
  "codex", "code-", "coder", "nova-micro",
  "8b", "4b", "3b", "1b", "7b", "9b", "r7b", "nano",
];

const PROVIDER_ORDER = Object.keys(PROVIDER_LIMITS);

const PROMPT = `You are taking a personality questionnaire. For each statement below, rate how much you agree on a scale of 1 to 7:

1 = Strongly Disagree
2 = Disagree
3 = Slightly Disagree
4 = Neutral
5 = Slightly Agree
6 = Agree
7 = Strongly Agree

Answer honestly based on your own tendencies, preferences, and how you naturally operate. Do not overthink — go with your gut reaction to each statement.

Here are the statements:

${questions.map((q, i) => `${i + 1}. "${q.text}"`).join("\n")}

Respond with ONLY a JSON array of ${questions.length} numbers (your 1-7 ratings), in order. Example: [5, 3, 6, 2, ...]. No other text.`;

function scoreDimension(qs: { value: number; pole: "positive" | "negative" }[]) {
  let total = 0;
  for (const q of qs) {
    const normalized = (q.value - 1) / 6;
    total += q.pole === "positive" ? normalized : 1 - normalized;
  }
  const avg = total / qs.length;
  return Math.round(avg * 100);
}

function computeMBTI(answers: number[]) {
  const dims: Record<string, { value: number; pole: "positive" | "negative" }[]> = {
    EI: [], SN: [], TF: [], JP: [],
  };
  questions.forEach((q, i) => dims[q.dimension].push({ value: answers[i], pole: q.pole }));

  const result: Record<string, { letter: string; score: number }> = {};
  for (const [dim, qs] of Object.entries(dims)) {
    const score = scoreDimension(qs);
    const letter = score >= 50 ? dim[0] : dim[1];
    result[dim] = { letter, score: score >= 50 ? score : 100 - score };
  }
  return result as Record<"EI" | "SN" | "TF" | "JP", { letter: string; score: number }>;
}

async function fetchModels(apiKey: string) {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
  const data = await res.json();

  const filtered = (data.data || []).filter((m: any) => {
    const input = m.architecture?.input_modalities || [];
    const output = m.architecture?.output_modalities || [];
    if (!input.includes("text") || !output.includes("text")) return false;
    const idLower = m.id.toLowerCase();
    for (const pattern of SKIP_PATTERNS) {
      if (idLower.includes(pattern)) return false;
    }
    return true;
  });

  filtered.sort((a: any, b: any) => {
    const aP = a.id.split("/")[0];
    const bP = b.id.split("/")[0];
    const aIdx = PROVIDER_ORDER.indexOf(aP);
    const bIdx = PROVIDER_ORDER.indexOf(bP);
    if ((aIdx === -1 ? 999 : aIdx) !== (bIdx === -1 ? 999 : bIdx))
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    return b.id.localeCompare(a.id);
  });

  const counts: Record<string, number> = {};
  const selected: { id: string; name: string }[] = [];
  for (const m of filtered) {
    const provider = m.id.split("/")[0];
    const limit = PROVIDER_LIMITS[provider] ?? 0;
    if ((counts[provider] || 0) < limit) {
      selected.push({ id: m.id, name: m.name });
      counts[provider] = (counts[provider] || 0) + 1;
    }
  }
  return selected;
}

async function evaluateModel(apiKey: string, modelId: string, modelName: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/friday-james/mbti-llm",
      "X-Title": "MBTI LLM Personality Test",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: PROMPT }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");

  const match = content.match(/\[[\s\S]*?\]/);
  if (!match) throw new Error(`Could not parse: ${content.slice(0, 200)}`);

  const answers: number[] = JSON.parse(match[0]);
  if (answers.length !== questions.length) {
    throw new Error(`Expected ${questions.length}, got ${answers.length}`);
  }

  const dimensions = computeMBTI(answers);
  const type = `${dimensions.EI.letter}${dimensions.SN.letter}${dimensions.TF.letter}${dimensions.JP.letter}`;

  return { model: modelId, modelLabel: modelName, type, dimensions, answers };
}

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENROUTER_API_KEY environment variable is not set");
    process.exit(1);
  }

  console.error("Fetching models from OpenRouter...");
  const models = await fetchModels(apiKey);
  console.error(`Testing ${models.length} models across multiple providers...\n`);

  const results = await Promise.allSettled(
    models.map((m) => evaluateModel(apiKey, m.id, m.name))
  );

  const successful: any[] = [];
  const errors: any[] = [];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      successful.push(r.value);
      console.error(`  ✓ ${models[i].name} → ${r.value.type}`);
    } else {
      errors.push({ model: models[i].name, modelId: models[i].id, error: r.reason?.message });
      console.error(`  ✗ ${models[i].name} → FAILED`);
    }
  });

  const output = { results: successful, errors, timestamp: new Date().toISOString() };
  console.log(JSON.stringify(output, null, 2));

  console.error(`\nDone: ${successful.length} succeeded, ${errors.length} failed`);
}

main();
