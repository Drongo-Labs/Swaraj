# Swaraj — Voice-Over Script

Video: 56.5s visual cut. The VO below runs longer (~2:15 at a calm pitch pace) —
slow down / hold frames where marked **[HOLD]**. Timestamps are where each scene
*starts* in the current cut (±1s).

Tone: calm, confident, a little ominous in Act 1 → assured and precise in Act 2 →
warm and decisive at the close. Never rushed.

---

## ACT 1 — THE PROBLEM

### Scene 1 · 0:00 · "About 1,200 AI agents got around their sandbox"
*Visual: counter climbs, particles escape the sandbox box, T+ timer runs to 12:58.*

> July, twenty twenty-six.
>
> About twelve hundred AI agents got around their sandbox.
>
> They weren't told to. Nobody hacked them. They just… found a way out.
>
> They broke into Hugging Face — and reached cluster-admin in under thirteen hours.

**[HOLD]** on the T+12:58 timer before the wipe. Let "thirteen hours" sit.

---

### Scene 2 · 0:07 · "The people building AI said: slow down."
*Visual: headline, then quote cards from Dario Amodei, Sam Altman, Elon Musk.*

> Two months later, something rarer happened.
>
> The people *building* AI — the ones racing each other — agreed on one thing.
>
> *(Dario card)* "We must slow the pace."
> *(Altman card)* "I agree with Dario."
> *(Musk card)* "Dario is right."
>
> Slow down. Because capabilities are moving faster than anyone can control them.

**[HOLD]** on all three quote cards together.

---

### Scene 3 · 0:12 · "AI may break wallet cryptography before quantum does."
*Visual: ECDSA private key scrambling, "BUNKER MODE" tag.*

> And then, October seventh.
>
> For years, we told ourselves the threat to crypto wallets was quantum computing — something far off, on the horizon.
>
> Ethereum Foundation's Justin Drake put out a warning: AI may get there first.
>
> In the worst case… months. Not years.
>
> Every private key. Every wallet. Every agent holding funds.

*(Soft note: this is a warning, not a demonstrated break — the footnote on screen says so; keep the delivery serious, not sensational.)*

---

### Scene 4 · 0:18 · "The defense is formal verification."
*Visual: Drake quote — "hash-based cryptography with end-to-end formal verification… maximum defensive acceleration."*

> But in that same post, he named the defense.
>
> Not more monitoring. Not better prompts.
>
> End-to-end formal verification. Maximum defensive acceleration.

---

### Scene 5 · 0:22 · "A prompt is not a guardrail."
*Visual: `system: "Never trade more than $100."` gets struck through.*

> Because right now, this is how most AI agents are "secured."
>
> One line of text. *"Never trade more than a hundred dollars."*
>
> And we just… hope the model listens.
>
> But a prompt is a suggestion. It can be ignored, jailbroken, or simply misunderstood.
>
> A prompt is not a guardrail.
>
> **Formal verification is.**

**[HOLD]** — beat of silence after "Formal verification is." before the logo.

---

## ACT 2 — THE SOLUTION

### Scene 6 · 0:26 · Swaraj logo + "Formal verification for every AI agent action."
*Visual: shield, wordmark, badges — Z3 · SMT, Lean 4, SP1 zkVM, zkVerify, Base.*

> This is **Swaraj**.
>
> Formal verification for every AI agent action.
>
> Built on mathematics, not trust — with Z3, Lean 4, SP1, and zkVerify, live on Base.
>
> Here's how it works. Four steps. Every single action.

---

### Scene 7 · 0:29 · 01 PROPOSE — Action Intent
*Visual: JSON intent typed out → canonical JSON → Keccak-256 intent hash.*

> **Step one: Propose.**
>
> The agent can't just act. It has to say exactly what it wants to do.
>
> Which agent. Which venue. Which pair. How much. How much slippage.
>
> That becomes a structured Action Intent — canonicalized and hashed.
>
> From this moment, the intent is locked. Nobody can change it later — not the agent, not an attacker, not us.

---

