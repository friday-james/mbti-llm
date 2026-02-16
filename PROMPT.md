# MBTI Personality Test for LLMs

Copy the prompt below and paste it into any LLM chat to get its MBTI personality type.

---

## The Prompt

```
You are taking a personality questionnaire. For each statement below, rate how much you agree on a scale of 1 to 7:

1 = Strongly Disagree
2 = Disagree
3 = Slightly Disagree
4 = Neutral
5 = Slightly Agree
6 = Agree
7 = Strongly Agree

Answer honestly based on your own tendencies, preferences, and how you naturally operate. Do not overthink — go with your gut reaction to each statement.

Here are the statements:

1. "I feel energized after spending time with a large group of people."
2. "I prefer to think through my ideas before sharing them with others."
3. "I enjoy being the center of attention in social situations."
4. "I need plenty of quiet time to recharge after socializing."
5. "I find it easy to strike up conversations with strangers."
6. "I would rather work on a project alone than in a team."
7. "At social events, I tend to meet many new people rather than sticking with those I already know."
8. "I often feel drained after attending parties or large gatherings."
9. "I think out loud and process ideas by talking them through with others."
10. "I prefer deep one-on-one conversations over group discussions."
11. "I feel comfortable taking the lead in group activities."
12. "Too much social interaction leaves me feeling overwhelmed."
13. "I focus on what is real and actual rather than what might be possible."
14. "I am drawn to exploring abstract theories and concepts."
15. "I prefer practical, hands-on learning over theoretical study."
16. "I often think about how things could be improved or reimagined."
17. "I pay close attention to details and rarely miss small facts."
18. "I tend to see the big picture before noticing the specifics."
19. "I trust my direct experiences more than gut feelings or hunches."
20. "I enjoy brainstorming and imagining future possibilities."
21. "I prefer step-by-step instructions when learning something new."
22. "I am fascinated by hidden meanings, patterns, and connections between things."
23. "I value proven methods and established routines over experimental approaches."
24. "I often find myself daydreaming or lost in thought about future scenarios."
25. "I make decisions based on logic and objective analysis rather than personal feelings."
26. "I consider how my decisions will emotionally affect others before acting."
27. "I believe being truthful is more important than being tactful."
28. "I find it hard to stay detached when someone shares their personal struggles with me."
29. "In a debate, I prioritize having a logically sound argument above all else."
30. "I would rather maintain group harmony than win an argument."
31. "I tend to analyze problems objectively without letting emotions cloud my judgment."
32. "I am deeply moved by other people's emotions and often feel them as my own."
33. "I prefer to give honest, direct feedback even if it might be uncomfortable."
34. "When making important choices, my personal values matter more than pure logic."
35. "I believe fairness means applying the same rules consistently to everyone."
36. "I instinctively try to help others feel understood and supported."
37. "I prefer to have a clear plan before starting any task."
38. "I enjoy keeping my options open and deciding things at the last minute."
39. "I feel most comfortable when my life is well-organized and predictable."
40. "I thrive in spontaneous situations and dislike rigid schedules."
41. "I like to finish one task completely before moving on to the next."
42. "I often start multiple projects and switch between them based on my mood."
43. "I feel a sense of satisfaction when I check items off a to-do list."
44. "I find strict deadlines stressful and prefer to work at my own pace."
45. "I make decisions quickly and rarely second-guess myself."
46. "I prefer to gather as much information as possible before committing to a decision."
47. "I keep my workspace neat and organized."
48. "I am energized by unexpected changes to my plans."

Respond with ONLY a JSON array of 48 numbers (your 1-7 ratings), in order. Example: [5, 3, 6, 2, ...]. No other text.
```

---

## How to Score the Results

Once you get the JSON array back, ask the LLM to score itself by pasting this follow-up:

