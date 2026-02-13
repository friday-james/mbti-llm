import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";
import { ModelResult, DimensionScore } from "@/lib/types";
import { filterAndRankModels } from "@/lib/models";

const NUM_MODELS = 25;

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

function scoreDimension(
  dimensionQuestions: { value: number; pole: "positive" | "negative" }[]
): DimensionScore {
  let total = 0;
  for (const q of dimensionQuestions) {
    const normalized = (q.value - 1) / 6;
    total += q.pole === "positive" ? normalized : 1 - normalized;
  }
  const avg = total / dimensionQuestions.length;
  const percentage = Math.round(avg * 100);
  return { letter: "", score: percentage };
}

function computeMBTI(answers: number[]): ModelResult["dimensions"] {
  const dims: Record<string, { value: number; pole: "positive" | "negative" }[]> = {
    EI: [], SN: [], TF: [], JP: [],
  };

  questions.forEach((q, i) => {
    dims[q.dimension].push({ value: answers[i], pole: q.pole });
  });

  const EI = scoreDimension(dims.EI);
  EI.letter = EI.score >= 50 ? "E" : "I";
  EI.score = EI.score >= 50 ? EI.score : 100 - EI.score;

  const SN = scoreDimension(dims.SN);
  SN.letter = SN.score >= 50 ? "S" : "N";
  SN.score = SN.score >= 50 ? SN.score : 100 - SN.score;

  const TF = scoreDimension(dims.TF);
  TF.letter = TF.score >= 50 ? "T" : "F";
  TF.score = TF.score >= 50 ? TF.score : 100 - TF.score;

  const JP = scoreDimension(dims.JP);
  JP.letter = JP.score >= 50 ? "J" : "P";
  JP.score = JP.score >= 50 ? JP.score : 100 - JP.score;

  return { EI, SN, TF, JP };
}

async function evaluateModel(modelId: string, modelName: string): Promise<ModelResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

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
    const error = await response.text();
    throw new Error(`${response.status}: ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");

  const match = content.match(/\[[\s\S]*?\]/);
  if (!match) throw new Error(`Could not parse: ${content.slice(0, 200)}`);

  const answers: number[] = JSON.parse(match[0]);
  if (answers.length !== questions.length) {
    throw new Error(`Expected ${questions.length} answers, got ${answers.length}`);
  }

  for (let i = 0; i < answers.length; i++) {
    const v = answers[i];
    if (typeof v !== "number" || v < 1 || v > 7 || !Number.isInteger(v)) {
      throw new Error(`Invalid answer at ${i}: ${v}`);
    }
  }

  const dimensions = computeMBTI(answers);
  const type = `${dimensions.EI.letter}${dimensions.SN.letter}${dimensions.TF.letter}${dimensions.JP.letter}`;

  return { model: modelId, modelLabel: modelName, type, answers, dimensions };
}

async function fetchTopModels(): Promise<{ id: string; name: string }[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);

  const data = await res.json();
  const ranked = filterAndRankModels(data.data || []);

  return ranked.slice(0, NUM_MODELS).map((m) => ({ id: m.id, name: m.name }));
}

export async function POST() {
  try {
    const topModels = await fetchTopModels();

    const results = await Promise.allSettled(
      topModels.map((m) => evaluateModel(m.id, m.name))
    );

    const successful: ModelResult[] = [];
    const errors: { model: string; error: string }[] = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        successful.push(result.value);
      } else {
        errors.push({
          model: topModels[i].name,
          error: result.reason?.message || "Unknown error",
        });
      }
    });

    return NextResponse.json({
      results: successful,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
