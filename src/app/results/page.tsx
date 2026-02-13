"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ModelResult, EvaluationResponse } from "@/lib/types";

const typeNames: Record<string, string> = {
  INTJ: "Architect", INTP: "Logician", ENTJ: "Commander", ENTP: "Debater",
  INFJ: "Advocate", INFP: "Mediator", ENFJ: "Protagonist", ENFP: "Campaigner",
  ISTJ: "Logistician", ISFJ: "Defender", ESTJ: "Executive", ESFJ: "Consul",
  ISTP: "Virtuoso", ISFP: "Adventurer", ESTP: "Entrepreneur", ESFP: "Entertainer",
};

const dimColors: Record<string, string> = {
  E: "bg-amber-400", I: "bg-blue-500",
  S: "bg-green-500", N: "bg-purple-500",
  T: "bg-rose-500", F: "bg-teal-500",
  J: "bg-orange-500", P: "bg-cyan-500",
};

const dimLabels: Record<string, [string, string]> = {
  EI: ["Extraversion", "Introversion"],
  SN: ["Sensing", "Intuition"],
  TF: ["Thinking", "Feeling"],
  JP: ["Judging", "Perceiving"],
};

function toAxis(dim: { letter: string; score: number }, firstLetter: string): number {
  // Returns -1 to +1: negative = first letter side, positive = second letter side
  const offset = (dim.score - 50) / 50;
  return dim.letter === firstLetter ? -offset : offset;
}

