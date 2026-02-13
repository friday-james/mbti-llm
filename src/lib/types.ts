export interface Question {
  id: number;
  dimension: "EI" | "SN" | "TF" | "JP";
  text: string;
  pole: "positive" | "negative"; // positive = agrees with first letter (E,S,T,J)
}

export interface DimensionScore {
  letter: string;
  score: number; // 0-100, percentage toward the chosen letter
}

export interface ModelResult {
  model: string;
  modelLabel: string;
  type: string;
  answers: number[]; // raw 1-7 answers for each question
  dimensions: {
    EI: DimensionScore;
    SN: DimensionScore;
    TF: DimensionScore;
    JP: DimensionScore;
  };
}

export interface EvaluationResponse {
  results: ModelResult[];
  errors: { model: string; error: string }[];
  timestamp: string;
}
