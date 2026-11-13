/-!
# Zunno engine model — kernel-checked invariants of the game

This file models the two-player UNO engine (`src/game/engine.ts`,
UNO card codec, 1..108) and proves its structural
invariants:

- a play requires the card to be in the mover's hand and legal;
- the played card lands on the discard pile and leaves the hand;
- penalty cards move from the draw pile to the opponent's hand
  (`take ++ drop` is exact — cards are conserved);
- the winner is set exactly when the mover empties their hand;
- a draw adds exactly one card and passes the turn.

`Zunno/Vectors.lean` (generated) kernel-checks that this model agrees
with the TypeScript engine on shared vectors.
-/
namespace Zunno

/-- Values 101..104 are Wild, 105..108 Wild Draw Four. -/
def isWild (v : Nat) : Bool := 101 ≤ v

def cardColor (v : Nat) : Nat := if v ≤ 100 then (v - 1) / 25 else 4

inductive Kind : Type where
  | number (n : Nat)
  | skip
  | reverse
  | drawTwo
  | wild
  | wildDrawFour
  deriving DecidableEq, Repr

def cardKind (v : Nat) : Kind :=
  if 101 ≤ v then
    if v ≤ 104 then Kind.wild else Kind.wildDrawFour
  else
    let w := (v - 1) % 25
    if w = 0 then Kind.number 0
    else if w ≤ 18 then Kind.number ((w + 1) / 2)
    else if w ≤ 20 then Kind.skip
    else if w ≤ 22 then Kind.reverse
    else Kind.drawTwo

/-- Non-number kinds match by equality; numbers match by value (cards.ts isPlayable). -/
def kindsMatch (p t : Kind) : Bool :=
  match p, t with
  | Kind.number a, Kind.number b => a == b
  | Kind.number _, _ => false
  | Kind.skip, Kind.skip => true
  | Kind.reverse, Kind.reverse => true
  | Kind.drawTwo, Kind.drawTwo => true
  | _, _ => false

def isPlayable (played top activeColor : Nat) : Bool :=
  isWild played || cardColor played == activeColor || kindsMatch (cardKind played) (cardKind top)

structure GameState : Type where
  human : List Nat
  agent : List Nat
  drawPile : List Nat
  discard : List Nat
  activeColor : Nat
  humanTurn : Bool
  /-- `none` = running, `some true` = human won, `some false` = agent won. -/
  winner : Option Bool
  deriving DecidableEq, Repr

def handOf (s : GameState) (human : Bool) : List Nat :=
  if human then s.human else s.agent

def setHand (s : GameState) (human : Bool) (l : List Nat) : GameState :=
  if human then { s with human := l } else { s with agent := l }

/-- Top of the pile. The model keeps the top at the head; the vectors carry
the TypeScript discard list reversed so both read the same top. -/
def topOf (s : GameState) : Nat :=
  match s.discard with
  | [] => 0
  | t :: _ => t

def penaltyOf (k : Kind) : Nat :=
  match k with
  | Kind.drawTwo => 2
  | Kind.wildDrawFour => 4
  | _ => 0

/-- skip / reverse / +2 / wild+4 keep the turn with the mover (heads-up rules). -/
def keepsTurn (k : Kind) : Bool :=
  match k with
  | Kind.number _ => false
  | Kind.wild => false
  | _ => true