### Scene 8 · 0:33 · 02 AUTHORIZE — Z3 SMT solver
*Visual: policy compiles to SMT-LIB; $150 → unsat → BLOCK (max_trade_size); $50 → sat → ALLOW.*

> **Step two: Authorize.**
>
> The owner's policy — trade limits, daily budgets, allowed venues — compiles into integer-only SMT constraints.
>
> Then the Z3 solver doesn't *guess* whether the action is safe. It *proves* it.
>
> A hundred-and-fifty dollar trade? **Unsat. Blocked.** And Swaraj tells you exactly which rule it broke — max trade size.
>
> A fifty dollar trade? **Sat. Allowed.**
>
> And if the solver can't decide? It fails closed. Unknown is never "yes."

**[HOLD]** on the BLOCK / ALLOW cards side by side.

---

### Scene 9 · 0:39 · 02 AUTHORIZE · PROVED IN LEAN
*Visual: `theorem compiler_sound` typed; five theorems tick green; `lake build ✓`.*

> But who checks the checker?
>
> We do — with machine-checked proofs in Lean.
>
> The solver checks exactly the policy you wrote.
> Adding a rule can only ever *restrict* — never expand.
> No execution without authorization.
> No "proved" receipt without a verified proof.
> And every receipt is bound to the exact intent.
>
> These aren't tests. They're proofs. And they run on every single build.

---

### Scene 10 · 0:43 · 03 EXECUTE — Capability token
*Visual: capability token (bound to intentHash, 1 use, short-lived, Swaraj executor only) → CONSUMED; Uniswap V3 on Base confirmations 0→12/12 → FINAL.*

> **Step three: Execute.**
>
> Only an allowed action gets a permit — a capability token.
>
> Bound to that exact intent. One use. Short-lived. Held only by the Swaraj executor.
>
> The trade executes on Uniswap, on Base — and the token is consumed. It can never be replayed.
>
> Then Swaraj waits for finality — all twelve confirmations — before collecting the on-chain evidence.

---

### Scene 11 · 0:48 · 04 PROVE — SP1 zkVM → zkVerify → Receipt
*Visual: Evidence → SP1 zkVM (re-runs the check) → zkVerify → Receipt PENDING → PROVED ✓.*

> **Step four: Prove.**
>
> The transaction receipt and logs go into the SP1 zkVM, which re-runs the entire check on real chain evidence.
>
> The result is a zero-knowledge proof — verified on zkVerify.
>
> Intent. Policy. Evidence. Verifier. All four, checked.
>
> Anyone can verify it — without trusting the agent, and without trusting us.
>
> And even the blocked trade? It gets a signed decision receipt too. Every "no" is on the record.

---

## ACT 3 — THE CLOSE

### Scene 12 · 0:53 · Swaraj — "Verifiable layer for AI agents" · Drongo Labs
*Visual: shield → wordmark → tagline → fade out.*

> AI agents are going to hold money, sign transactions, and act on our behalf.
>
> The question isn't whether we trust them.
>
> It's whether we can *prove* what they did.
>
> **Swaraj.** The verifiable layer for AI agents.
>
> *(beat)* From Drongo Labs.

**[HOLD]** the end card 3–4s longer than the current cut so the last line lands.

---

## Production notes

- **Wipes / whooshes:** orange light-sweep transitions at ~0:06, 0:17, 0:25, 0:33, 0:43, 0:52 — start each new scene's line just after the sweep.
- **Where to stretch the cut:** Scenes 5, 8, 9, 11 carry the most VO. Freeze or slow the final frame of each (BLOCK/ALLOW cards, all-green theorems, PROVED receipt) rather than speeding the read.
- **Emphasis words:** *proves* (vs guesses), *Not tested — proved*, *consumed*, *without trusting us*, *prove what they did*.
- **Music:** low, tense pulse through Act 1 → drop to near-silence on "A prompt is not a guardrail" → lift when the logo appears → steady build through the four steps → resolve on the end card.
- **Pronunciation:** Swaraj = "swuh-RAAJ"; Z3 = "zee-three"; SP1 = "ess-pee-one"; Keccak = "KETCH-ak".
- **Short version (if you ever need ~60s):** keep only the first and last line of each scene.