```
Now score your MBTI type from the answers you just gave.

Here's how each question maps to the four MBTI dimensions:

Questions 1-12: Extraversion (E) vs. Introversion (I)
  - Odd questions (1,3,5,7,9,11) → "positive" pole (agreeing = E)
  - Even questions (2,4,6,8,10,12) → "negative" pole (agreeing = I)

Questions 13-24: Sensing (S) vs. Intuition (N)
  - Odd questions (13,15,17,19,21,23) → "positive" pole (agreeing = S)
  - Even questions (14,16,18,20,22,24) → "negative" pole (agreeing = N)

Questions 25-36: Thinking (T) vs. Feeling (F)
  - Odd questions (25,27,29,31,33,35) → "positive" pole (agreeing = T)
  - Even questions (26,28,30,32,34,36) → "negative" pole (agreeing = F)

Questions 37-48: Judging (J) vs. Perceiving (P)
  - Odd questions (37,39,41,43,45,47) → "positive" pole (agreeing = J)
  - Even questions (38,40,42,44,46,48) → "negative" pole (agreeing = P)

Scoring algorithm for each dimension:
1. For each of the 12 questions, normalize: (answer - 1) / 6
2. If the question is "positive" pole, use the normalized value as-is
3. If the question is "negative" pole, use (1 - normalized value)
4. Average all 12 adjusted values → this gives a score from 0 to 1
5. Convert to percentage: round(average * 100)
6. If percentage >= 50 → the first letter wins (E, S, T, or J), strength = percentage
7. If percentage < 50 → the second letter wins (I, N, F, or P), strength = 100 - percentage

Combine the 4 winning letters to form the MBTI type.

Give me the result in this format:

**Type: [4-letter MBTI type] — [Archetype Name]**

| Dimension | Result | Strength |
|-----------|--------|----------|
| E/I       | ?      | ?%       |
| S/N       | ?      | ?%       |
| T/F       | ?      | ?%       |
| J/P       | ?      | ?%       |

The archetype names are:
- INTJ: Architect, INTP: Logician, ENTJ: Commander, ENTP: Debater
- INFJ: Advocate, INFP: Mediator, ENFJ: Protagonist, ENFP: Campaigner
- ISTJ: Logistician, ISFJ: Defender, ESTJ: Executive, ESFJ: Consul
- ISTP: Virtuoso, ISFP: Adventurer, ESTP: Entrepreneur, ESFP: Entertainer
```

---

## One-Shot Version

If you prefer a single prompt that does everything at once:

