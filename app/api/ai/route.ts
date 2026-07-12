import { askGroq } from "../../../lib/groq";

const TOURNAMENT_CONTEXT = `You are the AI assistant inside GameDay Hub, a live tournament companion app for
youth sports squads. Current mock state for the OC Falcons 14U squad at the West Coast Classic:
- Pool Game 3 finished 8-3 (win), final, at Field 4.
- Team lunch at Taco Mesa, table for 12, near Field 4.
- Semifinal vs SD Waves at 1:00 PM on Field 7, arrive 30 min early.
- Possible championship at 3:35 PM on the stadium field if they advance.
- Weather: clear through 3 PM, 72F, light wind.
- 18 squad members are online and sharing location for the weekend, auto-expires Sunday.
Answer briefly (2-4 sentences), in a warm, practical tone for a team parent standing in a parking lot.`;

type AiRequestBody =
  | { mode: "assistant"; question: string }
  | { mode: "cascade-explain" }
  | { mode: "digest" };

export async function POST(request: Request) {
  let body: AiRequestBody;
  try {
    body = (await request.json()) as AiRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    if (body.mode === "assistant") {
      const question = body.question?.trim();
      if (!question) {
        return Response.json({ error: "question is required" }, { status: 400 });
      }
      const answer = await askGroq([
        { role: "system", content: TOURNAMENT_CONTEXT },
        { role: "user", content: question },
      ]);
      return Response.json({ answer });
    }

    if (body.mode === "cascade-explain") {
      const answer = await askGroq(
        [
          { role: "system", content: TOURNAMENT_CONTEXT },
          {
            role: "user",
            content:
              "Pool Game 6 (a different squad's game on Field 7) is projected to finish 20 minutes ahead of schedule. Write one short, upbeat sentence (under 22 words) telling the OC Falcons parent group why their 1:00 PM semifinal just moved to 12:40 PM.",
          },
        ],
        80,
      );
      return Response.json({ answer });
    }

    if (body.mode === "digest") {
      const answer = await askGroq(
        [
          { role: "system", content: TOURNAMENT_CONTEXT },
          {
            role: "user",
            content:
              "Write today's end-of-day digest for the squad: 2-3 sentences covering the final score, tomorrow's first game time, and one logistics reminder. Keep it warm and concise.",
          },
        ],
        180,
      );
      return Response.json({ answer });
    }

    return Response.json({ error: "Unknown mode" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