def applyPlay (s : GameState) (human : Bool) (c : Nat) (chosenColor : Nat) : GameState :=
  let h := handOf s human
  let h' := h.erase c
  let opp := !human
  let k := cardKind c
  let p := penaltyOf k
  let oppHand := s.drawPile.take p ++ handOf s opp
  let drawPile := s.drawPile.drop p
  let s1 := setHand
    (setHand { s with
        discard := c :: s.discard,
        drawPile := drawPile,
        activeColor := if isWild c then chosenColor else cardColor c }
      human h')
    opp oppHand
  { s1 with
    humanTurn := if h' = [] then s.humanTurn else if keepsTurn k then s.humanTurn else !human,
    winner := if h' = [] then some human else none }

def playCard (s : GameState) (human : Bool) (c : Nat) (chosenColor : Nat) : Option GameState :=
  if s.winner.isSome then none
  else if if human then s.humanTurn else !s.humanTurn then
    if c ∈ handOf s human then
      if isPlayable c (topOf s) s.activeColor then
        some (applyPlay s human c chosenColor)
      else none
    else none
  else none

def drawCard (s : GameState) (human : Bool) : Option GameState :=
  if s.winner.isSome then none
  else if if human then s.humanTurn else !s.humanTurn then
    match s.drawPile with
    | [] => none
    | d :: rest => some { (setHand s human (d :: handOf s human)) with drawPile := rest, humanTurn := !human }
  else none

/-- Compact projection used by the shared vectors: winner code (0/1/2), human's turn, top card. -/
def winnerCode (w : Option Bool) : Nat :=
  match w with
  | none => 0
  | some true => 1
  | some false => 2

def summarize (s : GameState) : Nat × Bool × Nat :=
  (winnerCode s.winner, s.humanTurn, topOf s)

/-- All mover options from a state, in hand order then draw — the exhaustive
refinement evaluation helper (chosenColor 4 = keep active color). -/
def playOutcomes (s : GameState) (human : Bool) : List (Option (Nat × Bool × Nat)) :=
  (handOf s human).map (fun c => (playCard s human c 4).map summarize)
  ++ [(drawCard s human).map summarize]

/-!
## Invariants
-/

/-- A card not in the mover's hand can never be played. -/
theorem play_none_if_not_in_hand {s : GameState} {human : Bool} {c chosenColor : Nat}
    (h : ¬ c ∈ handOf s human) : playCard s human c chosenColor = none := by
  simp [playCard, h]

/-- An illegal card can never be played. -/
theorem play_none_if_illegal {s : GameState} {human : Bool} {c chosenColor : Nat}
    (hin : c ∈ handOf s human) (h : ¬ isPlayable c (topOf s) s.activeColor) :
    playCard s human c chosenColor = none := by
  simp [playCard, hin, h]

/-- The played card leaves the mover's hand and lands on top of the discard. -/
theorem play_card_on_discard (s : GameState) (human : Bool) (c : Nat) (chosenColor : Nat) :
    (applyPlay s human c chosenColor).discard = c :: s.discard
    ∧ handOf (applyPlay s human c chosenColor) human = (handOf s human).erase c := by
  constructor <;> cases human <;> rfl

/-- Cards are conserved: penalty cards move exactly from the draw pile to the
opponent's hand — `take ++ drop` is the identity on the pile. -/
theorem play_penalty_split (s : GameState) (human : Bool) (c : Nat) (chosenColor : Nat) :
    handOf (applyPlay s human c chosenColor) (!human)
      = s.drawPile.take (penaltyOf (cardKind c)) ++ handOf s (!human)
    ∧ (applyPlay s human c chosenColor).drawPile = s.drawPile.drop (penaltyOf (cardKind c)) := by
  constructor <;> cases human <;> rfl

/-- Erasing a held card from a non-empty hand leaves exactly the singleton. -/
theorem mem_erase_nil_singleton {l : List Nat} {c : Nat} (hmem : c ∈ l) (h : l.erase c = []) :
    l = [c] := by
  cases l with
  | nil => exact absurd hmem (by simp)
  | cons x xs =>
    rw [List.erase_cons] at h
    by_cases hxc : x = c
    · rw [if_pos (by simp [hxc] : (x == c) = true)] at h
      rw [h, hxc]
    · rw [if_neg (by simp [hxc] : ¬ (x == c) = true)] at h
      exact absurd h (by simp)

/-- A hand whose erasure stays non-empty was neither empty nor a singleton. -/
theorem erase_ne_nil_of_mem {l : List Nat} {c : Nat} (hmem : c ∈ l) (h : ¬ l.erase c = []) :
    l ≠ [] ∧ l ≠ [c] := by
  refine ⟨?_, ?_⟩
  · intro he; exact absurd hmem (by simp [he])
  · intro he; subst he; exact h (by simp [List.erase_cons])

/-- The mover wins exactly by emptying their hand — both directions. -/
theorem play_wins_on_last_card (s : GameState) (human : Bool) (c : Nat) (chosenColor : Nat)
    (hmem : c ∈ handOf s human) (h : (handOf s human).erase c = []) :
    (applyPlay s human c chosenColor).winner = some human := by
  cases human with
  | true =>
    have h1 : s.human = [c] := mem_erase_nil_singleton hmem h
    simp [applyPlay, setHand, handOf, h1, List.erase_cons]
  | false =>
    have h1 : s.agent = [c] := mem_erase_nil_singleton hmem h
    simp [applyPlay, setHand, handOf, h1, List.erase_cons]

theorem play_no_win_otherwise (s : GameState) (human : Bool) (c : Nat) (chosenColor : Nat)
    (hmem : c ∈ handOf s human) (h : ¬ (handOf s human).erase c = []) :
    (applyPlay s human c chosenColor).winner = none := by
  cases human with
  | true =>
    have hf := erase_ne_nil_of_mem hmem h
    have h1 : s.human ≠ [] := hf.1
    have h2 : s.human ≠ [c] := hf.2
    simp [applyPlay, setHand, handOf, h1, h2, List.erase_cons]
  | false =>
    have hf := erase_ne_nil_of_mem hmem h
    have h1 : s.agent ≠ [] := hf.1
    have h2 : s.agent ≠ [c] := hf.2
    simp [applyPlay, setHand, handOf, h1, h2, List.erase_cons]

/-- A draw adds exactly one card to the mover's hand, removes exactly one from
the pile, and passes the turn. -/
theorem draw_shape_human (s : GameState) (d : Nat) (rest : List Nat)
    (hpile : s.drawPile = d :: rest) (hturn : s.humanTurn = true) (hw : s.winner.isSome = false) :
    drawCard s true = some
      { human := d :: s.human, agent := s.agent, drawPile := rest, discard := s.discard,
        activeColor := s.activeColor, humanTurn := false, winner := s.winner } := by
  simp [drawCard, setHand, handOf, hpile, hturn, hw]

theorem draw_shape_agent (s : GameState) (d : Nat) (rest : List Nat)
    (hpile : s.drawPile = d :: rest) (hturn : s.humanTurn = false) (hw : s.winner.isSome = false) :
    drawCard s false = some
      { human := s.human, agent := d :: s.agent, drawPile := rest, discard := s.discard,
        activeColor := s.activeColor, humanTurn := true, winner := s.winner } := by
  simp [drawCard, setHand, handOf, hpile, hturn, hw]

end Zunno
