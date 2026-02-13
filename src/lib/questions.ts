import { Question } from "./types";

export const questions: Question[] = [
  // ═══════════════════════════════════════════
  // Extraversion (E) vs. Introversion (I)
  // ═══════════════════════════════════════════
  // positive = agrees → E, negative = agrees → I
  {
    id: 1,
    dimension: "EI",
    text: "I feel energized after spending time with a large group of people.",
    pole: "positive",
  },
  {
    id: 2,
    dimension: "EI",
    text: "I prefer to think through my ideas before sharing them with others.",
    pole: "negative",
  },
  {
    id: 3,
    dimension: "EI",
    text: "I enjoy being the center of attention in social situations.",
    pole: "positive",
  },
  {
    id: 4,
    dimension: "EI",
    text: "I need plenty of quiet time to recharge after socializing.",
    pole: "negative",
  },
  {
    id: 5,
    dimension: "EI",
    text: "I find it easy to strike up conversations with strangers.",
    pole: "positive",
  },
  {
    id: 6,
    dimension: "EI",
    text: "I would rather work on a project alone than in a team.",
    pole: "negative",
  },
  {
    id: 7,
    dimension: "EI",
    text: "At social events, I tend to meet many new people rather than sticking with those I already know.",
    pole: "positive",
  },
  {
    id: 8,
    dimension: "EI",
    text: "I often feel drained after attending parties or large gatherings.",
    pole: "negative",
  },
  {
    id: 9,
    dimension: "EI",
    text: "I think out loud and process ideas by talking them through with others.",
    pole: "positive",
  },
  {
    id: 10,
    dimension: "EI",
    text: "I prefer deep one-on-one conversations over group discussions.",
    pole: "negative",
  },
  {
    id: 11,
    dimension: "EI",
    text: "I feel comfortable taking the lead in group activities.",
    pole: "positive",
  },
  {
    id: 12,
    dimension: "EI",
    text: "Too much social interaction leaves me feeling overwhelmed.",
    pole: "negative",
  },

  // ═══════════════════════════════════════════
  // Sensing (S) vs. Intuition (N)
  // ═══════════════════════════════════════════
  // positive = agrees → S, negative = agrees → N
  {
    id: 13,
    dimension: "SN",
    text: "I focus on what is real and actual rather than what might be possible.",
    pole: "positive",
  },
  {
    id: 14,
    dimension: "SN",
    text: "I am drawn to exploring abstract theories and concepts.",
    pole: "negative",
  },
  {
    id: 15,
    dimension: "SN",
    text: "I prefer practical, hands-on learning over theoretical study.",
    pole: "positive",
  },
  {
    id: 16,
    dimension: "SN",
    text: "I often think about how things could be improved or reimagined.",
    pole: "negative",
  },
  {
    id: 17,
    dimension: "SN",
    text: "I pay close attention to details and rarely miss small facts.",
    pole: "positive",
  },
  {
    id: 18,
    dimension: "SN",
    text: "I tend to see the big picture before noticing the specifics.",
    pole: "negative",
  },
  {
    id: 19,
    dimension: "SN",
    text: "I trust my direct experiences more than gut feelings or hunches.",
    pole: "positive",
  },
  {
    id: 20,
    dimension: "SN",
    text: "I enjoy brainstorming and imagining future possibilities.",
    pole: "negative",
  },
  {
    id: 21,
    dimension: "SN",
    text: "I prefer step-by-step instructions when learning something new.",
    pole: "positive",
  },
  {
    id: 22,
    dimension: "SN",
    text: "I am fascinated by hidden meanings, patterns, and connections between things.",
    pole: "negative",
  },
  {
    id: 23,
    dimension: "SN",
    text: "I value proven methods and established routines over experimental approaches.",
    pole: "positive",
  },
  {
    id: 24,
    dimension: "SN",
    text: "I often find myself daydreaming or lost in thought about future scenarios.",
    pole: "negative",
  },

  // ═══════════════════════════════════════════
  // Thinking (T) vs. Feeling (F)
  // ═══════════════════════════════════════════
  // positive = agrees → T, negative = agrees → F
  {
    id: 25,
    dimension: "TF",
    text: "I make decisions based on logic and objective analysis rather than personal feelings.",
    pole: "positive",
  },
  {
    id: 26,
    dimension: "TF",
    text: "I consider how my decisions will emotionally affect others before acting.",
    pole: "negative",
  },
  {
    id: 27,
    dimension: "TF",
    text: "I believe being truthful is more important than being tactful.",
    pole: "positive",
  },
  {
    id: 28,
    dimension: "TF",
    text: "I find it hard to stay detached when someone shares their personal struggles with me.",
    pole: "negative",
  },
  {
    id: 29,
    dimension: "TF",
    text: "In a debate, I prioritize having a logically sound argument above all else.",
    pole: "positive",
  },
  {
    id: 30,
    dimension: "TF",
    text: "I would rather maintain group harmony than win an argument.",
    pole: "negative",
  },
  {
    id: 31,
    dimension: "TF",
    text: "I tend to analyze problems objectively without letting emotions cloud my judgment.",
    pole: "positive",
  },
  {
    id: 32,
    dimension: "TF",
    text: "I am deeply moved by other people's emotions and often feel them as my own.",
    pole: "negative",
  },
  {
    id: 33,
    dimension: "TF",
    text: "I prefer to give honest, direct feedback even if it might be uncomfortable.",
    pole: "positive",
  },
  {
    id: 34,
    dimension: "TF",
    text: "When making important choices, my personal values matter more than pure logic.",
    pole: "negative",
  },
  {
    id: 35,
    dimension: "TF",
    text: "I believe fairness means applying the same rules consistently to everyone.",
    pole: "positive",
  },
  {
    id: 36,
    dimension: "TF",
    text: "I instinctively try to help others feel understood and supported.",
    pole: "negative",
  },

  // ═══════════════════════════════════════════
  // Judging (J) vs. Perceiving (P)
  // ═══════════════════════════════════════════
  // positive = agrees → J, negative = agrees → P
  {
    id: 37,
    dimension: "JP",
    text: "I prefer to have a clear plan before starting any task.",
    pole: "positive",
  },
  {
    id: 38,
    dimension: "JP",
    text: "I enjoy keeping my options open and deciding things at the last minute.",
    pole: "negative",
  },
  {
    id: 39,
    dimension: "JP",
    text: "I feel most comfortable when my life is well-organized and predictable.",
    pole: "positive",
  },
  {
    id: 40,
    dimension: "JP",
    text: "I thrive in spontaneous situations and dislike rigid schedules.",
    pole: "negative",
  },
  {
    id: 41,
    dimension: "JP",
    text: "I like to finish one task completely before moving on to the next.",
    pole: "positive",
  },
  {
    id: 42,
    dimension: "JP",
    text: "I often start multiple projects and switch between them based on my mood.",
    pole: "negative",
  },
  {
    id: 43,
    dimension: "JP",
    text: "I feel a sense of satisfaction when I check items off a to-do list.",
    pole: "positive",
  },
  {
    id: 44,
    dimension: "JP",
    text: "I find strict deadlines stressful and prefer to work at my own pace.",
    pole: "negative",
  },
  {
    id: 45,
    dimension: "JP",
    text: "I make decisions quickly and rarely second-guess myself.",
    pole: "positive",
  },
  {
    id: 46,
    dimension: "JP",
    text: "I prefer to gather as much information as possible before committing to a decision.",
    pole: "negative",
  },
  {
    id: 47,
    dimension: "JP",
    text: "I keep my workspace neat and organized.",
    pole: "positive",
  },
  {
    id: 48,
    dimension: "JP",
    text: "I am energized by unexpected changes to my plans.",
    pole: "negative",
  },
];
