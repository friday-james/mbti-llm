export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
  };
}

// Providers and max models per provider
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

const PROVIDER_ORDER = Object.keys(PROVIDER_LIMITS);

// Skip models with these substrings (not useful for personality testing)
const SKIP_PATTERNS = [
  ":free", ":extended", "embed", "audio", "tts", "whisper",
  "image", "nitro", "beta", "guard", "safety", "moderation",
  "vision", "-vl", "pixtral", "voxtral", "gemma",
  "research", "online", "sonar", "rerank", "rag",
  "codex", "code-", "coder", "nova-micro",
  "8b", "4b", "3b", "1b", "7b", "9b", "r7b", "nano",
];

export function filterAndRankModels(models: OpenRouterModel[]): OpenRouterModel[] {
  const textModels = models.filter((m) => {
    const input = m.architecture?.input_modalities || [];
    const output = m.architecture?.output_modalities || [];
    if (!input.includes("text") || !output.includes("text")) return false;

    const idLower = m.id.toLowerCase();
    for (const pattern of SKIP_PATTERNS) {
      if (idLower.includes(pattern)) return false;
    }
    return true;
  });

  // Sort: prefer known providers, newest/biggest models first
  textModels.sort((a, b) => {
    const aP = a.id.split("/")[0];
    const bP = b.id.split("/")[0];
    const aIdx = PROVIDER_ORDER.indexOf(aP);
    const bIdx = PROVIDER_ORDER.indexOf(bP);
    const aPri = aIdx === -1 ? 999 : aIdx;
    const bPri = bIdx === -1 ? 999 : bIdx;
    if (aPri !== bPri) return aPri - bPri;
    // Within same provider, sort descending by id (newer models have higher version numbers)
    return b.id.localeCompare(a.id);
  });

  const counts: Record<string, number> = {};
  const selected: OpenRouterModel[] = [];

  for (const model of textModels) {
    const provider = model.id.split("/")[0];
    const limit = PROVIDER_LIMITS[provider] ?? 0;
    if ((counts[provider] || 0) < limit) {
      selected.push(model);
      counts[provider] = (counts[provider] || 0) + 1;
    }
  }

  return selected;
}