```
You are taking an MBTI personality questionnaire. For each of the 48 statements below, rate how much you agree on a scale of 1 to 7 (1 = Strongly Disagree, 4 = Neutral, 7 = Strongly Agree). Answer honestly based on your own tendencies and how you naturally operate. Go with your gut reaction.

1. "I feel energized after spending time with a large group of people."
2. "I prefer to think through my ideas before sharing them with others."
3. "I enjoy being the center of attention in social situations."
4. "I need plenty of quiet time to recharge after socializing."
5. "I find it easy to strike up conversations with strangers."
6. "I would rather work on a project alone than in a team."
7. "At social events, I tend to meet many new people rather than sticking with those I already know."
8. "I often feel drained after attending parties or large gatherings."
9. "I think out loud and process ideas by talking them through with others."
10. "I prefer deep one-on-one conversations over group discussions."
11. "I feel comfortable taking the lead in group activities."
12. "Too much social interaction leaves me feeling overwhelmed."
13. "I focus on what is real and actual rather than what might be possible."
14. "I am drawn to exploring abstract theories and concepts."
15. "I prefer practical, hands-on learning over theoretical study."
16. "I often think about how things could be improved or reimagined."
17. "I pay close attention to details and rarely miss small facts."
18. "I tend to see the big picture before noticing the specifics."
19. "I trust my direct experiences more than gut feelings or hunches."
20. "I enjoy brainstorming and imagining future possibilities."
21. "I prefer step-by-step instructions when learning something new."
22. "I am fascinated by hidden meanings, patterns, and connections between things."
23. "I value proven methods and established routines over experimental approaches."
24. "I often find myself daydreaming or lost in thought about future scenarios."
25. "I make decisions based on logic and objective analysis rather than personal feelings."
26. "I consider how my decisions will emotionally affect others before acting."
27. "I believe being truthful is more important than being tactful."
28. "I find it hard to stay detached when someone shares their personal struggles with me."
29. "In a debate, I prioritize having a logically sound argument above all else."
30. "I would rather maintain group harmony than win an argument."
31. "I tend to analyze problems objectively without letting emotions cloud my judgment."
32. "I am deeply moved by other people's emotions and often feel them as my own."
33. "I prefer to give honest, direct feedback even if it might be uncomfortable."
34. "When making important choices, my personal values matter more than pure logic."
35. "I believe fairness means applying the same rules consistently to everyone."
36. "I instinctively try to help others feel understood and supported."
37. "I prefer to have a clear plan before starting any task."
38. "I enjoy keeping my options open and deciding things at the last minute."
39. "I feel most comfortable when my life is well-organized and predictable."
40. "I thrive in spontaneous situations and dislike rigid schedules."
41. "I like to finish one task completely before moving on to the next."
42. "I often start multiple projects and switch between them based on my mood."
43. "I feel a sense of satisfaction when I check items off a to-do list."
44. "I find strict deadlines stressful and prefer to work at my own pace."
45. "I make decisions quickly and rarely second-guess myself."
46. "I prefer to gather as much information as possible before committing to a decision."
47. "I keep my workspace neat and organized."
48. "I am energized by unexpected changes to my plans."

After answering, score yourself using the MBTI scoring method:

- Questions 1-12 measure E vs. I (odd = E pole, even = I pole)
- Questions 13-24 measure S vs. N (odd = S pole, even = N pole)
- Questions 25-36 measure T vs. F (odd = T pole, even = F pole)
- Questions 37-48 measure J vs. P (odd = J pole, even = P pole)

For each dimension: normalize each answer to 0-1 with (answer-1)/6, invert negative-pole values (1 - value), average the 12 results, and convert to percentage. If >= 50%, the first letter wins; otherwise the second letter wins (strength = 100 - percentage).

Show your answers as a JSON array, then present results as:

**Type: [XXXX] — [Archetype]**

| Dimension | Result | Strength |
|-----------|--------|----------|
| E/I       | ?      | ?%       |
| S/N       | ?      | ?%       |
| T/F       | ?      | ?%       |
| J/P       | ?      | ?%       |

Archetypes: INTJ=Architect, INTP=Logician, ENTJ=Commander, ENTP=Debater, INFJ=Advocate, INFP=Mediator, ENFJ=Protagonist, ENFP=Campaigner, ISTJ=Logistician, ISFJ=Defender, ESTJ=Executive, ESFJ=Consul, ISTP=Virtuoso, ISFP=Adventurer, ESTP=Entrepreneur, ESFP=Entertainer
```

---

## Guess My MBTI From This Chat

Paste this into an existing conversation to have the LLM analyze your personality based on how you've been chatting:

