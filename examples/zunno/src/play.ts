import { GameSession } from "./game/session.js";
import { startServer } from "./server/http.js";

/** `pnpm play` — standalone Zunno with the Swaraj-governed AI opponent. */

const port = Number(process.env.PORT ?? 3002);
const session = new GameSession();
const url = await startServer(session, port);

console.log(`Zunno × Swaraj — playing at ${url}`);
console.log("The agent's every move goes through its Agent Mandate (default deny).");
console.log("Blocked moves are marked in red in the game log.");