function QuadrantChart({
  results,
  xDim,
  yDim,
  xLabels,
  yLabels,
}: {
  results: ModelResult[];
  xDim: "EI" | "SN" | "TF" | "JP";
  yDim: "EI" | "SN" | "TF" | "JP";
  xLabels: [string, string]; // [left, right]
  yLabels: [string, string]; // [bottom, top]
}) {
  const size = 500;
  const pad = 50;
  const inner = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;

  // Compute positions
  const points = results.map((r) => {
    const xVal = toAxis(r.dimensions[xDim], xDim[0]);
    const yVal = toAxis(r.dimensions[yDim], yDim[0]);
    const px = cx + xVal * (inner / 2);
    const py = cy - yVal * (inner / 2); // SVG y is inverted
    return { r, px, py, xVal, yVal };
  });

  return (
    <div className="w-full max-w-lg">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        {/* Background quadrants */}
        <rect x={pad} y={pad} width={inner / 2} height={inner / 2} fill="#fef3c7" opacity={0.3} />
        <rect x={cx} y={pad} width={inner / 2} height={inner / 2} fill="#dbeafe" opacity={0.3} />
        <rect x={pad} y={cy} width={inner / 2} height={inner / 2} fill="#d1fae5" opacity={0.3} />
        <rect x={cx} y={cy} width={inner / 2} height={inner / 2} fill="#ede9fe" opacity={0.3} />

        {/* Axes */}
        <line x1={pad} y1={cy} x2={size - pad} y2={cy} stroke="#d1d5db" strokeWidth={1} />
        <line x1={cx} y1={pad} x2={cx} y2={size - pad} stroke="#d1d5db" strokeWidth={1} />

        {/* Axis labels */}
        <text x={pad + 4} y={cy - 6} fontSize={13} fontWeight={700} fill="#92400e">{xLabels[0]}</text>
        <text x={size - pad - 4} y={cy - 6} fontSize={13} fontWeight={700} fill="#1e40af" textAnchor="end">{xLabels[1]}</text>
        <text x={cx + 6} y={pad + 14} fontSize={13} fontWeight={700} fill="#6d28d9">{yLabels[1]}</text>
        <text x={cx + 6} y={size - pad - 6} fontSize={13} fontWeight={700} fill="#047857">{yLabels[0]}</text>

        {/* Model dots */}
        {points.map(({ r, px, py }, i) => (
          <g key={i}>
            {/* Avatar image */}
            <image
              href={`/avatars/${r.type.toLowerCase()}.svg`}
              x={px - 16}
              y={py - 28}
              width={32}
              height={32}
            />
            {/* Label */}
            <text
              x={px}
              y={py + 14}
              fontSize={8}
              textAnchor="middle"
              fill="#374151"
              fontWeight={600}
            >
              {r.modelLabel.split(":").pop()?.trim().split(" ").slice(0, 2).join(" ")}
            </text>
            {/* Dot */}
            <circle cx={px} cy={py} r={3} fill="#6d28d9" opacity={0.6} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function ModelCard({ result }: { result: ModelResult }) {
  const typeName = typeNames[result.type] || "";
  const letters = result.type.split("");
  const avatarSrc = `/avatars/${result.type.toLowerCase()}.svg`;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <Image
        src={avatarSrc}
        alt={`${result.type} - ${typeName}`}
        width={80}
        height={80}
        className="mb-2"
      />
      <div className="mb-1 truncate text-xs font-medium text-gray-400">
        {result.modelLabel}
      </div>
      <div className="mb-1 flex gap-0.5">
        {letters.map((l, i) => (
          <span
            key={i}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-black text-white ${dimColors[l]}`}
          >
            {l}
          </span>
        ))}
      </div>
      <div className="mb-3 text-sm font-semibold text-gray-600">{typeName}</div>

      <div className="flex flex-col gap-2">
        {(["EI", "SN", "TF", "JP"] as const).map((dim) => {
          const d = result.dimensions[dim];
          const [labelA, labelB] = dimLabels[dim];
          const isFirst = d.letter === dim[0];
          return (
            <div key={dim}>
              <div className="mb-0.5 flex justify-between text-[10px] text-gray-400">
                <span className={isFirst ? "font-bold text-gray-600" : ""}>
                  {labelA}
                </span>
                <span className={!isFirst ? "font-bold text-gray-600" : ""}>
                  {labelB}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`absolute top-0 h-full rounded-full ${dimColors[d.letter]}`}
                  style={{
                    width: `${d.score}%`,
                    ...(isFirst ? { left: 0 } : { right: 0 }),
                  }}
                />
              </div>
              <div className="mt-0.5 text-right text-[10px] text-gray-400">
                {d.score}% {d.letter}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypeDistribution({ results }: { results: ModelResult[] }) {
  const typeCounts: Record<string, number> = {};
  results.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-4 text-lg font-bold text-gray-800">Type Distribution</h2>
      <div className="flex flex-col gap-2">
        {sorted.map(([type, count]) => (
          <div key={type} className="flex items-center gap-3">
            <Image
              src={`/avatars/${type.toLowerCase()}.svg`}
              alt={type}
              width={32}
              height={32}
              className="shrink-0"
            />
            <div className="flex w-16 gap-0.5">
              {type.split("").map((l, i) => (
                <span
                  key={i}
                  className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white ${dimColors[l]}`}
                >
                  {l}
                </span>
              ))}
            </div>
            <div className="flex-1">
              <div
                className="h-6 rounded-md bg-violet-500 transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <div className="w-20 text-right text-sm text-gray-600">
              {count} model{count > 1 ? "s" : ""}{" "}
              <span className="text-gray-400">
                ({Math.round((count / results.length) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonTable({ results }: { results: ModelResult[] }) {
  return (
    <div className="w-full max-w-4xl overflow-x-auto">
      <h2 className="mb-4 text-lg font-bold text-gray-800">Full Comparison</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-3 py-2 font-semibold text-gray-700">Model</th>
            <th className="px-3 py-2 font-semibold text-gray-700">Type</th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700">E/I</th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700">S/N</th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700">T/F</th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700">J/P</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.model} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-800">{r.modelLabel}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Image
                    src={`/avatars/${r.type.toLowerCase()}.svg`}
                    alt={r.type}
                    width={24}
                    height={24}
                  />
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono font-bold text-gray-700">
                    {r.type}
                  </span>
                </div>
              </td>
              {(["EI", "SN", "TF", "JP"] as const).map((dim) => (
                <td key={dim} className="px-3 py-2 text-center">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white ${dimColors[r.dimensions[dim].letter]}`}>
                    {r.dimensions[dim].letter}
                  </span>
                  <span className="ml-1 text-xs text-gray-400">{r.dimensions[dim].score}%</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");

  if (!dataParam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No results found.</p>
        <Link href="/" className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
          Run Experiment
        </Link>
      </div>
    );
  }

  let data: EvaluationResponse;
  try {
    data = JSON.parse(decodeURIComponent(dataParam));
  } catch {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Invalid data.</p>
        <Link href="/" className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
          Try Again
        </Link>
      </div>
    );
  }

  const results = data.results || [];

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-3xl font-black text-blue-600">M</span>
        <span className="text-3xl font-black text-emerald-600">B</span>
        <span className="text-3xl font-black text-rose-600">T</span>
        <span className="text-3xl font-black text-violet-600">I</span>
        <span className="text-2xl font-light text-gray-300">x</span>
        <span className="text-3xl font-black text-gray-800">LLM</span>
      </div>
      <p className="mb-8 text-sm text-gray-400">
        {results.length} models tested &middot; {data.timestamp ? new Date(data.timestamp).toLocaleDateString() : ""}
      </p>

      {/* Quadrant scatter charts */}
      {results.length > 0 && (
        <div className="mb-12 grid w-full max-w-4xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-gray-500">
              Mind & Energy
            </h2>
            <QuadrantChart
              results={results}
              xDim="EI"
              yDim="SN"
              xLabels={["Extraversion", "Introversion"]}
              yLabels={["Sensing", "Intuition"]}
            />
          </div>
          <div>
            <h2 className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-gray-500">
              Nature & Tactics
            </h2>
            <QuadrantChart
              results={results}
              xDim="TF"
              yDim="JP"
              xLabels={["Thinking", "Feeling"]}
              yLabels={["Judging", "Perceiving"]}
            />
          </div>
        </div>
      )}

      {/* Distribution chart */}
      {results.length > 0 && (
        <div className="mb-12">
          <TypeDistribution results={results} />
        </div>
      )}

      {/* Model cards grid */}
      <div className="mb-12 grid w-full max-w-6xl gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {results.map((r) => (
          <ModelCard key={r.model} result={r} />
        ))}
      </div>

      {/* Comparison table */}
      {results.length > 0 && <ComparisonTable results={results} />}

      {/* Errors */}
      {data.errors && data.errors.length > 0 && (
        <div className="mt-8 w-full max-w-4xl rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="mb-2 text-sm font-medium text-red-600">
            {data.errors.length} model{data.errors.length > 1 ? "s" : ""} failed:
          </p>
          <div className="flex flex-wrap gap-2">
            {data.errors.map((e, i) => (
              <span key={i} className="rounded bg-white px-2 py-1 text-xs text-red-500 shadow-sm">
                {e.model}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/"
          className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Run Again
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