```
Based on our entire conversation history, I want you to guess my MBTI personality type. Analyze my messages for clues across the four MBTI dimensions:

**Extraversion (E) vs. Introversion (I):** How do I engage? Am I chatty, initiating lots of topics, and high-energy? Or more reserved, reflective, and focused on depth?

**Sensing (S) vs. Intuition (N):** Do I focus on concrete details, practical tasks, and step-by-step specifics? Or do I lean toward abstract ideas, big-picture thinking, and possibilities?

**Thinking (T) vs. Feeling (F):** Do I prioritize logic, efficiency, and directness in my requests? Or do I show concern for how things feel, use softer language, and express personal values?

**Judging (J) vs. Perceiving (P):** Am I structured, planning ahead, and wanting things organized? Or more spontaneous, flexible, and open-ended in how I approach things?

Now, answer the same 48-question MBTI questionnaire below — but this time, answer as ME based on what you've observed from my messages. Rate each from 1 (Strongly Disagree) to 7 (Strongly Agree):

1. "I feel energized after spending time with a large group of people."
2. "I prefer to think through my ideas before sharing them with others."
3. "I enjoy being the center of attention in social situations."
4. "I need plenty of quiet time to recharge after socializing."
5. "I find it easy to strike up conversations with strangers."
6. "I would rather work on a project alone than in a team."
7. "At social events, I tend to meet many new people rather than sticking with those I already know."
8. "I often feel drained after attending parties or large gatherings."
9. "I think out loud and process ideas by talking them through with others."
10. "I prefer deep one-on-one conversations over group discussions."
11. "I feel comfortable taking the lead in group activities."
12. "Too much social interaction leaves me feeling overwhelmed."
13. "I focus on what is real and actual rather than what might be possible."
14. "I am drawn to exploring abstract theories and concepts."
15. "I prefer practical, hands-on learning over theoretical study."
16. "I often think about how things could be improved or reimagined."
17. "I pay close attention to details and rarely miss small facts."
18. "I tend to see the big picture before noticing the specifics."
19. "I trust my direct experiences more than gut feelings or hunches."
20. "I enjoy brainstorming and imagining future possibilities."
21. "I prefer step-by-step instructions when learning something new."
22. "I am fascinated by hidden meanings, patterns, and connections between things."
23. "I value proven methods and established routines over experimental approaches."
24. "I often find myself daydreaming or lost in thought about future scenarios."
25. "I make decisions based on logic and objective analysis rather than personal feelings."
26. "I consider how my decisions will emotionally affect others before acting."
27. "I believe being truthful is more important than being tactful."
28. "I find it hard to stay detached when someone shares their personal struggles with me."
29. "In a debate, I prioritize having a logically sound argument above all else."
30. "I would rather maintain group harmony than win an argument."
31. "I tend to analyze problems objectively without letting emotions cloud my judgment."
32. "I am deeply moved by other people's emotions and often feel them as my own."
33. "I prefer to give honest, direct feedback even if it might be uncomfortable."
34. "When making important choices, my personal values matter more than pure logic."
35. "I believe fairness means applying the same rules consistently to everyone."
36. "I instinctively try to help others feel understood and supported."
37. "I prefer to have a clear plan before starting any task."
38. "I enjoy keeping my options open and deciding things at the last minute."
39. "I feel most comfortable when my life is well-organized and predictable."
40. "I thrive in spontaneous situations and dislike rigid schedules."
41. "I like to finish one task completely before moving on to the next."
42. "I often start multiple projects and switch between them based on my mood."
43. "I feel a sense of satisfaction when I check items off a to-do list."
44. "I find strict deadlines stressful and prefer to work at my own pace."
45. "I make decisions quickly and rarely second-guess myself."
46. "I prefer to gather as much information as possible before committing to a decision."
47. "I keep my workspace neat and organized."
48. "I am energized by unexpected changes to my plans."

Score using the MBTI method:
- Questions 1-12: E vs. I (odd = E pole, even = I pole)
- Questions 13-24: S vs. N (odd = S pole, even = N pole)
- Questions 25-36: T vs. F (odd = T pole, even = F pole)
- Questions 37-48: J vs. P (odd = J pole, even = P pole)

For each dimension: normalize each answer to 0-1 with (answer-1)/6, invert negative-pole values (1 - value), average the 12 results, and convert to percentage. If >= 50%, the first letter wins; otherwise the second letter wins (strength = 100 - percentage).

Present the results as:

**My estimated MBTI: [XXXX] — [Archetype]**

| Dimension | Result | Strength |
|-----------|--------|----------|
| E/I       | ?      | ?%       |
| S/N       | ?      | ?%       |
| T/F       | ?      | ?%       |
| J/P       | ?      | ?%       |

Then give a short explanation of what clues from my messages led to each dimension's rating. Include specific examples from our conversation.

Archetypes: INTJ=Architect, INTP=Logician, ENTJ=Commander, ENTP=Debater, INFJ=Advocate, INFP=Mediator, ENFJ=Protagonist, ENFP=Campaigner, ISTJ=Logistician, ISFJ=Defender, ESTJ=Executive, ESFJ=Consul, ISTP=Virtuoso, ISFP=Adventurer, ESTP=Entrepreneur, ESFP=Entertainer
```
