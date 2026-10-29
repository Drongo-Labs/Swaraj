/-
Exhaustive engine refinement — GENERATED FILE, do not edit by hand.

Source: vectors/engine-vectors.json (exhaustive block, computed by the REAL
TypeScript engine). Regenerate: pnpm vectors && pnpm lean:sync

One kernel-checked example per bounded-domain state (2048 states,
5888 outcomes): every mover option — each
card in hand, then a draw — must produce exactly the outcome the TypeScript
engine produced. This is the machine-checked Lean <=> TS correspondence for
the game engine over the entire bounded space.
-/

import Zunno.Engine

namespace Zunno

def vec_x_0 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_0 true = [some (1, true, 2), some (0, false, 2)] := by rfl

def vec_x_1 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1 true = [some (1, true, 2), some (0, false, 2)] := by rfl

def vec_x_2 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_2 true = [some (1, true, 2), some (0, false, 11)] := by rfl

def vec_x_3 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_3 true = [none, some (0, false, 11)] := by rfl

def vec_x_4 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_4 true = [some (1, true, 2), some (0, false, 21)] := by rfl

def vec_x_5 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_5 true = [none, some (0, false, 21)] := by rfl

def vec_x_6 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_6 true = [some (1, true, 2), some (0, false, 24)] := by rfl

def vec_x_7 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_7 true = [none, some (0, false, 24)] := by rfl

def vec_x_8 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_8 true = [some (1, true, 2), some (0, false, 26)] := by rfl

def vec_x_9 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_9 true = [none, some (0, false, 26)] := by rfl

def vec_x_10 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_10 true = [some (1, true, 2), some (0, false, 36)] := by rfl

def vec_x_11 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_11 true = [none, some (0, false, 36)] := by rfl

def vec_x_12 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_12 true = [some (1, true, 2), some (0, false, 101)] := by rfl

def vec_x_13 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_13 true = [none, some (0, false, 101)] := by rfl

def vec_x_14 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_14 true = [some (1, true, 2), some (0, false, 105)] := by rfl

def vec_x_15 : Zunno.GameState :=
  { human := [2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_15 true = [none, some (0, false, 105)] := by rfl

def vec_x_16 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_16 true = [some (1, true, 11), some (0, false, 2)] := by rfl

def vec_x_17 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_17 true = [none, some (0, false, 2)] := by rfl

def vec_x_18 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_18 true = [some (1, true, 11), some (0, false, 11)] := by rfl

def vec_x_19 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_19 true = [some (1, true, 11), some (0, false, 11)] := by rfl

def vec_x_20 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_20 true = [some (1, true, 11), some (0, false, 21)] := by rfl

def vec_x_21 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_21 true = [none, some (0, false, 21)] := by rfl

def vec_x_22 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_22 true = [some (1, true, 11), some (0, false, 24)] := by rfl

def vec_x_23 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_23 true = [none, some (0, false, 24)] := by rfl

def vec_x_24 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_24 true = [some (1, true, 11), some (0, false, 26)] := by rfl

def vec_x_25 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_25 true = [none, some (0, false, 26)] := by rfl

def vec_x_26 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_26 true = [some (1, true, 11), some (0, false, 36)] := by rfl

def vec_x_27 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_27 true = [some (1, true, 11), some (0, false, 36)] := by rfl

def vec_x_28 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_28 true = [some (1, true, 11), some (0, false, 101)] := by rfl

def vec_x_29 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_29 true = [none, some (0, false, 101)] := by rfl

def vec_x_30 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_30 true = [some (1, true, 11), some (0, false, 105)] := by rfl

def vec_x_31 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_31 true = [none, some (0, false, 105)] := by rfl

def vec_x_32 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_32 true = [some (1, true, 21), some (0, false, 2)] := by rfl

def vec_x_33 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_33 true = [none, some (0, false, 2)] := by rfl

def vec_x_34 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_34 true = [some (1, true, 21), some (0, false, 11)] := by rfl

def vec_x_35 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_35 true = [none, some (0, false, 11)] := by rfl

def vec_x_36 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_36 true = [some (1, true, 21), some (0, false, 21)] := by rfl

def vec_x_37 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_37 true = [some (1, true, 21), some (0, false, 21)] := by rfl

def vec_x_38 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_38 true = [some (1, true, 21), some (0, false, 24)] := by rfl

def vec_x_39 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_39 true = [none, some (0, false, 24)] := by rfl

def vec_x_40 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_40 true = [some (1, true, 21), some (0, false, 26)] := by rfl

def vec_x_41 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_41 true = [none, some (0, false, 26)] := by rfl

def vec_x_42 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_42 true = [some (1, true, 21), some (0, false, 36)] := by rfl

def vec_x_43 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_43 true = [none, some (0, false, 36)] := by rfl

def vec_x_44 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_44 true = [some (1, true, 21), some (0, false, 101)] := by rfl

def vec_x_45 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_45 true = [none, some (0, false, 101)] := by rfl

def vec_x_46 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_46 true = [some (1, true, 21), some (0, false, 105)] := by rfl

def vec_x_47 : Zunno.GameState :=
  { human := [21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_47 true = [none, some (0, false, 105)] := by rfl

def vec_x_48 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_48 true = [some (1, true, 24), some (0, false, 2)] := by rfl

def vec_x_49 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_49 true = [none, some (0, false, 2)] := by rfl

def vec_x_50 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_50 true = [some (1, true, 24), some (0, false, 11)] := by rfl

def vec_x_51 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_51 true = [none, some (0, false, 11)] := by rfl

def vec_x_52 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_52 true = [some (1, true, 24), some (0, false, 21)] := by rfl

def vec_x_53 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_53 true = [none, some (0, false, 21)] := by rfl

def vec_x_54 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_54 true = [some (1, true, 24), some (0, false, 24)] := by rfl

def vec_x_55 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_55 true = [some (1, true, 24), some (0, false, 24)] := by rfl

def vec_x_56 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_56 true = [some (1, true, 24), some (0, false, 26)] := by rfl

def vec_x_57 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_57 true = [none, some (0, false, 26)] := by rfl

def vec_x_58 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_58 true = [some (1, true, 24), some (0, false, 36)] := by rfl

def vec_x_59 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_59 true = [none, some (0, false, 36)] := by rfl

def vec_x_60 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_60 true = [some (1, true, 24), some (0, false, 101)] := by rfl

def vec_x_61 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_61 true = [none, some (0, false, 101)] := by rfl

def vec_x_62 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_62 true = [some (1, true, 24), some (0, false, 105)] := by rfl

def vec_x_63 : Zunno.GameState :=
  { human := [24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_63 true = [none, some (0, false, 105)] := by rfl

def vec_x_64 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_64 true = [none, some (0, false, 2)] := by rfl

def vec_x_65 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_65 true = [some (1, true, 26), some (0, false, 2)] := by rfl

def vec_x_66 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_66 true = [none, some (0, false, 11)] := by rfl

def vec_x_67 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_67 true = [some (1, true, 26), some (0, false, 11)] := by rfl

def vec_x_68 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_68 true = [none, some (0, false, 21)] := by rfl

def vec_x_69 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_69 true = [some (1, true, 26), some (0, false, 21)] := by rfl

def vec_x_70 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_70 true = [none, some (0, false, 24)] := by rfl

def vec_x_71 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_71 true = [some (1, true, 26), some (0, false, 24)] := by rfl

def vec_x_72 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_72 true = [some (1, true, 26), some (0, false, 26)] := by rfl

def vec_x_73 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_73 true = [some (1, true, 26), some (0, false, 26)] := by rfl

def vec_x_74 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_74 true = [none, some (0, false, 36)] := by rfl

def vec_x_75 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_75 true = [some (1, true, 26), some (0, false, 36)] := by rfl

def vec_x_76 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_76 true = [none, some (0, false, 101)] := by rfl

def vec_x_77 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_77 true = [some (1, true, 26), some (0, false, 101)] := by rfl

def vec_x_78 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_78 true = [none, some (0, false, 105)] := by rfl

def vec_x_79 : Zunno.GameState :=
  { human := [26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_79 true = [some (1, true, 26), some (0, false, 105)] := by rfl

def vec_x_80 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_80 true = [none, some (0, false, 2)] := by rfl

def vec_x_81 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_81 true = [some (1, true, 36), some (0, false, 2)] := by rfl

def vec_x_82 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_82 true = [some (1, true, 36), some (0, false, 11)] := by rfl

def vec_x_83 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_83 true = [some (1, true, 36), some (0, false, 11)] := by rfl

def vec_x_84 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_84 true = [none, some (0, false, 21)] := by rfl

def vec_x_85 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_85 true = [some (1, true, 36), some (0, false, 21)] := by rfl

def vec_x_86 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_86 true = [none, some (0, false, 24)] := by rfl

def vec_x_87 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_87 true = [some (1, true, 36), some (0, false, 24)] := by rfl

def vec_x_88 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_88 true = [none, some (0, false, 26)] := by rfl

def vec_x_89 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_89 true = [some (1, true, 36), some (0, false, 26)] := by rfl

def vec_x_90 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_90 true = [some (1, true, 36), some (0, false, 36)] := by rfl

def vec_x_91 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_91 true = [some (1, true, 36), some (0, false, 36)] := by rfl

def vec_x_92 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_92 true = [none, some (0, false, 101)] := by rfl

def vec_x_93 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_93 true = [some (1, true, 36), some (0, false, 101)] := by rfl

def vec_x_94 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_94 true = [none, some (0, false, 105)] := by rfl

def vec_x_95 : Zunno.GameState :=
  { human := [36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_95 true = [some (1, true, 36), some (0, false, 105)] := by rfl

def vec_x_96 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_96 true = [some (1, true, 101), some (0, false, 2)] := by rfl

def vec_x_97 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_97 true = [some (1, true, 101), some (0, false, 2)] := by rfl

def vec_x_98 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_98 true = [some (1, true, 101), some (0, false, 11)] := by rfl

def vec_x_99 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_99 true = [some (1, true, 101), some (0, false, 11)] := by rfl

def vec_x_100 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_100 true = [some (1, true, 101), some (0, false, 21)] := by rfl

def vec_x_101 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_101 true = [some (1, true, 101), some (0, false, 21)] := by rfl

def vec_x_102 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_102 true = [some (1, true, 101), some (0, false, 24)] := by rfl

def vec_x_103 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_103 true = [some (1, true, 101), some (0, false, 24)] := by rfl

def vec_x_104 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_104 true = [some (1, true, 101), some (0, false, 26)] := by rfl

def vec_x_105 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_105 true = [some (1, true, 101), some (0, false, 26)] := by rfl

def vec_x_106 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_106 true = [some (1, true, 101), some (0, false, 36)] := by rfl

def vec_x_107 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_107 true = [some (1, true, 101), some (0, false, 36)] := by rfl

def vec_x_108 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_108 true = [some (1, true, 101), some (0, false, 101)] := by rfl

def vec_x_109 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_109 true = [some (1, true, 101), some (0, false, 101)] := by rfl

def vec_x_110 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_110 true = [some (1, true, 101), some (0, false, 105)] := by rfl

def vec_x_111 : Zunno.GameState :=
  { human := [101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_111 true = [some (1, true, 101), some (0, false, 105)] := by rfl

def vec_x_112 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_112 true = [some (1, true, 105), some (0, false, 2)] := by rfl

def vec_x_113 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_113 true = [some (1, true, 105), some (0, false, 2)] := by rfl

def vec_x_114 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_114 true = [some (1, true, 105), some (0, false, 11)] := by rfl

def vec_x_115 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_115 true = [some (1, true, 105), some (0, false, 11)] := by rfl

def vec_x_116 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_116 true = [some (1, true, 105), some (0, false, 21)] := by rfl

def vec_x_117 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_117 true = [some (1, true, 105), some (0, false, 21)] := by rfl

def vec_x_118 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_118 true = [some (1, true, 105), some (0, false, 24)] := by rfl

def vec_x_119 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_119 true = [some (1, true, 105), some (0, false, 24)] := by rfl

def vec_x_120 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_120 true = [some (1, true, 105), some (0, false, 26)] := by rfl

def vec_x_121 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_121 true = [some (1, true, 105), some (0, false, 26)] := by rfl

def vec_x_122 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_122 true = [some (1, true, 105), some (0, false, 36)] := by rfl

def vec_x_123 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_123 true = [some (1, true, 105), some (0, false, 36)] := by rfl

def vec_x_124 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_124 true = [some (1, true, 105), some (0, false, 101)] := by rfl

def vec_x_125 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_125 true = [some (1, true, 105), some (0, false, 101)] := by rfl

def vec_x_126 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_126 true = [some (1, true, 105), some (0, false, 105)] := by rfl

def vec_x_127 : Zunno.GameState :=
  { human := [105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_127 true = [some (1, true, 105), some (0, false, 105)] := by rfl

def vec_x_128 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_128 true = [some (0, false, 2), some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_129 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_129 true = [some (0, false, 2), none, some (0, false, 2)] := by rfl

def vec_x_130 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_130 true = [some (0, false, 2), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_131 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_131 true = [none, some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_132 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_132 true = [some (0, false, 2), some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_133 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_133 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_134 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_134 true = [some (0, false, 2), some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_135 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_135 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_136 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_136 true = [some (0, false, 2), some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_137 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_137 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_138 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_138 true = [some (0, false, 2), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_139 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_139 true = [none, some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_140 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_140 true = [some (0, false, 2), some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_141 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_141 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_142 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_142 true = [some (0, false, 2), some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_143 : Zunno.GameState :=
  { human := [2, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_143 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_144 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_144 true = [some (0, false, 2), some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_145 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_145 true = [some (0, false, 2), none, some (0, false, 2)] := by rfl

def vec_x_146 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_146 true = [some (0, false, 2), some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_147 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_147 true = [none, none, some (0, false, 11)] := by rfl

def vec_x_148 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_148 true = [some (0, false, 2), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_149 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_149 true = [none, some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_150 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_150 true = [some (0, false, 2), some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_151 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_151 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_152 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_152 true = [some (0, false, 2), some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_153 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_153 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_154 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_154 true = [some (0, false, 2), some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_155 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_155 true = [none, none, some (0, false, 36)] := by rfl

def vec_x_156 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_156 true = [some (0, false, 2), some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_157 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_157 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_158 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_158 true = [some (0, false, 2), some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_159 : Zunno.GameState :=
  { human := [2, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_159 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_160 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_160 true = [some (0, false, 2), some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_161 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_161 true = [some (0, false, 2), none, some (0, false, 2)] := by rfl

def vec_x_162 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_162 true = [some (0, false, 2), some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_163 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_163 true = [none, none, some (0, false, 11)] := by rfl

def vec_x_164 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_164 true = [some (0, false, 2), some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_165 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_165 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_166 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_166 true = [some (0, false, 2), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_167 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_167 true = [none, some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_168 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_168 true = [some (0, false, 2), some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_169 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_169 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_170 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_170 true = [some (0, false, 2), some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_171 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_171 true = [none, none, some (0, false, 36)] := by rfl

def vec_x_172 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_172 true = [some (0, false, 2), some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_173 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_173 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_174 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_174 true = [some (0, false, 2), some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_175 : Zunno.GameState :=
  { human := [2, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_175 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_176 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_176 true = [some (0, false, 2), none, some (0, false, 2)] := by rfl

def vec_x_177 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_177 true = [some (0, false, 2), some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_178 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_178 true = [some (0, false, 2), none, some (0, false, 11)] := by rfl

def vec_x_179 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_179 true = [none, some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_180 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_180 true = [some (0, false, 2), none, some (0, false, 21)] := by rfl

def vec_x_181 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_181 true = [none, some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_182 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_182 true = [some (0, false, 2), none, some (0, false, 24)] := by rfl

def vec_x_183 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_183 true = [none, some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_184 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_184 true = [some (0, false, 2), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_185 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_185 true = [none, some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_186 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_186 true = [some (0, false, 2), none, some (0, false, 36)] := by rfl

def vec_x_187 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_187 true = [none, some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_188 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_188 true = [some (0, false, 2), none, some (0, false, 101)] := by rfl

def vec_x_189 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_189 true = [none, some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_190 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_190 true = [some (0, false, 2), none, some (0, false, 105)] := by rfl

def vec_x_191 : Zunno.GameState :=
  { human := [2, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_191 true = [none, some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_192 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_192 true = [some (0, false, 2), none, some (0, false, 2)] := by rfl

def vec_x_193 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_193 true = [some (0, false, 2), some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_194 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_194 true = [some (0, false, 2), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_195 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_195 true = [none, some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_196 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_196 true = [some (0, false, 2), none, some (0, false, 21)] := by rfl

def vec_x_197 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_197 true = [none, some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_198 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_198 true = [some (0, false, 2), none, some (0, false, 24)] := by rfl

def vec_x_199 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_199 true = [none, some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_200 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_200 true = [some (0, false, 2), none, some (0, false, 26)] := by rfl

def vec_x_201 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_201 true = [none, some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_202 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_202 true = [some (0, false, 2), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_203 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_203 true = [none, some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_204 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_204 true = [some (0, false, 2), none, some (0, false, 101)] := by rfl

def vec_x_205 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_205 true = [none, some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_206 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_206 true = [some (0, false, 2), none, some (0, false, 105)] := by rfl

def vec_x_207 : Zunno.GameState :=
  { human := [2, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_207 true = [none, some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_208 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_208 true = [some (0, false, 2), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_209 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_209 true = [some (0, false, 2), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_210 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_210 true = [some (0, false, 2), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_211 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_211 true = [none, some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_212 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_212 true = [some (0, false, 2), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_213 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_213 true = [none, some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_214 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_214 true = [some (0, false, 2), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_215 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_215 true = [none, some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_216 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_216 true = [some (0, false, 2), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_217 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_217 true = [none, some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_218 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_218 true = [some (0, false, 2), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_219 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_219 true = [none, some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_220 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_220 true = [some (0, false, 2), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_221 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_221 true = [none, some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_222 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_222 true = [some (0, false, 2), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_223 : Zunno.GameState :=
  { human := [2, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_223 true = [none, some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_224 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_224 true = [some (0, false, 2), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_225 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_225 true = [some (0, false, 2), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_226 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_226 true = [some (0, false, 2), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_227 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_227 true = [none, some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_228 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_228 true = [some (0, false, 2), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_229 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_229 true = [none, some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_230 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_230 true = [some (0, false, 2), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_231 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_231 true = [none, some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_232 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_232 true = [some (0, false, 2), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_233 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_233 true = [none, some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_234 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_234 true = [some (0, false, 2), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_235 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_235 true = [none, some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_236 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_236 true = [some (0, false, 2), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_237 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_237 true = [none, some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_238 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_238 true = [some (0, false, 2), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_239 : Zunno.GameState :=
  { human := [2, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_239 true = [none, some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_240 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_240 true = [some (0, false, 11), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_241 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_241 true = [none, some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_242 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_242 true = [some (0, false, 11), some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_243 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_243 true = [some (0, false, 11), none, some (0, false, 11)] := by rfl

def vec_x_244 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_244 true = [some (0, false, 11), some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_245 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_245 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_246 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_246 true = [some (0, false, 11), some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_247 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_247 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_248 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_248 true = [some (0, false, 11), some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_249 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_249 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_250 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_250 true = [some (0, false, 11), some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_251 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_251 true = [some (0, false, 11), none, some (0, false, 36)] := by rfl

def vec_x_252 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_252 true = [some (0, false, 11), some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_253 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_253 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_254 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_254 true = [some (0, false, 11), some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_255 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_255 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_256 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_256 true = [some (0, false, 11), some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_257 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_257 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_258 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_258 true = [some (0, false, 11), some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_259 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_259 true = [some (0, false, 11), none, some (0, false, 11)] := by rfl

def vec_x_260 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_260 true = [some (0, false, 11), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_261 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_261 true = [none, some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_262 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_262 true = [some (0, false, 11), some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_263 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_263 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_264 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_264 true = [some (0, false, 11), some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_265 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_265 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_266 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_266 true = [some (0, false, 11), some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_267 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_267 true = [some (0, false, 11), none, some (0, false, 36)] := by rfl

def vec_x_268 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_268 true = [some (0, false, 11), some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_269 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_269 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_270 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_270 true = [some (0, false, 11), some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_271 : Zunno.GameState :=
  { human := [11, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_271 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_272 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_272 true = [some (0, false, 11), some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_273 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_273 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_274 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_274 true = [some (0, false, 11), some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_275 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_275 true = [some (0, false, 11), none, some (0, false, 11)] := by rfl

def vec_x_276 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_276 true = [some (0, false, 11), some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_277 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_277 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_278 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_278 true = [some (0, false, 11), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_279 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_279 true = [none, some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_280 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_280 true = [some (0, false, 11), some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_281 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_281 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_282 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_282 true = [some (0, false, 11), some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_283 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_283 true = [some (0, false, 11), none, some (0, false, 36)] := by rfl

def vec_x_284 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_284 true = [some (0, false, 11), some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_285 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_285 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_286 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_286 true = [some (0, false, 11), some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_287 : Zunno.GameState :=
  { human := [11, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_287 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_288 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_288 true = [some (0, false, 11), none, some (0, false, 2)] := by rfl

def vec_x_289 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_289 true = [none, some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_290 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_290 true = [some (0, false, 11), none, some (0, false, 11)] := by rfl

def vec_x_291 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_291 true = [some (0, false, 11), some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_292 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_292 true = [some (0, false, 11), none, some (0, false, 21)] := by rfl

def vec_x_293 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_293 true = [none, some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_294 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_294 true = [some (0, false, 11), none, some (0, false, 24)] := by rfl

def vec_x_295 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_295 true = [none, some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_296 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_296 true = [some (0, false, 11), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_297 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_297 true = [none, some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_298 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_298 true = [some (0, false, 11), none, some (0, false, 36)] := by rfl

def vec_x_299 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_299 true = [some (0, false, 11), some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_300 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_300 true = [some (0, false, 11), none, some (0, false, 101)] := by rfl

def vec_x_301 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_301 true = [none, some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_302 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_302 true = [some (0, false, 11), none, some (0, false, 105)] := by rfl

def vec_x_303 : Zunno.GameState :=
  { human := [11, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_303 true = [none, some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_304 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_304 true = [some (0, false, 11), none, some (0, false, 2)] := by rfl

def vec_x_305 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_305 true = [none, some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_306 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_306 true = [some (0, false, 11), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_307 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_307 true = [some (0, false, 11), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_308 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_308 true = [some (0, false, 11), none, some (0, false, 21)] := by rfl

def vec_x_309 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_309 true = [none, some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_310 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_310 true = [some (0, false, 11), none, some (0, false, 24)] := by rfl

def vec_x_311 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_311 true = [none, some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_312 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_312 true = [some (0, false, 11), none, some (0, false, 26)] := by rfl

def vec_x_313 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_313 true = [none, some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_314 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_314 true = [some (0, false, 11), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_315 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_315 true = [some (0, false, 11), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_316 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_316 true = [some (0, false, 11), none, some (0, false, 101)] := by rfl

def vec_x_317 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_317 true = [none, some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_318 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_318 true = [some (0, false, 11), none, some (0, false, 105)] := by rfl

def vec_x_319 : Zunno.GameState :=
  { human := [11, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_319 true = [none, some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_320 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_320 true = [some (0, false, 11), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_321 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_321 true = [none, some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_322 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_322 true = [some (0, false, 11), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_323 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_323 true = [some (0, false, 11), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_324 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_324 true = [some (0, false, 11), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_325 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_325 true = [none, some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_326 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_326 true = [some (0, false, 11), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_327 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_327 true = [none, some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_328 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_328 true = [some (0, false, 11), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_329 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_329 true = [none, some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_330 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_330 true = [some (0, false, 11), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_331 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_331 true = [some (0, false, 11), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_332 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_332 true = [some (0, false, 11), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_333 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_333 true = [none, some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_334 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_334 true = [some (0, false, 11), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_335 : Zunno.GameState :=
  { human := [11, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_335 true = [none, some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_336 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_336 true = [some (0, false, 11), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_337 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_337 true = [none, some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_338 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_338 true = [some (0, false, 11), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_339 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_339 true = [some (0, false, 11), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_340 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_340 true = [some (0, false, 11), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_341 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_341 true = [none, some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_342 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_342 true = [some (0, false, 11), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_343 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_343 true = [none, some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_344 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_344 true = [some (0, false, 11), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_345 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_345 true = [none, some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_346 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_346 true = [some (0, false, 11), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_347 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_347 true = [some (0, false, 11), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_348 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_348 true = [some (0, false, 11), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_349 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_349 true = [none, some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_350 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_350 true = [some (0, false, 11), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_351 : Zunno.GameState :=
  { human := [11, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_351 true = [none, some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_352 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_352 true = [some (0, true, 21), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_353 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_353 true = [none, some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_354 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_354 true = [some (0, true, 21), some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_355 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_355 true = [none, none, some (0, false, 11)] := by rfl

def vec_x_356 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_356 true = [some (0, true, 21), some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_357 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_357 true = [some (0, true, 21), none, some (0, false, 21)] := by rfl

def vec_x_358 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_358 true = [some (0, true, 21), some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_359 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_359 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_360 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_360 true = [some (0, true, 21), some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_361 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_361 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_362 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_362 true = [some (0, true, 21), some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_363 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_363 true = [none, none, some (0, false, 36)] := by rfl

def vec_x_364 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_364 true = [some (0, true, 21), some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_365 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_365 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_366 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_366 true = [some (0, true, 21), some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_367 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_367 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_368 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_368 true = [some (0, true, 21), some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_369 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_369 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_370 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_370 true = [some (0, true, 21), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_371 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_371 true = [none, some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_372 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_372 true = [some (0, true, 21), some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_373 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_373 true = [some (0, true, 21), none, some (0, false, 21)] := by rfl

def vec_x_374 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_374 true = [some (0, true, 21), some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_375 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_375 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_376 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_376 true = [some (0, true, 21), some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_377 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_377 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_378 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_378 true = [some (0, true, 21), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_379 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_379 true = [none, some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_380 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_380 true = [some (0, true, 21), some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_381 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_381 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_382 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_382 true = [some (0, true, 21), some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_383 : Zunno.GameState :=
  { human := [21, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_383 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_384 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_384 true = [some (0, true, 21), some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_385 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_385 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_386 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_386 true = [some (0, true, 21), some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_387 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_387 true = [none, none, some (0, false, 11)] := by rfl

def vec_x_388 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_388 true = [some (0, true, 21), some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_389 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_389 true = [some (0, true, 21), none, some (0, false, 21)] := by rfl

def vec_x_390 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_390 true = [some (0, true, 21), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_391 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_391 true = [none, some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_392 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_392 true = [some (0, true, 21), some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_393 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_393 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_394 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_394 true = [some (0, true, 21), some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_395 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_395 true = [none, none, some (0, false, 36)] := by rfl

def vec_x_396 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_396 true = [some (0, true, 21), some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_397 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_397 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_398 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_398 true = [some (0, true, 21), some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_399 : Zunno.GameState :=
  { human := [21, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_399 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_400 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_400 true = [some (0, true, 21), none, some (0, false, 2)] := by rfl

def vec_x_401 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_401 true = [none, some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_402 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_402 true = [some (0, true, 21), none, some (0, false, 11)] := by rfl

def vec_x_403 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_403 true = [none, some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_404 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_404 true = [some (0, true, 21), none, some (0, false, 21)] := by rfl

def vec_x_405 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_405 true = [some (0, true, 21), some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_406 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_406 true = [some (0, true, 21), none, some (0, false, 24)] := by rfl

def vec_x_407 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_407 true = [none, some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_408 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_408 true = [some (0, true, 21), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_409 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_409 true = [none, some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_410 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_410 true = [some (0, true, 21), none, some (0, false, 36)] := by rfl

def vec_x_411 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_411 true = [none, some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_412 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_412 true = [some (0, true, 21), none, some (0, false, 101)] := by rfl

def vec_x_413 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_413 true = [none, some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_414 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_414 true = [some (0, true, 21), none, some (0, false, 105)] := by rfl

def vec_x_415 : Zunno.GameState :=
  { human := [21, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_415 true = [none, some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_416 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_416 true = [some (0, true, 21), none, some (0, false, 2)] := by rfl

def vec_x_417 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_417 true = [none, some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_418 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_418 true = [some (0, true, 21), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_419 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_419 true = [none, some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_420 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_420 true = [some (0, true, 21), none, some (0, false, 21)] := by rfl

def vec_x_421 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_421 true = [some (0, true, 21), some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_422 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_422 true = [some (0, true, 21), none, some (0, false, 24)] := by rfl

def vec_x_423 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_423 true = [none, some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_424 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_424 true = [some (0, true, 21), none, some (0, false, 26)] := by rfl

def vec_x_425 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_425 true = [none, some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_426 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_426 true = [some (0, true, 21), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_427 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_427 true = [none, some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_428 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_428 true = [some (0, true, 21), none, some (0, false, 101)] := by rfl

def vec_x_429 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_429 true = [none, some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_430 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_430 true = [some (0, true, 21), none, some (0, false, 105)] := by rfl

def vec_x_431 : Zunno.GameState :=
  { human := [21, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_431 true = [none, some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_432 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_432 true = [some (0, true, 21), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_433 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_433 true = [none, some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_434 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_434 true = [some (0, true, 21), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_435 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_435 true = [none, some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_436 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_436 true = [some (0, true, 21), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_437 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_437 true = [some (0, true, 21), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_438 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_438 true = [some (0, true, 21), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_439 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_439 true = [none, some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_440 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_440 true = [some (0, true, 21), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_441 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_441 true = [none, some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_442 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_442 true = [some (0, true, 21), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_443 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_443 true = [none, some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_444 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_444 true = [some (0, true, 21), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_445 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_445 true = [none, some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_446 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_446 true = [some (0, true, 21), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_447 : Zunno.GameState :=
  { human := [21, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_447 true = [none, some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_448 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_448 true = [some (0, true, 21), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_449 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_449 true = [none, some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_450 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_450 true = [some (0, true, 21), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_451 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_451 true = [none, some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_452 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_452 true = [some (0, true, 21), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_453 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_453 true = [some (0, true, 21), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_454 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_454 true = [some (0, true, 21), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_455 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_455 true = [none, some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_456 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_456 true = [some (0, true, 21), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_457 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_457 true = [none, some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_458 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_458 true = [some (0, true, 21), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_459 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_459 true = [none, some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_460 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_460 true = [some (0, true, 21), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_461 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_461 true = [none, some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_462 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_462 true = [some (0, true, 21), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_463 : Zunno.GameState :=
  { human := [21, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_463 true = [none, some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_464 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_464 true = [some (0, true, 24), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_465 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_465 true = [none, some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_466 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_466 true = [some (0, true, 24), some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_467 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_467 true = [none, none, some (0, false, 11)] := by rfl

def vec_x_468 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_468 true = [some (0, true, 24), some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_469 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_469 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_470 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_470 true = [some (0, true, 24), some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_471 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_471 true = [some (0, true, 24), none, some (0, false, 24)] := by rfl

def vec_x_472 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_472 true = [some (0, true, 24), some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_473 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_473 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_474 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_474 true = [some (0, true, 24), some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_475 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_475 true = [none, none, some (0, false, 36)] := by rfl

def vec_x_476 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_476 true = [some (0, true, 24), some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_477 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_477 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_478 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_478 true = [some (0, true, 24), some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_479 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_479 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_480 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_480 true = [some (0, true, 24), some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_481 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_481 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_482 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_482 true = [some (0, true, 24), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_483 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_483 true = [none, some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_484 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_484 true = [some (0, true, 24), some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_485 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_485 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_486 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_486 true = [some (0, true, 24), some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_487 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_487 true = [some (0, true, 24), none, some (0, false, 24)] := by rfl

def vec_x_488 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_488 true = [some (0, true, 24), some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_489 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_489 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_490 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_490 true = [some (0, true, 24), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_491 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_491 true = [none, some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_492 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_492 true = [some (0, true, 24), some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_493 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_493 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_494 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_494 true = [some (0, true, 24), some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_495 : Zunno.GameState :=
  { human := [24, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_495 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_496 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_496 true = [some (0, true, 24), some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_497 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_497 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_498 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_498 true = [some (0, true, 24), some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_499 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_499 true = [none, none, some (0, false, 11)] := by rfl

def vec_x_500 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_500 true = [some (0, true, 24), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_501 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_501 true = [none, some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_502 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_502 true = [some (0, true, 24), some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_503 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_503 true = [some (0, true, 24), none, some (0, false, 24)] := by rfl

def vec_x_504 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_504 true = [some (0, true, 24), some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_505 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_505 true = [none, none, some (0, false, 26)] := by rfl

def vec_x_506 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_506 true = [some (0, true, 24), some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_507 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_507 true = [none, none, some (0, false, 36)] := by rfl

def vec_x_508 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_508 true = [some (0, true, 24), some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_509 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_509 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_510 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_510 true = [some (0, true, 24), some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_511 : Zunno.GameState :=
  { human := [24, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_511 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_512 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_512 true = [some (0, true, 24), none, some (0, false, 2)] := by rfl

def vec_x_513 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_513 true = [none, some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_514 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_514 true = [some (0, true, 24), none, some (0, false, 11)] := by rfl

def vec_x_515 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_515 true = [none, some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_516 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_516 true = [some (0, true, 24), none, some (0, false, 21)] := by rfl

def vec_x_517 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_517 true = [none, some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_518 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_518 true = [some (0, true, 24), none, some (0, false, 24)] := by rfl

def vec_x_519 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_519 true = [some (0, true, 24), some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_520 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_520 true = [some (0, true, 24), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_521 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_521 true = [none, some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_522 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_522 true = [some (0, true, 24), none, some (0, false, 36)] := by rfl

def vec_x_523 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_523 true = [none, some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_524 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_524 true = [some (0, true, 24), none, some (0, false, 101)] := by rfl

def vec_x_525 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_525 true = [none, some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_526 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_526 true = [some (0, true, 24), none, some (0, false, 105)] := by rfl

def vec_x_527 : Zunno.GameState :=
  { human := [24, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_527 true = [none, some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_528 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_528 true = [some (0, true, 24), none, some (0, false, 2)] := by rfl

def vec_x_529 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_529 true = [none, some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_530 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_530 true = [some (0, true, 24), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_531 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_531 true = [none, some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_532 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_532 true = [some (0, true, 24), none, some (0, false, 21)] := by rfl

def vec_x_533 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_533 true = [none, some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_534 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_534 true = [some (0, true, 24), none, some (0, false, 24)] := by rfl

def vec_x_535 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_535 true = [some (0, true, 24), some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_536 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_536 true = [some (0, true, 24), none, some (0, false, 26)] := by rfl

def vec_x_537 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_537 true = [none, some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_538 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_538 true = [some (0, true, 24), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_539 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_539 true = [none, some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_540 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_540 true = [some (0, true, 24), none, some (0, false, 101)] := by rfl

def vec_x_541 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_541 true = [none, some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_542 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_542 true = [some (0, true, 24), none, some (0, false, 105)] := by rfl

def vec_x_543 : Zunno.GameState :=
  { human := [24, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_543 true = [none, some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_544 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_544 true = [some (0, true, 24), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_545 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_545 true = [none, some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_546 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_546 true = [some (0, true, 24), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_547 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_547 true = [none, some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_548 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_548 true = [some (0, true, 24), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_549 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_549 true = [none, some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_550 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_550 true = [some (0, true, 24), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_551 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_551 true = [some (0, true, 24), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_552 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_552 true = [some (0, true, 24), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_553 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_553 true = [none, some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_554 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_554 true = [some (0, true, 24), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_555 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_555 true = [none, some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_556 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_556 true = [some (0, true, 24), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_557 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_557 true = [none, some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_558 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_558 true = [some (0, true, 24), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_559 : Zunno.GameState :=
  { human := [24, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_559 true = [none, some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_560 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_560 true = [some (0, true, 24), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_561 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_561 true = [none, some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_562 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_562 true = [some (0, true, 24), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_563 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_563 true = [none, some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_564 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_564 true = [some (0, true, 24), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_565 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_565 true = [none, some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_566 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_566 true = [some (0, true, 24), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_567 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_567 true = [some (0, true, 24), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_568 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_568 true = [some (0, true, 24), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_569 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_569 true = [none, some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_570 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_570 true = [some (0, true, 24), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_571 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_571 true = [none, some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_572 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_572 true = [some (0, true, 24), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_573 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_573 true = [none, some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_574 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_574 true = [some (0, true, 24), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_575 : Zunno.GameState :=
  { human := [24, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_575 true = [none, some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_576 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_576 true = [none, some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_577 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_577 true = [some (0, false, 26), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_578 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_578 true = [none, some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_579 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_579 true = [some (0, false, 26), none, some (0, false, 11)] := by rfl

def vec_x_580 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_580 true = [none, some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_581 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_581 true = [some (0, false, 26), none, some (0, false, 21)] := by rfl

def vec_x_582 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_582 true = [none, some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_583 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_583 true = [some (0, false, 26), none, some (0, false, 24)] := by rfl

def vec_x_584 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_584 true = [some (0, false, 26), some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_585 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_585 true = [some (0, false, 26), none, some (0, false, 26)] := by rfl

def vec_x_586 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_586 true = [none, some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_587 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_587 true = [some (0, false, 26), none, some (0, false, 36)] := by rfl

def vec_x_588 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_588 true = [none, some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_589 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_589 true = [some (0, false, 26), none, some (0, false, 101)] := by rfl

def vec_x_590 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_590 true = [none, some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_591 : Zunno.GameState :=
  { human := [26, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_591 true = [some (0, false, 26), none, some (0, false, 105)] := by rfl

def vec_x_592 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_592 true = [none, some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_593 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_593 true = [some (0, false, 26), none, some (0, false, 2)] := by rfl

def vec_x_594 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_594 true = [none, some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_595 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_595 true = [some (0, false, 26), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_596 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_596 true = [none, some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_597 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_597 true = [some (0, false, 26), none, some (0, false, 21)] := by rfl

def vec_x_598 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_598 true = [none, some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_599 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_599 true = [some (0, false, 26), none, some (0, false, 24)] := by rfl

def vec_x_600 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_600 true = [some (0, false, 26), some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_601 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_601 true = [some (0, false, 26), none, some (0, false, 26)] := by rfl

def vec_x_602 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_602 true = [none, some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_603 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_603 true = [some (0, false, 26), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_604 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_604 true = [none, some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_605 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_605 true = [some (0, false, 26), none, some (0, false, 101)] := by rfl

def vec_x_606 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_606 true = [none, some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_607 : Zunno.GameState :=
  { human := [26, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_607 true = [some (0, false, 26), none, some (0, false, 105)] := by rfl

def vec_x_608 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_608 true = [none, some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_609 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_609 true = [some (0, false, 26), none, some (0, false, 2)] := by rfl

def vec_x_610 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_610 true = [none, some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_611 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_611 true = [some (0, false, 26), none, some (0, false, 11)] := by rfl

def vec_x_612 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_612 true = [none, some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_613 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_613 true = [some (0, false, 26), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_614 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_614 true = [none, some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_615 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_615 true = [some (0, false, 26), none, some (0, false, 24)] := by rfl

def vec_x_616 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_616 true = [some (0, false, 26), some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_617 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_617 true = [some (0, false, 26), none, some (0, false, 26)] := by rfl

def vec_x_618 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_618 true = [none, some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_619 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_619 true = [some (0, false, 26), none, some (0, false, 36)] := by rfl

def vec_x_620 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_620 true = [none, some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_621 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_621 true = [some (0, false, 26), none, some (0, false, 101)] := by rfl

def vec_x_622 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_622 true = [none, some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_623 : Zunno.GameState :=
  { human := [26, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_623 true = [some (0, false, 26), none, some (0, false, 105)] := by rfl

def vec_x_624 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_624 true = [none, some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_625 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_625 true = [some (0, false, 26), none, some (0, false, 2)] := by rfl

def vec_x_626 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_626 true = [none, some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_627 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_627 true = [some (0, false, 26), none, some (0, false, 11)] := by rfl

def vec_x_628 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_628 true = [none, some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_629 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_629 true = [some (0, false, 26), none, some (0, false, 21)] := by rfl

def vec_x_630 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_630 true = [none, some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_631 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_631 true = [some (0, false, 26), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_632 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_632 true = [some (0, false, 26), some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_633 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_633 true = [some (0, false, 26), none, some (0, false, 26)] := by rfl

def vec_x_634 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_634 true = [none, some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_635 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_635 true = [some (0, false, 26), none, some (0, false, 36)] := by rfl

def vec_x_636 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_636 true = [none, some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_637 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_637 true = [some (0, false, 26), none, some (0, false, 101)] := by rfl

def vec_x_638 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_638 true = [none, some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_639 : Zunno.GameState :=
  { human := [26, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_639 true = [some (0, false, 26), none, some (0, false, 105)] := by rfl

def vec_x_640 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_640 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_641 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_641 true = [some (0, false, 26), some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_642 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_642 true = [none, some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_643 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_643 true = [some (0, false, 26), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_644 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_644 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_645 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_645 true = [some (0, false, 26), some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_646 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_646 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_647 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_647 true = [some (0, false, 26), some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_648 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_648 true = [some (0, false, 26), none, some (0, false, 26)] := by rfl

def vec_x_649 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_649 true = [some (0, false, 26), some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_650 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_650 true = [none, some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_651 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_651 true = [some (0, false, 26), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_652 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_652 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_653 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_653 true = [some (0, false, 26), some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_654 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_654 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_655 : Zunno.GameState :=
  { human := [26, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_655 true = [some (0, false, 26), some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_656 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_656 true = [none, some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_657 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_657 true = [some (0, false, 26), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_658 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_658 true = [none, some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_659 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_659 true = [some (0, false, 26), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_660 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_660 true = [none, some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_661 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_661 true = [some (0, false, 26), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_662 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_662 true = [none, some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_663 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_663 true = [some (0, false, 26), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_664 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_664 true = [some (0, false, 26), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_665 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_665 true = [some (0, false, 26), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_666 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_666 true = [none, some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_667 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_667 true = [some (0, false, 26), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_668 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_668 true = [none, some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_669 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_669 true = [some (0, false, 26), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_670 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_670 true = [none, some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_671 : Zunno.GameState :=
  { human := [26, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_671 true = [some (0, false, 26), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_672 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_672 true = [none, some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_673 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_673 true = [some (0, false, 26), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_674 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_674 true = [none, some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_675 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_675 true = [some (0, false, 26), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_676 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_676 true = [none, some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_677 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_677 true = [some (0, false, 26), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_678 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_678 true = [none, some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_679 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_679 true = [some (0, false, 26), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_680 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_680 true = [some (0, false, 26), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_681 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_681 true = [some (0, false, 26), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_682 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_682 true = [none, some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_683 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_683 true = [some (0, false, 26), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_684 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_684 true = [none, some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_685 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_685 true = [some (0, false, 26), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_686 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_686 true = [none, some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_687 : Zunno.GameState :=
  { human := [26, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_687 true = [some (0, false, 26), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_688 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_688 true = [none, some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_689 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_689 true = [some (0, false, 36), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_690 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_690 true = [some (0, false, 36), some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_691 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_691 true = [some (0, false, 36), none, some (0, false, 11)] := by rfl

def vec_x_692 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_692 true = [none, some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_693 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_693 true = [some (0, false, 36), none, some (0, false, 21)] := by rfl

def vec_x_694 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_694 true = [none, some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_695 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_695 true = [some (0, false, 36), none, some (0, false, 24)] := by rfl

def vec_x_696 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_696 true = [none, some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_697 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_697 true = [some (0, false, 36), none, some (0, false, 26)] := by rfl

def vec_x_698 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_698 true = [some (0, false, 36), some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_699 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_699 true = [some (0, false, 36), none, some (0, false, 36)] := by rfl

def vec_x_700 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_700 true = [none, some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_701 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_701 true = [some (0, false, 36), none, some (0, false, 101)] := by rfl

def vec_x_702 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_702 true = [none, some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_703 : Zunno.GameState :=
  { human := [36, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_703 true = [some (0, false, 36), none, some (0, false, 105)] := by rfl

def vec_x_704 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_704 true = [none, some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_705 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_705 true = [some (0, false, 36), none, some (0, false, 2)] := by rfl

def vec_x_706 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_706 true = [some (0, false, 36), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_707 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_707 true = [some (0, false, 36), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_708 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_708 true = [none, some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_709 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_709 true = [some (0, false, 36), none, some (0, false, 21)] := by rfl

def vec_x_710 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_710 true = [none, some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_711 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_711 true = [some (0, false, 36), none, some (0, false, 24)] := by rfl

def vec_x_712 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_712 true = [none, some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_713 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_713 true = [some (0, false, 36), none, some (0, false, 26)] := by rfl

def vec_x_714 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_714 true = [some (0, false, 36), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_715 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_715 true = [some (0, false, 36), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_716 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_716 true = [none, some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_717 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_717 true = [some (0, false, 36), none, some (0, false, 101)] := by rfl

def vec_x_718 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_718 true = [none, some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_719 : Zunno.GameState :=
  { human := [36, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_719 true = [some (0, false, 36), none, some (0, false, 105)] := by rfl

def vec_x_720 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_720 true = [none, some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_721 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_721 true = [some (0, false, 36), none, some (0, false, 2)] := by rfl

def vec_x_722 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_722 true = [some (0, false, 36), some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_723 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_723 true = [some (0, false, 36), none, some (0, false, 11)] := by rfl

def vec_x_724 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_724 true = [none, some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_725 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_725 true = [some (0, false, 36), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_726 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_726 true = [none, some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_727 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_727 true = [some (0, false, 36), none, some (0, false, 24)] := by rfl

def vec_x_728 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_728 true = [none, some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_729 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_729 true = [some (0, false, 36), none, some (0, false, 26)] := by rfl

def vec_x_730 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_730 true = [some (0, false, 36), some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_731 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_731 true = [some (0, false, 36), none, some (0, false, 36)] := by rfl

def vec_x_732 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_732 true = [none, some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_733 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_733 true = [some (0, false, 36), none, some (0, false, 101)] := by rfl

def vec_x_734 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_734 true = [none, some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_735 : Zunno.GameState :=
  { human := [36, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_735 true = [some (0, false, 36), none, some (0, false, 105)] := by rfl

def vec_x_736 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_736 true = [none, some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_737 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_737 true = [some (0, false, 36), none, some (0, false, 2)] := by rfl

def vec_x_738 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_738 true = [some (0, false, 36), some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_739 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_739 true = [some (0, false, 36), none, some (0, false, 11)] := by rfl

def vec_x_740 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_740 true = [none, some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_741 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_741 true = [some (0, false, 36), none, some (0, false, 21)] := by rfl

def vec_x_742 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_742 true = [none, some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_743 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_743 true = [some (0, false, 36), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_744 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_744 true = [none, some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_745 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_745 true = [some (0, false, 36), none, some (0, false, 26)] := by rfl

def vec_x_746 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_746 true = [some (0, false, 36), some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_747 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_747 true = [some (0, false, 36), none, some (0, false, 36)] := by rfl

def vec_x_748 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_748 true = [none, some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_749 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_749 true = [some (0, false, 36), none, some (0, false, 101)] := by rfl

def vec_x_750 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_750 true = [none, some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_751 : Zunno.GameState :=
  { human := [36, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_751 true = [some (0, false, 36), none, some (0, false, 105)] := by rfl

def vec_x_752 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_752 true = [none, none, some (0, false, 2)] := by rfl

def vec_x_753 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_753 true = [some (0, false, 36), some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_754 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_754 true = [some (0, false, 36), none, some (0, false, 11)] := by rfl

def vec_x_755 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_755 true = [some (0, false, 36), some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_756 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_756 true = [none, none, some (0, false, 21)] := by rfl

def vec_x_757 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_757 true = [some (0, false, 36), some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_758 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_758 true = [none, none, some (0, false, 24)] := by rfl

def vec_x_759 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_759 true = [some (0, false, 36), some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_760 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_760 true = [none, some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_761 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_761 true = [some (0, false, 36), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_762 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_762 true = [some (0, false, 36), none, some (0, false, 36)] := by rfl

def vec_x_763 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_763 true = [some (0, false, 36), some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_764 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_764 true = [none, none, some (0, false, 101)] := by rfl

def vec_x_765 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_765 true = [some (0, false, 36), some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_766 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_766 true = [none, none, some (0, false, 105)] := by rfl

def vec_x_767 : Zunno.GameState :=
  { human := [36, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_767 true = [some (0, false, 36), some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_768 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_768 true = [none, some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_769 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_769 true = [some (0, false, 36), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_770 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_770 true = [some (0, false, 36), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_771 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_771 true = [some (0, false, 36), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_772 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_772 true = [none, some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_773 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_773 true = [some (0, false, 36), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_774 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_774 true = [none, some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_775 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_775 true = [some (0, false, 36), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_776 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_776 true = [none, some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_777 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_777 true = [some (0, false, 36), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_778 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_778 true = [some (0, false, 36), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_779 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_779 true = [some (0, false, 36), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_780 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_780 true = [none, some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_781 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_781 true = [some (0, false, 36), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_782 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_782 true = [none, some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_783 : Zunno.GameState :=
  { human := [36, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_783 true = [some (0, false, 36), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_784 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_784 true = [none, some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_785 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_785 true = [some (0, false, 36), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_786 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_786 true = [some (0, false, 36), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_787 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_787 true = [some (0, false, 36), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_788 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_788 true = [none, some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_789 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_789 true = [some (0, false, 36), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_790 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_790 true = [none, some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_791 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_791 true = [some (0, false, 36), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_792 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_792 true = [none, some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_793 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_793 true = [some (0, false, 36), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_794 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_794 true = [some (0, false, 36), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_795 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_795 true = [some (0, false, 36), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_796 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_796 true = [none, some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_797 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_797 true = [some (0, false, 36), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_798 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_798 true = [none, some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_799 : Zunno.GameState :=
  { human := [36, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_799 true = [some (0, false, 36), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_800 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_800 true = [some (0, false, 101), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_801 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_801 true = [some (0, false, 101), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_802 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_802 true = [some (0, false, 101), some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_803 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_803 true = [some (0, false, 101), none, some (0, false, 11)] := by rfl

def vec_x_804 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_804 true = [some (0, false, 101), some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_805 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_805 true = [some (0, false, 101), none, some (0, false, 21)] := by rfl

def vec_x_806 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_806 true = [some (0, false, 101), some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_807 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_807 true = [some (0, false, 101), none, some (0, false, 24)] := by rfl

def vec_x_808 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_808 true = [some (0, false, 101), some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_809 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_809 true = [some (0, false, 101), none, some (0, false, 26)] := by rfl

def vec_x_810 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_810 true = [some (0, false, 101), some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_811 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_811 true = [some (0, false, 101), none, some (0, false, 36)] := by rfl

def vec_x_812 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_812 true = [some (0, false, 101), some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_813 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_813 true = [some (0, false, 101), none, some (0, false, 101)] := by rfl

def vec_x_814 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_814 true = [some (0, false, 101), some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_815 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_815 true = [some (0, false, 101), none, some (0, false, 105)] := by rfl

def vec_x_816 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_816 true = [some (0, false, 101), some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_817 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_817 true = [some (0, false, 101), none, some (0, false, 2)] := by rfl

def vec_x_818 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_818 true = [some (0, false, 101), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_819 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_819 true = [some (0, false, 101), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_820 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_820 true = [some (0, false, 101), some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_821 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_821 true = [some (0, false, 101), none, some (0, false, 21)] := by rfl

def vec_x_822 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_822 true = [some (0, false, 101), some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_823 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_823 true = [some (0, false, 101), none, some (0, false, 24)] := by rfl

def vec_x_824 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_824 true = [some (0, false, 101), some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_825 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_825 true = [some (0, false, 101), none, some (0, false, 26)] := by rfl

def vec_x_826 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_826 true = [some (0, false, 101), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_827 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_827 true = [some (0, false, 101), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_828 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_828 true = [some (0, false, 101), some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_829 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_829 true = [some (0, false, 101), none, some (0, false, 101)] := by rfl

def vec_x_830 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_830 true = [some (0, false, 101), some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_831 : Zunno.GameState :=
  { human := [101, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_831 true = [some (0, false, 101), none, some (0, false, 105)] := by rfl

def vec_x_832 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_832 true = [some (0, false, 101), some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_833 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_833 true = [some (0, false, 101), none, some (0, false, 2)] := by rfl

def vec_x_834 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_834 true = [some (0, false, 101), some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_835 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_835 true = [some (0, false, 101), none, some (0, false, 11)] := by rfl

def vec_x_836 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_836 true = [some (0, false, 101), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_837 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_837 true = [some (0, false, 101), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_838 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_838 true = [some (0, false, 101), some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_839 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_839 true = [some (0, false, 101), none, some (0, false, 24)] := by rfl

def vec_x_840 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_840 true = [some (0, false, 101), some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_841 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_841 true = [some (0, false, 101), none, some (0, false, 26)] := by rfl

def vec_x_842 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_842 true = [some (0, false, 101), some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_843 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_843 true = [some (0, false, 101), none, some (0, false, 36)] := by rfl

def vec_x_844 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_844 true = [some (0, false, 101), some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_845 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_845 true = [some (0, false, 101), none, some (0, false, 101)] := by rfl

def vec_x_846 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_846 true = [some (0, false, 101), some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_847 : Zunno.GameState :=
  { human := [101, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_847 true = [some (0, false, 101), none, some (0, false, 105)] := by rfl

def vec_x_848 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_848 true = [some (0, false, 101), some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_849 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_849 true = [some (0, false, 101), none, some (0, false, 2)] := by rfl

def vec_x_850 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_850 true = [some (0, false, 101), some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_851 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_851 true = [some (0, false, 101), none, some (0, false, 11)] := by rfl

def vec_x_852 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_852 true = [some (0, false, 101), some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_853 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_853 true = [some (0, false, 101), none, some (0, false, 21)] := by rfl

def vec_x_854 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_854 true = [some (0, false, 101), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_855 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_855 true = [some (0, false, 101), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_856 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_856 true = [some (0, false, 101), some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_857 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_857 true = [some (0, false, 101), none, some (0, false, 26)] := by rfl

def vec_x_858 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_858 true = [some (0, false, 101), some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_859 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_859 true = [some (0, false, 101), none, some (0, false, 36)] := by rfl

def vec_x_860 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_860 true = [some (0, false, 101), some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_861 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_861 true = [some (0, false, 101), none, some (0, false, 101)] := by rfl

def vec_x_862 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_862 true = [some (0, false, 101), some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_863 : Zunno.GameState :=
  { human := [101, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_863 true = [some (0, false, 101), none, some (0, false, 105)] := by rfl

def vec_x_864 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_864 true = [some (0, false, 101), none, some (0, false, 2)] := by rfl

def vec_x_865 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_865 true = [some (0, false, 101), some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_866 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_866 true = [some (0, false, 101), none, some (0, false, 11)] := by rfl

def vec_x_867 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_867 true = [some (0, false, 101), some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_868 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_868 true = [some (0, false, 101), none, some (0, false, 21)] := by rfl

def vec_x_869 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_869 true = [some (0, false, 101), some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_870 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_870 true = [some (0, false, 101), none, some (0, false, 24)] := by rfl

def vec_x_871 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_871 true = [some (0, false, 101), some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_872 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_872 true = [some (0, false, 101), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_873 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_873 true = [some (0, false, 101), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_874 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_874 true = [some (0, false, 101), none, some (0, false, 36)] := by rfl

def vec_x_875 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_875 true = [some (0, false, 101), some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_876 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_876 true = [some (0, false, 101), none, some (0, false, 101)] := by rfl

def vec_x_877 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_877 true = [some (0, false, 101), some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_878 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_878 true = [some (0, false, 101), none, some (0, false, 105)] := by rfl

def vec_x_879 : Zunno.GameState :=
  { human := [101, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_879 true = [some (0, false, 101), some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_880 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_880 true = [some (0, false, 101), none, some (0, false, 2)] := by rfl

def vec_x_881 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_881 true = [some (0, false, 101), some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_882 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_882 true = [some (0, false, 101), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_883 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_883 true = [some (0, false, 101), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_884 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_884 true = [some (0, false, 101), none, some (0, false, 21)] := by rfl

def vec_x_885 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_885 true = [some (0, false, 101), some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_886 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_886 true = [some (0, false, 101), none, some (0, false, 24)] := by rfl

def vec_x_887 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_887 true = [some (0, false, 101), some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_888 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_888 true = [some (0, false, 101), none, some (0, false, 26)] := by rfl

def vec_x_889 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_889 true = [some (0, false, 101), some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_890 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_890 true = [some (0, false, 101), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_891 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_891 true = [some (0, false, 101), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_892 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_892 true = [some (0, false, 101), none, some (0, false, 101)] := by rfl

def vec_x_893 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_893 true = [some (0, false, 101), some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_894 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_894 true = [some (0, false, 101), none, some (0, false, 105)] := by rfl

def vec_x_895 : Zunno.GameState :=
  { human := [101, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_895 true = [some (0, false, 101), some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_896 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_896 true = [some (0, false, 101), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_897 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_897 true = [some (0, false, 101), some (0, true, 105), some (0, false, 2)] := by rfl

def vec_x_898 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_898 true = [some (0, false, 101), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_899 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_899 true = [some (0, false, 101), some (0, true, 105), some (0, false, 11)] := by rfl

def vec_x_900 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_900 true = [some (0, false, 101), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_901 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_901 true = [some (0, false, 101), some (0, true, 105), some (0, false, 21)] := by rfl

def vec_x_902 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_902 true = [some (0, false, 101), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_903 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_903 true = [some (0, false, 101), some (0, true, 105), some (0, false, 24)] := by rfl

def vec_x_904 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_904 true = [some (0, false, 101), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_905 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_905 true = [some (0, false, 101), some (0, true, 105), some (0, false, 26)] := by rfl

def vec_x_906 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_906 true = [some (0, false, 101), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_907 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_907 true = [some (0, false, 101), some (0, true, 105), some (0, false, 36)] := by rfl

def vec_x_908 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_908 true = [some (0, false, 101), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_909 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_909 true = [some (0, false, 101), some (0, true, 105), some (0, false, 101)] := by rfl

def vec_x_910 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_910 true = [some (0, false, 101), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_911 : Zunno.GameState :=
  { human := [101, 105], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_911 true = [some (0, false, 101), some (0, true, 105), some (0, false, 105)] := by rfl

def vec_x_912 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_912 true = [some (0, true, 105), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_913 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_913 true = [some (0, true, 105), some (0, false, 2), some (0, false, 2)] := by rfl

def vec_x_914 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_914 true = [some (0, true, 105), some (0, false, 2), some (0, false, 11)] := by rfl

def vec_x_915 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_915 true = [some (0, true, 105), none, some (0, false, 11)] := by rfl

def vec_x_916 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_916 true = [some (0, true, 105), some (0, false, 2), some (0, false, 21)] := by rfl

def vec_x_917 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_917 true = [some (0, true, 105), none, some (0, false, 21)] := by rfl

def vec_x_918 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_918 true = [some (0, true, 105), some (0, false, 2), some (0, false, 24)] := by rfl

def vec_x_919 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_919 true = [some (0, true, 105), none, some (0, false, 24)] := by rfl

def vec_x_920 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_920 true = [some (0, true, 105), some (0, false, 2), some (0, false, 26)] := by rfl

def vec_x_921 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_921 true = [some (0, true, 105), none, some (0, false, 26)] := by rfl

def vec_x_922 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_922 true = [some (0, true, 105), some (0, false, 2), some (0, false, 36)] := by rfl

def vec_x_923 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_923 true = [some (0, true, 105), none, some (0, false, 36)] := by rfl

def vec_x_924 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_924 true = [some (0, true, 105), some (0, false, 2), some (0, false, 101)] := by rfl

def vec_x_925 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_925 true = [some (0, true, 105), none, some (0, false, 101)] := by rfl

def vec_x_926 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_926 true = [some (0, true, 105), some (0, false, 2), some (0, false, 105)] := by rfl

def vec_x_927 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_927 true = [some (0, true, 105), none, some (0, false, 105)] := by rfl

def vec_x_928 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_928 true = [some (0, true, 105), some (0, false, 11), some (0, false, 2)] := by rfl

def vec_x_929 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_929 true = [some (0, true, 105), none, some (0, false, 2)] := by rfl

def vec_x_930 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_930 true = [some (0, true, 105), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_931 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_931 true = [some (0, true, 105), some (0, false, 11), some (0, false, 11)] := by rfl

def vec_x_932 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_932 true = [some (0, true, 105), some (0, false, 11), some (0, false, 21)] := by rfl

def vec_x_933 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_933 true = [some (0, true, 105), none, some (0, false, 21)] := by rfl

def vec_x_934 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_934 true = [some (0, true, 105), some (0, false, 11), some (0, false, 24)] := by rfl

def vec_x_935 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_935 true = [some (0, true, 105), none, some (0, false, 24)] := by rfl

def vec_x_936 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_936 true = [some (0, true, 105), some (0, false, 11), some (0, false, 26)] := by rfl

def vec_x_937 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_937 true = [some (0, true, 105), none, some (0, false, 26)] := by rfl

def vec_x_938 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_938 true = [some (0, true, 105), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_939 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_939 true = [some (0, true, 105), some (0, false, 11), some (0, false, 36)] := by rfl

def vec_x_940 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_940 true = [some (0, true, 105), some (0, false, 11), some (0, false, 101)] := by rfl

def vec_x_941 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_941 true = [some (0, true, 105), none, some (0, false, 101)] := by rfl

def vec_x_942 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_942 true = [some (0, true, 105), some (0, false, 11), some (0, false, 105)] := by rfl

def vec_x_943 : Zunno.GameState :=
  { human := [105, 11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_943 true = [some (0, true, 105), none, some (0, false, 105)] := by rfl

def vec_x_944 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_944 true = [some (0, true, 105), some (0, true, 21), some (0, false, 2)] := by rfl

def vec_x_945 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_945 true = [some (0, true, 105), none, some (0, false, 2)] := by rfl

def vec_x_946 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_946 true = [some (0, true, 105), some (0, true, 21), some (0, false, 11)] := by rfl

def vec_x_947 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_947 true = [some (0, true, 105), none, some (0, false, 11)] := by rfl

def vec_x_948 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_948 true = [some (0, true, 105), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_949 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_949 true = [some (0, true, 105), some (0, true, 21), some (0, false, 21)] := by rfl

def vec_x_950 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_950 true = [some (0, true, 105), some (0, true, 21), some (0, false, 24)] := by rfl

def vec_x_951 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_951 true = [some (0, true, 105), none, some (0, false, 24)] := by rfl

def vec_x_952 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_952 true = [some (0, true, 105), some (0, true, 21), some (0, false, 26)] := by rfl

def vec_x_953 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_953 true = [some (0, true, 105), none, some (0, false, 26)] := by rfl

def vec_x_954 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_954 true = [some (0, true, 105), some (0, true, 21), some (0, false, 36)] := by rfl

def vec_x_955 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_955 true = [some (0, true, 105), none, some (0, false, 36)] := by rfl

def vec_x_956 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_956 true = [some (0, true, 105), some (0, true, 21), some (0, false, 101)] := by rfl

def vec_x_957 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_957 true = [some (0, true, 105), none, some (0, false, 101)] := by rfl

def vec_x_958 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_958 true = [some (0, true, 105), some (0, true, 21), some (0, false, 105)] := by rfl

def vec_x_959 : Zunno.GameState :=
  { human := [105, 21], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_959 true = [some (0, true, 105), none, some (0, false, 105)] := by rfl

def vec_x_960 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_960 true = [some (0, true, 105), some (0, true, 24), some (0, false, 2)] := by rfl

def vec_x_961 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_961 true = [some (0, true, 105), none, some (0, false, 2)] := by rfl

def vec_x_962 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_962 true = [some (0, true, 105), some (0, true, 24), some (0, false, 11)] := by rfl

def vec_x_963 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_963 true = [some (0, true, 105), none, some (0, false, 11)] := by rfl

def vec_x_964 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_964 true = [some (0, true, 105), some (0, true, 24), some (0, false, 21)] := by rfl

def vec_x_965 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_965 true = [some (0, true, 105), none, some (0, false, 21)] := by rfl

def vec_x_966 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_966 true = [some (0, true, 105), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_967 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_967 true = [some (0, true, 105), some (0, true, 24), some (0, false, 24)] := by rfl

def vec_x_968 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_968 true = [some (0, true, 105), some (0, true, 24), some (0, false, 26)] := by rfl

def vec_x_969 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_969 true = [some (0, true, 105), none, some (0, false, 26)] := by rfl

def vec_x_970 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_970 true = [some (0, true, 105), some (0, true, 24), some (0, false, 36)] := by rfl

def vec_x_971 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_971 true = [some (0, true, 105), none, some (0, false, 36)] := by rfl

def vec_x_972 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_972 true = [some (0, true, 105), some (0, true, 24), some (0, false, 101)] := by rfl

def vec_x_973 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_973 true = [some (0, true, 105), none, some (0, false, 101)] := by rfl

def vec_x_974 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_974 true = [some (0, true, 105), some (0, true, 24), some (0, false, 105)] := by rfl

def vec_x_975 : Zunno.GameState :=
  { human := [105, 24], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_975 true = [some (0, true, 105), none, some (0, false, 105)] := by rfl

def vec_x_976 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_976 true = [some (0, true, 105), none, some (0, false, 2)] := by rfl

def vec_x_977 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_977 true = [some (0, true, 105), some (0, false, 26), some (0, false, 2)] := by rfl

def vec_x_978 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_978 true = [some (0, true, 105), none, some (0, false, 11)] := by rfl

def vec_x_979 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_979 true = [some (0, true, 105), some (0, false, 26), some (0, false, 11)] := by rfl

def vec_x_980 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_980 true = [some (0, true, 105), none, some (0, false, 21)] := by rfl

def vec_x_981 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_981 true = [some (0, true, 105), some (0, false, 26), some (0, false, 21)] := by rfl

def vec_x_982 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_982 true = [some (0, true, 105), none, some (0, false, 24)] := by rfl

def vec_x_983 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_983 true = [some (0, true, 105), some (0, false, 26), some (0, false, 24)] := by rfl

def vec_x_984 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_984 true = [some (0, true, 105), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_985 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_985 true = [some (0, true, 105), some (0, false, 26), some (0, false, 26)] := by rfl

def vec_x_986 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_986 true = [some (0, true, 105), none, some (0, false, 36)] := by rfl

def vec_x_987 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_987 true = [some (0, true, 105), some (0, false, 26), some (0, false, 36)] := by rfl

def vec_x_988 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_988 true = [some (0, true, 105), none, some (0, false, 101)] := by rfl

def vec_x_989 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_989 true = [some (0, true, 105), some (0, false, 26), some (0, false, 101)] := by rfl

def vec_x_990 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_990 true = [some (0, true, 105), none, some (0, false, 105)] := by rfl

def vec_x_991 : Zunno.GameState :=
  { human := [105, 26], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_991 true = [some (0, true, 105), some (0, false, 26), some (0, false, 105)] := by rfl

def vec_x_992 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_992 true = [some (0, true, 105), none, some (0, false, 2)] := by rfl

def vec_x_993 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_993 true = [some (0, true, 105), some (0, false, 36), some (0, false, 2)] := by rfl

def vec_x_994 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_994 true = [some (0, true, 105), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_995 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_995 true = [some (0, true, 105), some (0, false, 36), some (0, false, 11)] := by rfl

def vec_x_996 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_996 true = [some (0, true, 105), none, some (0, false, 21)] := by rfl

def vec_x_997 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_997 true = [some (0, true, 105), some (0, false, 36), some (0, false, 21)] := by rfl

def vec_x_998 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_998 true = [some (0, true, 105), none, some (0, false, 24)] := by rfl

def vec_x_999 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_999 true = [some (0, true, 105), some (0, false, 36), some (0, false, 24)] := by rfl

def vec_x_1000 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1000 true = [some (0, true, 105), none, some (0, false, 26)] := by rfl

def vec_x_1001 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1001 true = [some (0, true, 105), some (0, false, 36), some (0, false, 26)] := by rfl

def vec_x_1002 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1002 true = [some (0, true, 105), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_1003 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1003 true = [some (0, true, 105), some (0, false, 36), some (0, false, 36)] := by rfl

def vec_x_1004 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1004 true = [some (0, true, 105), none, some (0, false, 101)] := by rfl

def vec_x_1005 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1005 true = [some (0, true, 105), some (0, false, 36), some (0, false, 101)] := by rfl

def vec_x_1006 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1006 true = [some (0, true, 105), none, some (0, false, 105)] := by rfl

def vec_x_1007 : Zunno.GameState :=
  { human := [105, 36], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1007 true = [some (0, true, 105), some (0, false, 36), some (0, false, 105)] := by rfl

def vec_x_1008 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1008 true = [some (0, true, 105), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_1009 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1009 true = [some (0, true, 105), some (0, false, 101), some (0, false, 2)] := by rfl

def vec_x_1010 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1010 true = [some (0, true, 105), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_1011 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1011 true = [some (0, true, 105), some (0, false, 101), some (0, false, 11)] := by rfl

def vec_x_1012 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1012 true = [some (0, true, 105), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_1013 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1013 true = [some (0, true, 105), some (0, false, 101), some (0, false, 21)] := by rfl

def vec_x_1014 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1014 true = [some (0, true, 105), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_1015 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1015 true = [some (0, true, 105), some (0, false, 101), some (0, false, 24)] := by rfl

def vec_x_1016 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1016 true = [some (0, true, 105), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_1017 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1017 true = [some (0, true, 105), some (0, false, 101), some (0, false, 26)] := by rfl

def vec_x_1018 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1018 true = [some (0, true, 105), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_1019 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1019 true = [some (0, true, 105), some (0, false, 101), some (0, false, 36)] := by rfl

def vec_x_1020 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1020 true = [some (0, true, 105), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_1021 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1021 true = [some (0, true, 105), some (0, false, 101), some (0, false, 101)] := by rfl

def vec_x_1022 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1022 true = [some (0, true, 105), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_1023 : Zunno.GameState :=
  { human := [105, 101], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := true, winner := none }

example : Zunno.playOutcomes vec_x_1023 true = [some (0, true, 105), some (0, false, 101), some (0, false, 105)] := by rfl

def vec_x_1024 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1024 false = [some (2, false, 2), some (0, true, 2)] := by rfl

def vec_x_1025 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1025 false = [some (2, false, 2), some (0, true, 2)] := by rfl

def vec_x_1026 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1026 false = [some (2, false, 2), some (0, true, 11)] := by rfl

def vec_x_1027 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1027 false = [none, some (0, true, 11)] := by rfl

def vec_x_1028 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1028 false = [some (2, false, 2), some (0, true, 21)] := by rfl

def vec_x_1029 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1029 false = [none, some (0, true, 21)] := by rfl

def vec_x_1030 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1030 false = [some (2, false, 2), some (0, true, 24)] := by rfl

def vec_x_1031 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1031 false = [none, some (0, true, 24)] := by rfl

def vec_x_1032 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1032 false = [some (2, false, 2), some (0, true, 26)] := by rfl

def vec_x_1033 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1033 false = [none, some (0, true, 26)] := by rfl

def vec_x_1034 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1034 false = [some (2, false, 2), some (0, true, 36)] := by rfl

def vec_x_1035 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1035 false = [none, some (0, true, 36)] := by rfl

def vec_x_1036 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1036 false = [some (2, false, 2), some (0, true, 101)] := by rfl

def vec_x_1037 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1037 false = [none, some (0, true, 101)] := by rfl

def vec_x_1038 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1038 false = [some (2, false, 2), some (0, true, 105)] := by rfl

def vec_x_1039 : Zunno.GameState :=
  { human := [3], agent := [2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1039 false = [none, some (0, true, 105)] := by rfl

def vec_x_1040 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1040 false = [some (2, false, 11), some (0, true, 2)] := by rfl

def vec_x_1041 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1041 false = [none, some (0, true, 2)] := by rfl

def vec_x_1042 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1042 false = [some (2, false, 11), some (0, true, 11)] := by rfl

def vec_x_1043 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1043 false = [some (2, false, 11), some (0, true, 11)] := by rfl

def vec_x_1044 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1044 false = [some (2, false, 11), some (0, true, 21)] := by rfl

def vec_x_1045 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1045 false = [none, some (0, true, 21)] := by rfl

def vec_x_1046 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1046 false = [some (2, false, 11), some (0, true, 24)] := by rfl

def vec_x_1047 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1047 false = [none, some (0, true, 24)] := by rfl

def vec_x_1048 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1048 false = [some (2, false, 11), some (0, true, 26)] := by rfl

def vec_x_1049 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1049 false = [none, some (0, true, 26)] := by rfl

def vec_x_1050 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1050 false = [some (2, false, 11), some (0, true, 36)] := by rfl

def vec_x_1051 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1051 false = [some (2, false, 11), some (0, true, 36)] := by rfl

def vec_x_1052 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1052 false = [some (2, false, 11), some (0, true, 101)] := by rfl

def vec_x_1053 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1053 false = [none, some (0, true, 101)] := by rfl

def vec_x_1054 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1054 false = [some (2, false, 11), some (0, true, 105)] := by rfl

def vec_x_1055 : Zunno.GameState :=
  { human := [3], agent := [11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1055 false = [none, some (0, true, 105)] := by rfl

def vec_x_1056 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1056 false = [some (2, false, 21), some (0, true, 2)] := by rfl

def vec_x_1057 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1057 false = [none, some (0, true, 2)] := by rfl

def vec_x_1058 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1058 false = [some (2, false, 21), some (0, true, 11)] := by rfl

def vec_x_1059 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1059 false = [none, some (0, true, 11)] := by rfl

def vec_x_1060 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1060 false = [some (2, false, 21), some (0, true, 21)] := by rfl

def vec_x_1061 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1061 false = [some (2, false, 21), some (0, true, 21)] := by rfl

def vec_x_1062 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1062 false = [some (2, false, 21), some (0, true, 24)] := by rfl

def vec_x_1063 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1063 false = [none, some (0, true, 24)] := by rfl

def vec_x_1064 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1064 false = [some (2, false, 21), some (0, true, 26)] := by rfl

def vec_x_1065 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1065 false = [none, some (0, true, 26)] := by rfl

def vec_x_1066 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1066 false = [some (2, false, 21), some (0, true, 36)] := by rfl

def vec_x_1067 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1067 false = [none, some (0, true, 36)] := by rfl

def vec_x_1068 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1068 false = [some (2, false, 21), some (0, true, 101)] := by rfl

def vec_x_1069 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1069 false = [none, some (0, true, 101)] := by rfl

def vec_x_1070 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1070 false = [some (2, false, 21), some (0, true, 105)] := by rfl

def vec_x_1071 : Zunno.GameState :=
  { human := [3], agent := [21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1071 false = [none, some (0, true, 105)] := by rfl

def vec_x_1072 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1072 false = [some (2, false, 24), some (0, true, 2)] := by rfl

def vec_x_1073 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1073 false = [none, some (0, true, 2)] := by rfl

def vec_x_1074 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1074 false = [some (2, false, 24), some (0, true, 11)] := by rfl

def vec_x_1075 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1075 false = [none, some (0, true, 11)] := by rfl

def vec_x_1076 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1076 false = [some (2, false, 24), some (0, true, 21)] := by rfl

def vec_x_1077 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1077 false = [none, some (0, true, 21)] := by rfl

def vec_x_1078 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1078 false = [some (2, false, 24), some (0, true, 24)] := by rfl

def vec_x_1079 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1079 false = [some (2, false, 24), some (0, true, 24)] := by rfl

def vec_x_1080 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1080 false = [some (2, false, 24), some (0, true, 26)] := by rfl

def vec_x_1081 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1081 false = [none, some (0, true, 26)] := by rfl

def vec_x_1082 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1082 false = [some (2, false, 24), some (0, true, 36)] := by rfl

def vec_x_1083 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1083 false = [none, some (0, true, 36)] := by rfl

def vec_x_1084 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1084 false = [some (2, false, 24), some (0, true, 101)] := by rfl

def vec_x_1085 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1085 false = [none, some (0, true, 101)] := by rfl

def vec_x_1086 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1086 false = [some (2, false, 24), some (0, true, 105)] := by rfl

def vec_x_1087 : Zunno.GameState :=
  { human := [3], agent := [24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1087 false = [none, some (0, true, 105)] := by rfl

def vec_x_1088 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1088 false = [none, some (0, true, 2)] := by rfl

def vec_x_1089 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1089 false = [some (2, false, 26), some (0, true, 2)] := by rfl

def vec_x_1090 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1090 false = [none, some (0, true, 11)] := by rfl

def vec_x_1091 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1091 false = [some (2, false, 26), some (0, true, 11)] := by rfl

def vec_x_1092 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1092 false = [none, some (0, true, 21)] := by rfl

def vec_x_1093 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1093 false = [some (2, false, 26), some (0, true, 21)] := by rfl

def vec_x_1094 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1094 false = [none, some (0, true, 24)] := by rfl

def vec_x_1095 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1095 false = [some (2, false, 26), some (0, true, 24)] := by rfl

def vec_x_1096 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1096 false = [some (2, false, 26), some (0, true, 26)] := by rfl

def vec_x_1097 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1097 false = [some (2, false, 26), some (0, true, 26)] := by rfl

def vec_x_1098 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1098 false = [none, some (0, true, 36)] := by rfl

def vec_x_1099 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1099 false = [some (2, false, 26), some (0, true, 36)] := by rfl

def vec_x_1100 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1100 false = [none, some (0, true, 101)] := by rfl

def vec_x_1101 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1101 false = [some (2, false, 26), some (0, true, 101)] := by rfl

def vec_x_1102 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1102 false = [none, some (0, true, 105)] := by rfl

def vec_x_1103 : Zunno.GameState :=
  { human := [3], agent := [26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1103 false = [some (2, false, 26), some (0, true, 105)] := by rfl

def vec_x_1104 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1104 false = [none, some (0, true, 2)] := by rfl

def vec_x_1105 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1105 false = [some (2, false, 36), some (0, true, 2)] := by rfl

def vec_x_1106 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1106 false = [some (2, false, 36), some (0, true, 11)] := by rfl

def vec_x_1107 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1107 false = [some (2, false, 36), some (0, true, 11)] := by rfl

def vec_x_1108 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1108 false = [none, some (0, true, 21)] := by rfl

def vec_x_1109 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1109 false = [some (2, false, 36), some (0, true, 21)] := by rfl

def vec_x_1110 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1110 false = [none, some (0, true, 24)] := by rfl

def vec_x_1111 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1111 false = [some (2, false, 36), some (0, true, 24)] := by rfl

def vec_x_1112 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1112 false = [none, some (0, true, 26)] := by rfl

def vec_x_1113 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1113 false = [some (2, false, 36), some (0, true, 26)] := by rfl

def vec_x_1114 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1114 false = [some (2, false, 36), some (0, true, 36)] := by rfl

def vec_x_1115 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1115 false = [some (2, false, 36), some (0, true, 36)] := by rfl

def vec_x_1116 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1116 false = [none, some (0, true, 101)] := by rfl

def vec_x_1117 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1117 false = [some (2, false, 36), some (0, true, 101)] := by rfl

def vec_x_1118 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1118 false = [none, some (0, true, 105)] := by rfl

def vec_x_1119 : Zunno.GameState :=
  { human := [3], agent := [36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1119 false = [some (2, false, 36), some (0, true, 105)] := by rfl

def vec_x_1120 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1120 false = [some (2, false, 101), some (0, true, 2)] := by rfl

def vec_x_1121 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1121 false = [some (2, false, 101), some (0, true, 2)] := by rfl

def vec_x_1122 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1122 false = [some (2, false, 101), some (0, true, 11)] := by rfl

def vec_x_1123 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1123 false = [some (2, false, 101), some (0, true, 11)] := by rfl

def vec_x_1124 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1124 false = [some (2, false, 101), some (0, true, 21)] := by rfl

def vec_x_1125 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1125 false = [some (2, false, 101), some (0, true, 21)] := by rfl

def vec_x_1126 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1126 false = [some (2, false, 101), some (0, true, 24)] := by rfl

def vec_x_1127 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1127 false = [some (2, false, 101), some (0, true, 24)] := by rfl

def vec_x_1128 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1128 false = [some (2, false, 101), some (0, true, 26)] := by rfl

def vec_x_1129 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1129 false = [some (2, false, 101), some (0, true, 26)] := by rfl

def vec_x_1130 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1130 false = [some (2, false, 101), some (0, true, 36)] := by rfl

def vec_x_1131 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1131 false = [some (2, false, 101), some (0, true, 36)] := by rfl

def vec_x_1132 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1132 false = [some (2, false, 101), some (0, true, 101)] := by rfl

def vec_x_1133 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1133 false = [some (2, false, 101), some (0, true, 101)] := by rfl

def vec_x_1134 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1134 false = [some (2, false, 101), some (0, true, 105)] := by rfl

def vec_x_1135 : Zunno.GameState :=
  { human := [3], agent := [101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1135 false = [some (2, false, 101), some (0, true, 105)] := by rfl

def vec_x_1136 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1136 false = [some (2, false, 105), some (0, true, 2)] := by rfl

def vec_x_1137 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1137 false = [some (2, false, 105), some (0, true, 2)] := by rfl

def vec_x_1138 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1138 false = [some (2, false, 105), some (0, true, 11)] := by rfl

def vec_x_1139 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1139 false = [some (2, false, 105), some (0, true, 11)] := by rfl

def vec_x_1140 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1140 false = [some (2, false, 105), some (0, true, 21)] := by rfl

def vec_x_1141 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1141 false = [some (2, false, 105), some (0, true, 21)] := by rfl

def vec_x_1142 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1142 false = [some (2, false, 105), some (0, true, 24)] := by rfl

def vec_x_1143 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1143 false = [some (2, false, 105), some (0, true, 24)] := by rfl

def vec_x_1144 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1144 false = [some (2, false, 105), some (0, true, 26)] := by rfl

def vec_x_1145 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1145 false = [some (2, false, 105), some (0, true, 26)] := by rfl

def vec_x_1146 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1146 false = [some (2, false, 105), some (0, true, 36)] := by rfl

def vec_x_1147 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1147 false = [some (2, false, 105), some (0, true, 36)] := by rfl

def vec_x_1148 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1148 false = [some (2, false, 105), some (0, true, 101)] := by rfl

def vec_x_1149 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1149 false = [some (2, false, 105), some (0, true, 101)] := by rfl

def vec_x_1150 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1150 false = [some (2, false, 105), some (0, true, 105)] := by rfl

def vec_x_1151 : Zunno.GameState :=
  { human := [3], agent := [105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1151 false = [some (2, false, 105), some (0, true, 105)] := by rfl

def vec_x_1152 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1152 false = [some (0, true, 2), some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1153 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1153 false = [some (0, true, 2), none, some (0, true, 2)] := by rfl

def vec_x_1154 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1154 false = [some (0, true, 2), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1155 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1155 false = [none, some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1156 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1156 false = [some (0, true, 2), some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1157 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1157 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1158 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1158 false = [some (0, true, 2), some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1159 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1159 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1160 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1160 false = [some (0, true, 2), some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1161 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1161 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1162 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1162 false = [some (0, true, 2), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1163 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1163 false = [none, some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1164 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1164 false = [some (0, true, 2), some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1165 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1165 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1166 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1166 false = [some (0, true, 2), some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1167 : Zunno.GameState :=
  { human := [3], agent := [2, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1167 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1168 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1168 false = [some (0, true, 2), some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1169 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1169 false = [some (0, true, 2), none, some (0, true, 2)] := by rfl

def vec_x_1170 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1170 false = [some (0, true, 2), some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1171 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1171 false = [none, none, some (0, true, 11)] := by rfl

def vec_x_1172 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1172 false = [some (0, true, 2), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1173 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1173 false = [none, some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1174 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1174 false = [some (0, true, 2), some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1175 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1175 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1176 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1176 false = [some (0, true, 2), some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1177 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1177 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1178 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1178 false = [some (0, true, 2), some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1179 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1179 false = [none, none, some (0, true, 36)] := by rfl

def vec_x_1180 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1180 false = [some (0, true, 2), some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1181 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1181 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1182 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1182 false = [some (0, true, 2), some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1183 : Zunno.GameState :=
  { human := [3], agent := [2, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1183 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1184 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1184 false = [some (0, true, 2), some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1185 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1185 false = [some (0, true, 2), none, some (0, true, 2)] := by rfl

def vec_x_1186 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1186 false = [some (0, true, 2), some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1187 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1187 false = [none, none, some (0, true, 11)] := by rfl

def vec_x_1188 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1188 false = [some (0, true, 2), some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1189 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1189 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1190 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1190 false = [some (0, true, 2), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1191 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1191 false = [none, some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1192 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1192 false = [some (0, true, 2), some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1193 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1193 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1194 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1194 false = [some (0, true, 2), some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1195 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1195 false = [none, none, some (0, true, 36)] := by rfl

def vec_x_1196 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1196 false = [some (0, true, 2), some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1197 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1197 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1198 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1198 false = [some (0, true, 2), some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1199 : Zunno.GameState :=
  { human := [3], agent := [2, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1199 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1200 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1200 false = [some (0, true, 2), none, some (0, true, 2)] := by rfl

def vec_x_1201 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1201 false = [some (0, true, 2), some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_1202 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1202 false = [some (0, true, 2), none, some (0, true, 11)] := by rfl

def vec_x_1203 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1203 false = [none, some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_1204 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1204 false = [some (0, true, 2), none, some (0, true, 21)] := by rfl

def vec_x_1205 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1205 false = [none, some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_1206 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1206 false = [some (0, true, 2), none, some (0, true, 24)] := by rfl

def vec_x_1207 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1207 false = [none, some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_1208 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1208 false = [some (0, true, 2), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1209 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1209 false = [none, some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1210 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1210 false = [some (0, true, 2), none, some (0, true, 36)] := by rfl

def vec_x_1211 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1211 false = [none, some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_1212 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1212 false = [some (0, true, 2), none, some (0, true, 101)] := by rfl

def vec_x_1213 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1213 false = [none, some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_1214 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1214 false = [some (0, true, 2), none, some (0, true, 105)] := by rfl

def vec_x_1215 : Zunno.GameState :=
  { human := [3], agent := [2, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1215 false = [none, some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_1216 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1216 false = [some (0, true, 2), none, some (0, true, 2)] := by rfl

def vec_x_1217 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1217 false = [some (0, true, 2), some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_1218 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1218 false = [some (0, true, 2), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1219 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1219 false = [none, some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1220 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1220 false = [some (0, true, 2), none, some (0, true, 21)] := by rfl

def vec_x_1221 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1221 false = [none, some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_1222 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1222 false = [some (0, true, 2), none, some (0, true, 24)] := by rfl

def vec_x_1223 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1223 false = [none, some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_1224 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1224 false = [some (0, true, 2), none, some (0, true, 26)] := by rfl

def vec_x_1225 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1225 false = [none, some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_1226 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1226 false = [some (0, true, 2), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1227 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1227 false = [none, some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1228 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1228 false = [some (0, true, 2), none, some (0, true, 101)] := by rfl

def vec_x_1229 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1229 false = [none, some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_1230 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1230 false = [some (0, true, 2), none, some (0, true, 105)] := by rfl

def vec_x_1231 : Zunno.GameState :=
  { human := [3], agent := [2, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1231 false = [none, some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_1232 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1232 false = [some (0, true, 2), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1233 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1233 false = [some (0, true, 2), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1234 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1234 false = [some (0, true, 2), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1235 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1235 false = [none, some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1236 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1236 false = [some (0, true, 2), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1237 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1237 false = [none, some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1238 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1238 false = [some (0, true, 2), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1239 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1239 false = [none, some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1240 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1240 false = [some (0, true, 2), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1241 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1241 false = [none, some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1242 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1242 false = [some (0, true, 2), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1243 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1243 false = [none, some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1244 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1244 false = [some (0, true, 2), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1245 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1245 false = [none, some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1246 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1246 false = [some (0, true, 2), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1247 : Zunno.GameState :=
  { human := [3], agent := [2, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1247 false = [none, some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1248 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1248 false = [some (0, true, 2), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1249 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1249 false = [some (0, true, 2), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1250 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1250 false = [some (0, true, 2), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1251 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1251 false = [none, some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1252 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1252 false = [some (0, true, 2), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1253 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1253 false = [none, some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1254 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1254 false = [some (0, true, 2), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1255 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1255 false = [none, some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1256 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1256 false = [some (0, true, 2), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1257 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1257 false = [none, some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1258 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1258 false = [some (0, true, 2), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1259 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1259 false = [none, some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1260 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1260 false = [some (0, true, 2), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1261 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1261 false = [none, some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1262 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1262 false = [some (0, true, 2), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1263 : Zunno.GameState :=
  { human := [3], agent := [2, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1263 false = [none, some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1264 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1264 false = [some (0, true, 11), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1265 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1265 false = [none, some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1266 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1266 false = [some (0, true, 11), some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1267 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1267 false = [some (0, true, 11), none, some (0, true, 11)] := by rfl

def vec_x_1268 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1268 false = [some (0, true, 11), some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1269 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1269 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1270 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1270 false = [some (0, true, 11), some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1271 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1271 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1272 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1272 false = [some (0, true, 11), some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1273 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1273 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1274 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1274 false = [some (0, true, 11), some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1275 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1275 false = [some (0, true, 11), none, some (0, true, 36)] := by rfl

def vec_x_1276 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1276 false = [some (0, true, 11), some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1277 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1277 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1278 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1278 false = [some (0, true, 11), some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1279 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1279 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1280 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1280 false = [some (0, true, 11), some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1281 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1281 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1282 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1282 false = [some (0, true, 11), some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1283 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1283 false = [some (0, true, 11), none, some (0, true, 11)] := by rfl

def vec_x_1284 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1284 false = [some (0, true, 11), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1285 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1285 false = [none, some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1286 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1286 false = [some (0, true, 11), some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1287 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1287 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1288 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1288 false = [some (0, true, 11), some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1289 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1289 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1290 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1290 false = [some (0, true, 11), some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1291 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1291 false = [some (0, true, 11), none, some (0, true, 36)] := by rfl

def vec_x_1292 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1292 false = [some (0, true, 11), some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1293 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1293 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1294 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1294 false = [some (0, true, 11), some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1295 : Zunno.GameState :=
  { human := [3], agent := [11, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1295 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1296 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1296 false = [some (0, true, 11), some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1297 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1297 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1298 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1298 false = [some (0, true, 11), some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1299 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1299 false = [some (0, true, 11), none, some (0, true, 11)] := by rfl

def vec_x_1300 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1300 false = [some (0, true, 11), some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1301 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1301 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1302 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1302 false = [some (0, true, 11), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1303 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1303 false = [none, some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1304 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1304 false = [some (0, true, 11), some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1305 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1305 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1306 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1306 false = [some (0, true, 11), some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1307 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1307 false = [some (0, true, 11), none, some (0, true, 36)] := by rfl

def vec_x_1308 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1308 false = [some (0, true, 11), some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1309 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1309 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1310 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1310 false = [some (0, true, 11), some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1311 : Zunno.GameState :=
  { human := [3], agent := [11, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1311 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1312 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1312 false = [some (0, true, 11), none, some (0, true, 2)] := by rfl

def vec_x_1313 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1313 false = [none, some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_1314 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1314 false = [some (0, true, 11), none, some (0, true, 11)] := by rfl

def vec_x_1315 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1315 false = [some (0, true, 11), some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_1316 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1316 false = [some (0, true, 11), none, some (0, true, 21)] := by rfl

def vec_x_1317 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1317 false = [none, some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_1318 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1318 false = [some (0, true, 11), none, some (0, true, 24)] := by rfl

def vec_x_1319 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1319 false = [none, some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_1320 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1320 false = [some (0, true, 11), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1321 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1321 false = [none, some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1322 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1322 false = [some (0, true, 11), none, some (0, true, 36)] := by rfl

def vec_x_1323 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1323 false = [some (0, true, 11), some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_1324 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1324 false = [some (0, true, 11), none, some (0, true, 101)] := by rfl

def vec_x_1325 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1325 false = [none, some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_1326 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1326 false = [some (0, true, 11), none, some (0, true, 105)] := by rfl

def vec_x_1327 : Zunno.GameState :=
  { human := [3], agent := [11, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1327 false = [none, some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_1328 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1328 false = [some (0, true, 11), none, some (0, true, 2)] := by rfl

def vec_x_1329 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1329 false = [none, some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_1330 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1330 false = [some (0, true, 11), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1331 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1331 false = [some (0, true, 11), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1332 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1332 false = [some (0, true, 11), none, some (0, true, 21)] := by rfl

def vec_x_1333 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1333 false = [none, some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_1334 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1334 false = [some (0, true, 11), none, some (0, true, 24)] := by rfl

def vec_x_1335 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1335 false = [none, some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_1336 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1336 false = [some (0, true, 11), none, some (0, true, 26)] := by rfl

def vec_x_1337 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1337 false = [none, some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_1338 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1338 false = [some (0, true, 11), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1339 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1339 false = [some (0, true, 11), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1340 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1340 false = [some (0, true, 11), none, some (0, true, 101)] := by rfl

def vec_x_1341 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1341 false = [none, some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_1342 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1342 false = [some (0, true, 11), none, some (0, true, 105)] := by rfl

def vec_x_1343 : Zunno.GameState :=
  { human := [3], agent := [11, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1343 false = [none, some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_1344 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1344 false = [some (0, true, 11), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1345 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1345 false = [none, some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1346 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1346 false = [some (0, true, 11), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1347 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1347 false = [some (0, true, 11), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1348 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1348 false = [some (0, true, 11), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1349 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1349 false = [none, some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1350 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1350 false = [some (0, true, 11), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1351 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1351 false = [none, some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1352 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1352 false = [some (0, true, 11), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1353 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1353 false = [none, some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1354 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1354 false = [some (0, true, 11), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1355 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1355 false = [some (0, true, 11), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1356 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1356 false = [some (0, true, 11), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1357 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1357 false = [none, some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1358 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1358 false = [some (0, true, 11), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1359 : Zunno.GameState :=
  { human := [3], agent := [11, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1359 false = [none, some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1360 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1360 false = [some (0, true, 11), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1361 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1361 false = [none, some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1362 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1362 false = [some (0, true, 11), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1363 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1363 false = [some (0, true, 11), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1364 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1364 false = [some (0, true, 11), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1365 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1365 false = [none, some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1366 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1366 false = [some (0, true, 11), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1367 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1367 false = [none, some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1368 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1368 false = [some (0, true, 11), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1369 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1369 false = [none, some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1370 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1370 false = [some (0, true, 11), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1371 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1371 false = [some (0, true, 11), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1372 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1372 false = [some (0, true, 11), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1373 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1373 false = [none, some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1374 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1374 false = [some (0, true, 11), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1375 : Zunno.GameState :=
  { human := [3], agent := [11, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1375 false = [none, some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1376 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1376 false = [some (0, false, 21), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1377 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1377 false = [none, some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1378 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1378 false = [some (0, false, 21), some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1379 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1379 false = [none, none, some (0, true, 11)] := by rfl

def vec_x_1380 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1380 false = [some (0, false, 21), some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1381 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1381 false = [some (0, false, 21), none, some (0, true, 21)] := by rfl

def vec_x_1382 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1382 false = [some (0, false, 21), some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1383 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1383 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1384 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1384 false = [some (0, false, 21), some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1385 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1385 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1386 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1386 false = [some (0, false, 21), some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1387 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1387 false = [none, none, some (0, true, 36)] := by rfl

def vec_x_1388 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1388 false = [some (0, false, 21), some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1389 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1389 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1390 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1390 false = [some (0, false, 21), some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1391 : Zunno.GameState :=
  { human := [3], agent := [21, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1391 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1392 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1392 false = [some (0, false, 21), some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1393 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1393 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1394 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1394 false = [some (0, false, 21), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1395 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1395 false = [none, some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1396 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1396 false = [some (0, false, 21), some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1397 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1397 false = [some (0, false, 21), none, some (0, true, 21)] := by rfl

def vec_x_1398 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1398 false = [some (0, false, 21), some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1399 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1399 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1400 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1400 false = [some (0, false, 21), some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1401 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1401 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1402 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1402 false = [some (0, false, 21), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1403 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1403 false = [none, some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1404 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1404 false = [some (0, false, 21), some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1405 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1405 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1406 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1406 false = [some (0, false, 21), some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1407 : Zunno.GameState :=
  { human := [3], agent := [21, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1407 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1408 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1408 false = [some (0, false, 21), some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1409 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1409 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1410 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1410 false = [some (0, false, 21), some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1411 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1411 false = [none, none, some (0, true, 11)] := by rfl

def vec_x_1412 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1412 false = [some (0, false, 21), some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1413 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1413 false = [some (0, false, 21), none, some (0, true, 21)] := by rfl

def vec_x_1414 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1414 false = [some (0, false, 21), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1415 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1415 false = [none, some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1416 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1416 false = [some (0, false, 21), some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1417 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1417 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1418 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1418 false = [some (0, false, 21), some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1419 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1419 false = [none, none, some (0, true, 36)] := by rfl

def vec_x_1420 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1420 false = [some (0, false, 21), some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1421 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1421 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1422 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1422 false = [some (0, false, 21), some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1423 : Zunno.GameState :=
  { human := [3], agent := [21, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1423 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1424 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1424 false = [some (0, false, 21), none, some (0, true, 2)] := by rfl

def vec_x_1425 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1425 false = [none, some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_1426 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1426 false = [some (0, false, 21), none, some (0, true, 11)] := by rfl

def vec_x_1427 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1427 false = [none, some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_1428 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1428 false = [some (0, false, 21), none, some (0, true, 21)] := by rfl

def vec_x_1429 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1429 false = [some (0, false, 21), some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_1430 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1430 false = [some (0, false, 21), none, some (0, true, 24)] := by rfl

def vec_x_1431 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1431 false = [none, some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_1432 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1432 false = [some (0, false, 21), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1433 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1433 false = [none, some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1434 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1434 false = [some (0, false, 21), none, some (0, true, 36)] := by rfl

def vec_x_1435 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1435 false = [none, some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_1436 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1436 false = [some (0, false, 21), none, some (0, true, 101)] := by rfl

def vec_x_1437 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1437 false = [none, some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_1438 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1438 false = [some (0, false, 21), none, some (0, true, 105)] := by rfl

def vec_x_1439 : Zunno.GameState :=
  { human := [3], agent := [21, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1439 false = [none, some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_1440 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1440 false = [some (0, false, 21), none, some (0, true, 2)] := by rfl

def vec_x_1441 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1441 false = [none, some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_1442 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1442 false = [some (0, false, 21), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1443 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1443 false = [none, some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1444 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1444 false = [some (0, false, 21), none, some (0, true, 21)] := by rfl

def vec_x_1445 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1445 false = [some (0, false, 21), some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_1446 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1446 false = [some (0, false, 21), none, some (0, true, 24)] := by rfl

def vec_x_1447 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1447 false = [none, some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_1448 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1448 false = [some (0, false, 21), none, some (0, true, 26)] := by rfl

def vec_x_1449 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1449 false = [none, some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_1450 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1450 false = [some (0, false, 21), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1451 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1451 false = [none, some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1452 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1452 false = [some (0, false, 21), none, some (0, true, 101)] := by rfl

def vec_x_1453 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1453 false = [none, some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_1454 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1454 false = [some (0, false, 21), none, some (0, true, 105)] := by rfl

def vec_x_1455 : Zunno.GameState :=
  { human := [3], agent := [21, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1455 false = [none, some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_1456 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1456 false = [some (0, false, 21), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1457 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1457 false = [none, some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1458 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1458 false = [some (0, false, 21), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1459 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1459 false = [none, some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1460 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1460 false = [some (0, false, 21), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1461 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1461 false = [some (0, false, 21), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1462 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1462 false = [some (0, false, 21), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1463 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1463 false = [none, some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1464 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1464 false = [some (0, false, 21), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1465 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1465 false = [none, some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1466 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1466 false = [some (0, false, 21), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1467 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1467 false = [none, some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1468 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1468 false = [some (0, false, 21), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1469 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1469 false = [none, some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1470 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1470 false = [some (0, false, 21), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1471 : Zunno.GameState :=
  { human := [3], agent := [21, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1471 false = [none, some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1472 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1472 false = [some (0, false, 21), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1473 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1473 false = [none, some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1474 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1474 false = [some (0, false, 21), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1475 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1475 false = [none, some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1476 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1476 false = [some (0, false, 21), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1477 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1477 false = [some (0, false, 21), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1478 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1478 false = [some (0, false, 21), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1479 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1479 false = [none, some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1480 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1480 false = [some (0, false, 21), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1481 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1481 false = [none, some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1482 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1482 false = [some (0, false, 21), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1483 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1483 false = [none, some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1484 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1484 false = [some (0, false, 21), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1485 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1485 false = [none, some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1486 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1486 false = [some (0, false, 21), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1487 : Zunno.GameState :=
  { human := [3], agent := [21, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1487 false = [none, some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1488 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1488 false = [some (0, false, 24), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1489 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1489 false = [none, some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1490 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1490 false = [some (0, false, 24), some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1491 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1491 false = [none, none, some (0, true, 11)] := by rfl

def vec_x_1492 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1492 false = [some (0, false, 24), some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1493 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1493 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1494 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1494 false = [some (0, false, 24), some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1495 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1495 false = [some (0, false, 24), none, some (0, true, 24)] := by rfl

def vec_x_1496 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1496 false = [some (0, false, 24), some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1497 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1497 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1498 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1498 false = [some (0, false, 24), some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1499 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1499 false = [none, none, some (0, true, 36)] := by rfl

def vec_x_1500 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1500 false = [some (0, false, 24), some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1501 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1501 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1502 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1502 false = [some (0, false, 24), some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1503 : Zunno.GameState :=
  { human := [3], agent := [24, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1503 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1504 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1504 false = [some (0, false, 24), some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1505 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1505 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1506 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1506 false = [some (0, false, 24), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1507 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1507 false = [none, some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1508 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1508 false = [some (0, false, 24), some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1509 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1509 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1510 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1510 false = [some (0, false, 24), some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1511 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1511 false = [some (0, false, 24), none, some (0, true, 24)] := by rfl

def vec_x_1512 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1512 false = [some (0, false, 24), some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1513 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1513 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1514 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1514 false = [some (0, false, 24), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1515 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1515 false = [none, some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1516 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1516 false = [some (0, false, 24), some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1517 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1517 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1518 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1518 false = [some (0, false, 24), some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1519 : Zunno.GameState :=
  { human := [3], agent := [24, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1519 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1520 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1520 false = [some (0, false, 24), some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1521 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1521 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1522 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1522 false = [some (0, false, 24), some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1523 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1523 false = [none, none, some (0, true, 11)] := by rfl

def vec_x_1524 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1524 false = [some (0, false, 24), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1525 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1525 false = [none, some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1526 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1526 false = [some (0, false, 24), some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1527 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1527 false = [some (0, false, 24), none, some (0, true, 24)] := by rfl

def vec_x_1528 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1528 false = [some (0, false, 24), some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1529 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1529 false = [none, none, some (0, true, 26)] := by rfl

def vec_x_1530 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1530 false = [some (0, false, 24), some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1531 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1531 false = [none, none, some (0, true, 36)] := by rfl

def vec_x_1532 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1532 false = [some (0, false, 24), some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1533 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1533 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1534 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1534 false = [some (0, false, 24), some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1535 : Zunno.GameState :=
  { human := [3], agent := [24, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1535 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1536 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1536 false = [some (0, false, 24), none, some (0, true, 2)] := by rfl

def vec_x_1537 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1537 false = [none, some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_1538 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1538 false = [some (0, false, 24), none, some (0, true, 11)] := by rfl

def vec_x_1539 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1539 false = [none, some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_1540 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1540 false = [some (0, false, 24), none, some (0, true, 21)] := by rfl

def vec_x_1541 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1541 false = [none, some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_1542 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1542 false = [some (0, false, 24), none, some (0, true, 24)] := by rfl

def vec_x_1543 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1543 false = [some (0, false, 24), some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_1544 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1544 false = [some (0, false, 24), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1545 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1545 false = [none, some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1546 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1546 false = [some (0, false, 24), none, some (0, true, 36)] := by rfl

def vec_x_1547 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1547 false = [none, some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_1548 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1548 false = [some (0, false, 24), none, some (0, true, 101)] := by rfl

def vec_x_1549 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1549 false = [none, some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_1550 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1550 false = [some (0, false, 24), none, some (0, true, 105)] := by rfl

def vec_x_1551 : Zunno.GameState :=
  { human := [3], agent := [24, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1551 false = [none, some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_1552 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1552 false = [some (0, false, 24), none, some (0, true, 2)] := by rfl

def vec_x_1553 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1553 false = [none, some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_1554 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1554 false = [some (0, false, 24), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1555 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1555 false = [none, some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1556 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1556 false = [some (0, false, 24), none, some (0, true, 21)] := by rfl

def vec_x_1557 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1557 false = [none, some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_1558 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1558 false = [some (0, false, 24), none, some (0, true, 24)] := by rfl

def vec_x_1559 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1559 false = [some (0, false, 24), some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_1560 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1560 false = [some (0, false, 24), none, some (0, true, 26)] := by rfl

def vec_x_1561 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1561 false = [none, some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_1562 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1562 false = [some (0, false, 24), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1563 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1563 false = [none, some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1564 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1564 false = [some (0, false, 24), none, some (0, true, 101)] := by rfl

def vec_x_1565 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1565 false = [none, some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_1566 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1566 false = [some (0, false, 24), none, some (0, true, 105)] := by rfl

def vec_x_1567 : Zunno.GameState :=
  { human := [3], agent := [24, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1567 false = [none, some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_1568 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1568 false = [some (0, false, 24), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1569 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1569 false = [none, some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1570 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1570 false = [some (0, false, 24), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1571 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1571 false = [none, some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1572 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1572 false = [some (0, false, 24), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1573 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1573 false = [none, some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1574 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1574 false = [some (0, false, 24), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1575 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1575 false = [some (0, false, 24), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1576 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1576 false = [some (0, false, 24), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1577 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1577 false = [none, some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1578 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1578 false = [some (0, false, 24), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1579 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1579 false = [none, some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1580 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1580 false = [some (0, false, 24), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1581 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1581 false = [none, some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1582 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1582 false = [some (0, false, 24), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1583 : Zunno.GameState :=
  { human := [3], agent := [24, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1583 false = [none, some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1584 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1584 false = [some (0, false, 24), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1585 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1585 false = [none, some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1586 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1586 false = [some (0, false, 24), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1587 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1587 false = [none, some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1588 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1588 false = [some (0, false, 24), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1589 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1589 false = [none, some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1590 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1590 false = [some (0, false, 24), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1591 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1591 false = [some (0, false, 24), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1592 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1592 false = [some (0, false, 24), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1593 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1593 false = [none, some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1594 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1594 false = [some (0, false, 24), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1595 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1595 false = [none, some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1596 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1596 false = [some (0, false, 24), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1597 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1597 false = [none, some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1598 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1598 false = [some (0, false, 24), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1599 : Zunno.GameState :=
  { human := [3], agent := [24, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1599 false = [none, some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1600 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1600 false = [none, some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1601 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1601 false = [some (0, true, 26), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1602 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1602 false = [none, some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1603 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1603 false = [some (0, true, 26), none, some (0, true, 11)] := by rfl

def vec_x_1604 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1604 false = [none, some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1605 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1605 false = [some (0, true, 26), none, some (0, true, 21)] := by rfl

def vec_x_1606 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1606 false = [none, some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1607 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1607 false = [some (0, true, 26), none, some (0, true, 24)] := by rfl

def vec_x_1608 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1608 false = [some (0, true, 26), some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1609 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1609 false = [some (0, true, 26), none, some (0, true, 26)] := by rfl

def vec_x_1610 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1610 false = [none, some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1611 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1611 false = [some (0, true, 26), none, some (0, true, 36)] := by rfl

def vec_x_1612 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1612 false = [none, some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1613 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1613 false = [some (0, true, 26), none, some (0, true, 101)] := by rfl

def vec_x_1614 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1614 false = [none, some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1615 : Zunno.GameState :=
  { human := [3], agent := [26, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1615 false = [some (0, true, 26), none, some (0, true, 105)] := by rfl

def vec_x_1616 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1616 false = [none, some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1617 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1617 false = [some (0, true, 26), none, some (0, true, 2)] := by rfl

def vec_x_1618 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1618 false = [none, some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1619 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1619 false = [some (0, true, 26), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1620 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1620 false = [none, some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1621 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1621 false = [some (0, true, 26), none, some (0, true, 21)] := by rfl

def vec_x_1622 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1622 false = [none, some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1623 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1623 false = [some (0, true, 26), none, some (0, true, 24)] := by rfl

def vec_x_1624 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1624 false = [some (0, true, 26), some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1625 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1625 false = [some (0, true, 26), none, some (0, true, 26)] := by rfl

def vec_x_1626 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1626 false = [none, some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1627 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1627 false = [some (0, true, 26), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1628 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1628 false = [none, some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1629 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1629 false = [some (0, true, 26), none, some (0, true, 101)] := by rfl

def vec_x_1630 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1630 false = [none, some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1631 : Zunno.GameState :=
  { human := [3], agent := [26, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1631 false = [some (0, true, 26), none, some (0, true, 105)] := by rfl

def vec_x_1632 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1632 false = [none, some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1633 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1633 false = [some (0, true, 26), none, some (0, true, 2)] := by rfl

def vec_x_1634 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1634 false = [none, some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1635 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1635 false = [some (0, true, 26), none, some (0, true, 11)] := by rfl

def vec_x_1636 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1636 false = [none, some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1637 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1637 false = [some (0, true, 26), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1638 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1638 false = [none, some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1639 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1639 false = [some (0, true, 26), none, some (0, true, 24)] := by rfl

def vec_x_1640 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1640 false = [some (0, true, 26), some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1641 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1641 false = [some (0, true, 26), none, some (0, true, 26)] := by rfl

def vec_x_1642 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1642 false = [none, some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1643 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1643 false = [some (0, true, 26), none, some (0, true, 36)] := by rfl

def vec_x_1644 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1644 false = [none, some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1645 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1645 false = [some (0, true, 26), none, some (0, true, 101)] := by rfl

def vec_x_1646 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1646 false = [none, some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1647 : Zunno.GameState :=
  { human := [3], agent := [26, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1647 false = [some (0, true, 26), none, some (0, true, 105)] := by rfl

def vec_x_1648 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1648 false = [none, some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1649 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1649 false = [some (0, true, 26), none, some (0, true, 2)] := by rfl

def vec_x_1650 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1650 false = [none, some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1651 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1651 false = [some (0, true, 26), none, some (0, true, 11)] := by rfl

def vec_x_1652 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1652 false = [none, some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1653 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1653 false = [some (0, true, 26), none, some (0, true, 21)] := by rfl

def vec_x_1654 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1654 false = [none, some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1655 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1655 false = [some (0, true, 26), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1656 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1656 false = [some (0, true, 26), some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1657 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1657 false = [some (0, true, 26), none, some (0, true, 26)] := by rfl

def vec_x_1658 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1658 false = [none, some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1659 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1659 false = [some (0, true, 26), none, some (0, true, 36)] := by rfl

def vec_x_1660 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1660 false = [none, some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1661 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1661 false = [some (0, true, 26), none, some (0, true, 101)] := by rfl

def vec_x_1662 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1662 false = [none, some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1663 : Zunno.GameState :=
  { human := [3], agent := [26, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1663 false = [some (0, true, 26), none, some (0, true, 105)] := by rfl

def vec_x_1664 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1664 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1665 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1665 false = [some (0, true, 26), some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_1666 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1666 false = [none, some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1667 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1667 false = [some (0, true, 26), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1668 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1668 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1669 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1669 false = [some (0, true, 26), some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_1670 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1670 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1671 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1671 false = [some (0, true, 26), some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_1672 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1672 false = [some (0, true, 26), none, some (0, true, 26)] := by rfl

def vec_x_1673 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1673 false = [some (0, true, 26), some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_1674 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1674 false = [none, some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1675 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1675 false = [some (0, true, 26), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1676 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1676 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1677 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1677 false = [some (0, true, 26), some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_1678 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1678 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1679 : Zunno.GameState :=
  { human := [3], agent := [26, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1679 false = [some (0, true, 26), some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_1680 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1680 false = [none, some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1681 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1681 false = [some (0, true, 26), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1682 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1682 false = [none, some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1683 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1683 false = [some (0, true, 26), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1684 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1684 false = [none, some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1685 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1685 false = [some (0, true, 26), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1686 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1686 false = [none, some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1687 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1687 false = [some (0, true, 26), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1688 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1688 false = [some (0, true, 26), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1689 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1689 false = [some (0, true, 26), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1690 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1690 false = [none, some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1691 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1691 false = [some (0, true, 26), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1692 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1692 false = [none, some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1693 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1693 false = [some (0, true, 26), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1694 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1694 false = [none, some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1695 : Zunno.GameState :=
  { human := [3], agent := [26, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1695 false = [some (0, true, 26), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1696 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1696 false = [none, some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1697 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1697 false = [some (0, true, 26), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1698 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1698 false = [none, some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1699 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1699 false = [some (0, true, 26), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1700 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1700 false = [none, some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1701 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1701 false = [some (0, true, 26), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1702 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1702 false = [none, some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1703 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1703 false = [some (0, true, 26), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1704 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1704 false = [some (0, true, 26), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1705 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1705 false = [some (0, true, 26), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1706 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1706 false = [none, some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1707 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1707 false = [some (0, true, 26), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1708 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1708 false = [none, some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1709 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1709 false = [some (0, true, 26), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1710 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1710 false = [none, some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1711 : Zunno.GameState :=
  { human := [3], agent := [26, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1711 false = [some (0, true, 26), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1712 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1712 false = [none, some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1713 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1713 false = [some (0, true, 36), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1714 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1714 false = [some (0, true, 36), some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1715 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1715 false = [some (0, true, 36), none, some (0, true, 11)] := by rfl

def vec_x_1716 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1716 false = [none, some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1717 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1717 false = [some (0, true, 36), none, some (0, true, 21)] := by rfl

def vec_x_1718 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1718 false = [none, some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1719 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1719 false = [some (0, true, 36), none, some (0, true, 24)] := by rfl

def vec_x_1720 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1720 false = [none, some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1721 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1721 false = [some (0, true, 36), none, some (0, true, 26)] := by rfl

def vec_x_1722 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1722 false = [some (0, true, 36), some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1723 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1723 false = [some (0, true, 36), none, some (0, true, 36)] := by rfl

def vec_x_1724 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1724 false = [none, some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1725 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1725 false = [some (0, true, 36), none, some (0, true, 101)] := by rfl

def vec_x_1726 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1726 false = [none, some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1727 : Zunno.GameState :=
  { human := [3], agent := [36, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1727 false = [some (0, true, 36), none, some (0, true, 105)] := by rfl

def vec_x_1728 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1728 false = [none, some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1729 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1729 false = [some (0, true, 36), none, some (0, true, 2)] := by rfl

def vec_x_1730 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1730 false = [some (0, true, 36), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1731 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1731 false = [some (0, true, 36), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1732 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1732 false = [none, some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1733 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1733 false = [some (0, true, 36), none, some (0, true, 21)] := by rfl

def vec_x_1734 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1734 false = [none, some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1735 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1735 false = [some (0, true, 36), none, some (0, true, 24)] := by rfl

def vec_x_1736 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1736 false = [none, some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1737 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1737 false = [some (0, true, 36), none, some (0, true, 26)] := by rfl

def vec_x_1738 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1738 false = [some (0, true, 36), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1739 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1739 false = [some (0, true, 36), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1740 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1740 false = [none, some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1741 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1741 false = [some (0, true, 36), none, some (0, true, 101)] := by rfl

def vec_x_1742 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1742 false = [none, some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1743 : Zunno.GameState :=
  { human := [3], agent := [36, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1743 false = [some (0, true, 36), none, some (0, true, 105)] := by rfl

def vec_x_1744 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1744 false = [none, some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1745 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1745 false = [some (0, true, 36), none, some (0, true, 2)] := by rfl

def vec_x_1746 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1746 false = [some (0, true, 36), some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1747 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1747 false = [some (0, true, 36), none, some (0, true, 11)] := by rfl

def vec_x_1748 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1748 false = [none, some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1749 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1749 false = [some (0, true, 36), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1750 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1750 false = [none, some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1751 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1751 false = [some (0, true, 36), none, some (0, true, 24)] := by rfl

def vec_x_1752 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1752 false = [none, some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1753 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1753 false = [some (0, true, 36), none, some (0, true, 26)] := by rfl

def vec_x_1754 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1754 false = [some (0, true, 36), some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1755 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1755 false = [some (0, true, 36), none, some (0, true, 36)] := by rfl

def vec_x_1756 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1756 false = [none, some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1757 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1757 false = [some (0, true, 36), none, some (0, true, 101)] := by rfl

def vec_x_1758 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1758 false = [none, some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1759 : Zunno.GameState :=
  { human := [3], agent := [36, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1759 false = [some (0, true, 36), none, some (0, true, 105)] := by rfl

def vec_x_1760 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1760 false = [none, some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1761 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1761 false = [some (0, true, 36), none, some (0, true, 2)] := by rfl

def vec_x_1762 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1762 false = [some (0, true, 36), some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1763 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1763 false = [some (0, true, 36), none, some (0, true, 11)] := by rfl

def vec_x_1764 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1764 false = [none, some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1765 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1765 false = [some (0, true, 36), none, some (0, true, 21)] := by rfl

def vec_x_1766 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1766 false = [none, some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1767 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1767 false = [some (0, true, 36), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1768 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1768 false = [none, some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1769 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1769 false = [some (0, true, 36), none, some (0, true, 26)] := by rfl

def vec_x_1770 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1770 false = [some (0, true, 36), some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1771 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1771 false = [some (0, true, 36), none, some (0, true, 36)] := by rfl

def vec_x_1772 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1772 false = [none, some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1773 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1773 false = [some (0, true, 36), none, some (0, true, 101)] := by rfl

def vec_x_1774 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1774 false = [none, some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1775 : Zunno.GameState :=
  { human := [3], agent := [36, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1775 false = [some (0, true, 36), none, some (0, true, 105)] := by rfl

def vec_x_1776 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1776 false = [none, none, some (0, true, 2)] := by rfl

def vec_x_1777 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1777 false = [some (0, true, 36), some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_1778 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1778 false = [some (0, true, 36), none, some (0, true, 11)] := by rfl

def vec_x_1779 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1779 false = [some (0, true, 36), some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_1780 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1780 false = [none, none, some (0, true, 21)] := by rfl

def vec_x_1781 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1781 false = [some (0, true, 36), some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_1782 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1782 false = [none, none, some (0, true, 24)] := by rfl

def vec_x_1783 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1783 false = [some (0, true, 36), some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_1784 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1784 false = [none, some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1785 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1785 false = [some (0, true, 36), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1786 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1786 false = [some (0, true, 36), none, some (0, true, 36)] := by rfl

def vec_x_1787 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1787 false = [some (0, true, 36), some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_1788 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1788 false = [none, none, some (0, true, 101)] := by rfl

def vec_x_1789 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1789 false = [some (0, true, 36), some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_1790 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1790 false = [none, none, some (0, true, 105)] := by rfl

def vec_x_1791 : Zunno.GameState :=
  { human := [3], agent := [36, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1791 false = [some (0, true, 36), some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_1792 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1792 false = [none, some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1793 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1793 false = [some (0, true, 36), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_1794 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1794 false = [some (0, true, 36), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1795 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1795 false = [some (0, true, 36), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_1796 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1796 false = [none, some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1797 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1797 false = [some (0, true, 36), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_1798 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1798 false = [none, some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1799 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1799 false = [some (0, true, 36), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_1800 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1800 false = [none, some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1801 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1801 false = [some (0, true, 36), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_1802 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1802 false = [some (0, true, 36), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1803 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1803 false = [some (0, true, 36), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_1804 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1804 false = [none, some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1805 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1805 false = [some (0, true, 36), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_1806 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1806 false = [none, some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1807 : Zunno.GameState :=
  { human := [3], agent := [36, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1807 false = [some (0, true, 36), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_1808 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1808 false = [none, some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1809 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1809 false = [some (0, true, 36), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1810 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1810 false = [some (0, true, 36), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1811 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1811 false = [some (0, true, 36), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1812 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1812 false = [none, some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1813 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1813 false = [some (0, true, 36), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1814 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1814 false = [none, some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1815 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1815 false = [some (0, true, 36), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1816 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1816 false = [none, some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1817 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1817 false = [some (0, true, 36), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1818 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1818 false = [some (0, true, 36), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1819 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1819 false = [some (0, true, 36), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1820 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1820 false = [none, some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1821 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1821 false = [some (0, true, 36), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1822 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1822 false = [none, some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1823 : Zunno.GameState :=
  { human := [3], agent := [36, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1823 false = [some (0, true, 36), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1824 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1824 false = [some (0, true, 101), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1825 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1825 false = [some (0, true, 101), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1826 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1826 false = [some (0, true, 101), some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1827 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1827 false = [some (0, true, 101), none, some (0, true, 11)] := by rfl

def vec_x_1828 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1828 false = [some (0, true, 101), some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1829 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1829 false = [some (0, true, 101), none, some (0, true, 21)] := by rfl

def vec_x_1830 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1830 false = [some (0, true, 101), some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1831 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1831 false = [some (0, true, 101), none, some (0, true, 24)] := by rfl

def vec_x_1832 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1832 false = [some (0, true, 101), some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1833 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1833 false = [some (0, true, 101), none, some (0, true, 26)] := by rfl

def vec_x_1834 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1834 false = [some (0, true, 101), some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1835 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1835 false = [some (0, true, 101), none, some (0, true, 36)] := by rfl

def vec_x_1836 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1836 false = [some (0, true, 101), some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1837 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1837 false = [some (0, true, 101), none, some (0, true, 101)] := by rfl

def vec_x_1838 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1838 false = [some (0, true, 101), some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1839 : Zunno.GameState :=
  { human := [3], agent := [101, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1839 false = [some (0, true, 101), none, some (0, true, 105)] := by rfl

def vec_x_1840 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1840 false = [some (0, true, 101), some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1841 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1841 false = [some (0, true, 101), none, some (0, true, 2)] := by rfl

def vec_x_1842 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1842 false = [some (0, true, 101), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1843 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1843 false = [some (0, true, 101), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1844 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1844 false = [some (0, true, 101), some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1845 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1845 false = [some (0, true, 101), none, some (0, true, 21)] := by rfl

def vec_x_1846 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1846 false = [some (0, true, 101), some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1847 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1847 false = [some (0, true, 101), none, some (0, true, 24)] := by rfl

def vec_x_1848 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1848 false = [some (0, true, 101), some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1849 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1849 false = [some (0, true, 101), none, some (0, true, 26)] := by rfl

def vec_x_1850 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1850 false = [some (0, true, 101), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1851 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1851 false = [some (0, true, 101), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1852 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1852 false = [some (0, true, 101), some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1853 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1853 false = [some (0, true, 101), none, some (0, true, 101)] := by rfl

def vec_x_1854 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1854 false = [some (0, true, 101), some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1855 : Zunno.GameState :=
  { human := [3], agent := [101, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1855 false = [some (0, true, 101), none, some (0, true, 105)] := by rfl

def vec_x_1856 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1856 false = [some (0, true, 101), some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1857 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1857 false = [some (0, true, 101), none, some (0, true, 2)] := by rfl

def vec_x_1858 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1858 false = [some (0, true, 101), some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1859 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1859 false = [some (0, true, 101), none, some (0, true, 11)] := by rfl

def vec_x_1860 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1860 false = [some (0, true, 101), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1861 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1861 false = [some (0, true, 101), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1862 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1862 false = [some (0, true, 101), some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1863 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1863 false = [some (0, true, 101), none, some (0, true, 24)] := by rfl

def vec_x_1864 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1864 false = [some (0, true, 101), some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1865 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1865 false = [some (0, true, 101), none, some (0, true, 26)] := by rfl

def vec_x_1866 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1866 false = [some (0, true, 101), some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1867 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1867 false = [some (0, true, 101), none, some (0, true, 36)] := by rfl

def vec_x_1868 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1868 false = [some (0, true, 101), some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1869 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1869 false = [some (0, true, 101), none, some (0, true, 101)] := by rfl

def vec_x_1870 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1870 false = [some (0, true, 101), some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1871 : Zunno.GameState :=
  { human := [3], agent := [101, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1871 false = [some (0, true, 101), none, some (0, true, 105)] := by rfl

def vec_x_1872 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1872 false = [some (0, true, 101), some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1873 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1873 false = [some (0, true, 101), none, some (0, true, 2)] := by rfl

def vec_x_1874 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1874 false = [some (0, true, 101), some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1875 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1875 false = [some (0, true, 101), none, some (0, true, 11)] := by rfl

def vec_x_1876 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1876 false = [some (0, true, 101), some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1877 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1877 false = [some (0, true, 101), none, some (0, true, 21)] := by rfl

def vec_x_1878 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1878 false = [some (0, true, 101), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1879 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1879 false = [some (0, true, 101), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1880 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1880 false = [some (0, true, 101), some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1881 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1881 false = [some (0, true, 101), none, some (0, true, 26)] := by rfl

def vec_x_1882 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1882 false = [some (0, true, 101), some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1883 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1883 false = [some (0, true, 101), none, some (0, true, 36)] := by rfl

def vec_x_1884 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1884 false = [some (0, true, 101), some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1885 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1885 false = [some (0, true, 101), none, some (0, true, 101)] := by rfl

def vec_x_1886 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1886 false = [some (0, true, 101), some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1887 : Zunno.GameState :=
  { human := [3], agent := [101, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1887 false = [some (0, true, 101), none, some (0, true, 105)] := by rfl

def vec_x_1888 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1888 false = [some (0, true, 101), none, some (0, true, 2)] := by rfl

def vec_x_1889 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1889 false = [some (0, true, 101), some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_1890 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1890 false = [some (0, true, 101), none, some (0, true, 11)] := by rfl

def vec_x_1891 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1891 false = [some (0, true, 101), some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_1892 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1892 false = [some (0, true, 101), none, some (0, true, 21)] := by rfl

def vec_x_1893 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1893 false = [some (0, true, 101), some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_1894 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1894 false = [some (0, true, 101), none, some (0, true, 24)] := by rfl

def vec_x_1895 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1895 false = [some (0, true, 101), some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_1896 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1896 false = [some (0, true, 101), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1897 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1897 false = [some (0, true, 101), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_1898 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1898 false = [some (0, true, 101), none, some (0, true, 36)] := by rfl

def vec_x_1899 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1899 false = [some (0, true, 101), some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_1900 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1900 false = [some (0, true, 101), none, some (0, true, 101)] := by rfl

def vec_x_1901 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1901 false = [some (0, true, 101), some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_1902 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1902 false = [some (0, true, 101), none, some (0, true, 105)] := by rfl

def vec_x_1903 : Zunno.GameState :=
  { human := [3], agent := [101, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1903 false = [some (0, true, 101), some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_1904 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1904 false = [some (0, true, 101), none, some (0, true, 2)] := by rfl

def vec_x_1905 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1905 false = [some (0, true, 101), some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_1906 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1906 false = [some (0, true, 101), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1907 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1907 false = [some (0, true, 101), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_1908 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1908 false = [some (0, true, 101), none, some (0, true, 21)] := by rfl

def vec_x_1909 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1909 false = [some (0, true, 101), some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_1910 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1910 false = [some (0, true, 101), none, some (0, true, 24)] := by rfl

def vec_x_1911 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1911 false = [some (0, true, 101), some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_1912 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1912 false = [some (0, true, 101), none, some (0, true, 26)] := by rfl

def vec_x_1913 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1913 false = [some (0, true, 101), some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_1914 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1914 false = [some (0, true, 101), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1915 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1915 false = [some (0, true, 101), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_1916 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1916 false = [some (0, true, 101), none, some (0, true, 101)] := by rfl

def vec_x_1917 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1917 false = [some (0, true, 101), some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_1918 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1918 false = [some (0, true, 101), none, some (0, true, 105)] := by rfl

def vec_x_1919 : Zunno.GameState :=
  { human := [3], agent := [101, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1919 false = [some (0, true, 101), some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_1920 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1920 false = [some (0, true, 101), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1921 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1921 false = [some (0, true, 101), some (0, false, 105), some (0, true, 2)] := by rfl

def vec_x_1922 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1922 false = [some (0, true, 101), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1923 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1923 false = [some (0, true, 101), some (0, false, 105), some (0, true, 11)] := by rfl

def vec_x_1924 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1924 false = [some (0, true, 101), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1925 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1925 false = [some (0, true, 101), some (0, false, 105), some (0, true, 21)] := by rfl

def vec_x_1926 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1926 false = [some (0, true, 101), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1927 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1927 false = [some (0, true, 101), some (0, false, 105), some (0, true, 24)] := by rfl

def vec_x_1928 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1928 false = [some (0, true, 101), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1929 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1929 false = [some (0, true, 101), some (0, false, 105), some (0, true, 26)] := by rfl

def vec_x_1930 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1930 false = [some (0, true, 101), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1931 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1931 false = [some (0, true, 101), some (0, false, 105), some (0, true, 36)] := by rfl

def vec_x_1932 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1932 false = [some (0, true, 101), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1933 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1933 false = [some (0, true, 101), some (0, false, 105), some (0, true, 101)] := by rfl

def vec_x_1934 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1934 false = [some (0, true, 101), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1935 : Zunno.GameState :=
  { human := [3], agent := [101, 105], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1935 false = [some (0, true, 101), some (0, false, 105), some (0, true, 105)] := by rfl

def vec_x_1936 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1936 false = [some (0, false, 105), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1937 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1937 false = [some (0, false, 105), some (0, true, 2), some (0, true, 2)] := by rfl

def vec_x_1938 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1938 false = [some (0, false, 105), some (0, true, 2), some (0, true, 11)] := by rfl

def vec_x_1939 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1939 false = [some (0, false, 105), none, some (0, true, 11)] := by rfl

def vec_x_1940 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1940 false = [some (0, false, 105), some (0, true, 2), some (0, true, 21)] := by rfl

def vec_x_1941 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1941 false = [some (0, false, 105), none, some (0, true, 21)] := by rfl

def vec_x_1942 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1942 false = [some (0, false, 105), some (0, true, 2), some (0, true, 24)] := by rfl

def vec_x_1943 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1943 false = [some (0, false, 105), none, some (0, true, 24)] := by rfl

def vec_x_1944 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1944 false = [some (0, false, 105), some (0, true, 2), some (0, true, 26)] := by rfl

def vec_x_1945 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1945 false = [some (0, false, 105), none, some (0, true, 26)] := by rfl

def vec_x_1946 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1946 false = [some (0, false, 105), some (0, true, 2), some (0, true, 36)] := by rfl

def vec_x_1947 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1947 false = [some (0, false, 105), none, some (0, true, 36)] := by rfl

def vec_x_1948 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1948 false = [some (0, false, 105), some (0, true, 2), some (0, true, 101)] := by rfl

def vec_x_1949 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1949 false = [some (0, false, 105), none, some (0, true, 101)] := by rfl

def vec_x_1950 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1950 false = [some (0, false, 105), some (0, true, 2), some (0, true, 105)] := by rfl

def vec_x_1951 : Zunno.GameState :=
  { human := [3], agent := [105, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1951 false = [some (0, false, 105), none, some (0, true, 105)] := by rfl

def vec_x_1952 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1952 false = [some (0, false, 105), some (0, true, 11), some (0, true, 2)] := by rfl

def vec_x_1953 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1953 false = [some (0, false, 105), none, some (0, true, 2)] := by rfl

def vec_x_1954 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1954 false = [some (0, false, 105), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1955 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1955 false = [some (0, false, 105), some (0, true, 11), some (0, true, 11)] := by rfl

def vec_x_1956 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1956 false = [some (0, false, 105), some (0, true, 11), some (0, true, 21)] := by rfl

def vec_x_1957 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1957 false = [some (0, false, 105), none, some (0, true, 21)] := by rfl

def vec_x_1958 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1958 false = [some (0, false, 105), some (0, true, 11), some (0, true, 24)] := by rfl

def vec_x_1959 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1959 false = [some (0, false, 105), none, some (0, true, 24)] := by rfl

def vec_x_1960 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1960 false = [some (0, false, 105), some (0, true, 11), some (0, true, 26)] := by rfl

def vec_x_1961 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1961 false = [some (0, false, 105), none, some (0, true, 26)] := by rfl

def vec_x_1962 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1962 false = [some (0, false, 105), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1963 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1963 false = [some (0, false, 105), some (0, true, 11), some (0, true, 36)] := by rfl

def vec_x_1964 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1964 false = [some (0, false, 105), some (0, true, 11), some (0, true, 101)] := by rfl

def vec_x_1965 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1965 false = [some (0, false, 105), none, some (0, true, 101)] := by rfl

def vec_x_1966 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1966 false = [some (0, false, 105), some (0, true, 11), some (0, true, 105)] := by rfl

def vec_x_1967 : Zunno.GameState :=
  { human := [3], agent := [105, 11], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1967 false = [some (0, false, 105), none, some (0, true, 105)] := by rfl

def vec_x_1968 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1968 false = [some (0, false, 105), some (0, false, 21), some (0, true, 2)] := by rfl

def vec_x_1969 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1969 false = [some (0, false, 105), none, some (0, true, 2)] := by rfl

def vec_x_1970 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1970 false = [some (0, false, 105), some (0, false, 21), some (0, true, 11)] := by rfl

def vec_x_1971 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1971 false = [some (0, false, 105), none, some (0, true, 11)] := by rfl

def vec_x_1972 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1972 false = [some (0, false, 105), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1973 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1973 false = [some (0, false, 105), some (0, false, 21), some (0, true, 21)] := by rfl

def vec_x_1974 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1974 false = [some (0, false, 105), some (0, false, 21), some (0, true, 24)] := by rfl

def vec_x_1975 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1975 false = [some (0, false, 105), none, some (0, true, 24)] := by rfl

def vec_x_1976 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1976 false = [some (0, false, 105), some (0, false, 21), some (0, true, 26)] := by rfl

def vec_x_1977 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1977 false = [some (0, false, 105), none, some (0, true, 26)] := by rfl

def vec_x_1978 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1978 false = [some (0, false, 105), some (0, false, 21), some (0, true, 36)] := by rfl

def vec_x_1979 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1979 false = [some (0, false, 105), none, some (0, true, 36)] := by rfl

def vec_x_1980 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1980 false = [some (0, false, 105), some (0, false, 21), some (0, true, 101)] := by rfl

def vec_x_1981 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1981 false = [some (0, false, 105), none, some (0, true, 101)] := by rfl

def vec_x_1982 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1982 false = [some (0, false, 105), some (0, false, 21), some (0, true, 105)] := by rfl

def vec_x_1983 : Zunno.GameState :=
  { human := [3], agent := [105, 21], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1983 false = [some (0, false, 105), none, some (0, true, 105)] := by rfl

def vec_x_1984 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1984 false = [some (0, false, 105), some (0, false, 24), some (0, true, 2)] := by rfl

def vec_x_1985 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1985 false = [some (0, false, 105), none, some (0, true, 2)] := by rfl

def vec_x_1986 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1986 false = [some (0, false, 105), some (0, false, 24), some (0, true, 11)] := by rfl

def vec_x_1987 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1987 false = [some (0, false, 105), none, some (0, true, 11)] := by rfl

def vec_x_1988 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1988 false = [some (0, false, 105), some (0, false, 24), some (0, true, 21)] := by rfl

def vec_x_1989 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1989 false = [some (0, false, 105), none, some (0, true, 21)] := by rfl

def vec_x_1990 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1990 false = [some (0, false, 105), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1991 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1991 false = [some (0, false, 105), some (0, false, 24), some (0, true, 24)] := by rfl

def vec_x_1992 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1992 false = [some (0, false, 105), some (0, false, 24), some (0, true, 26)] := by rfl

def vec_x_1993 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1993 false = [some (0, false, 105), none, some (0, true, 26)] := by rfl

def vec_x_1994 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1994 false = [some (0, false, 105), some (0, false, 24), some (0, true, 36)] := by rfl

def vec_x_1995 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1995 false = [some (0, false, 105), none, some (0, true, 36)] := by rfl

def vec_x_1996 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1996 false = [some (0, false, 105), some (0, false, 24), some (0, true, 101)] := by rfl

def vec_x_1997 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1997 false = [some (0, false, 105), none, some (0, true, 101)] := by rfl

def vec_x_1998 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1998 false = [some (0, false, 105), some (0, false, 24), some (0, true, 105)] := by rfl

def vec_x_1999 : Zunno.GameState :=
  { human := [3], agent := [105, 24], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_1999 false = [some (0, false, 105), none, some (0, true, 105)] := by rfl

def vec_x_2000 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2000 false = [some (0, false, 105), none, some (0, true, 2)] := by rfl

def vec_x_2001 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2001 false = [some (0, false, 105), some (0, true, 26), some (0, true, 2)] := by rfl

def vec_x_2002 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2002 false = [some (0, false, 105), none, some (0, true, 11)] := by rfl

def vec_x_2003 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2003 false = [some (0, false, 105), some (0, true, 26), some (0, true, 11)] := by rfl

def vec_x_2004 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2004 false = [some (0, false, 105), none, some (0, true, 21)] := by rfl

def vec_x_2005 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2005 false = [some (0, false, 105), some (0, true, 26), some (0, true, 21)] := by rfl

def vec_x_2006 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2006 false = [some (0, false, 105), none, some (0, true, 24)] := by rfl

def vec_x_2007 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2007 false = [some (0, false, 105), some (0, true, 26), some (0, true, 24)] := by rfl

def vec_x_2008 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2008 false = [some (0, false, 105), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_2009 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2009 false = [some (0, false, 105), some (0, true, 26), some (0, true, 26)] := by rfl

def vec_x_2010 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2010 false = [some (0, false, 105), none, some (0, true, 36)] := by rfl

def vec_x_2011 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2011 false = [some (0, false, 105), some (0, true, 26), some (0, true, 36)] := by rfl

def vec_x_2012 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2012 false = [some (0, false, 105), none, some (0, true, 101)] := by rfl

def vec_x_2013 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2013 false = [some (0, false, 105), some (0, true, 26), some (0, true, 101)] := by rfl

def vec_x_2014 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2014 false = [some (0, false, 105), none, some (0, true, 105)] := by rfl

def vec_x_2015 : Zunno.GameState :=
  { human := [3], agent := [105, 26], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2015 false = [some (0, false, 105), some (0, true, 26), some (0, true, 105)] := by rfl

def vec_x_2016 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2016 false = [some (0, false, 105), none, some (0, true, 2)] := by rfl

def vec_x_2017 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2017 false = [some (0, false, 105), some (0, true, 36), some (0, true, 2)] := by rfl

def vec_x_2018 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2018 false = [some (0, false, 105), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_2019 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2019 false = [some (0, false, 105), some (0, true, 36), some (0, true, 11)] := by rfl

def vec_x_2020 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2020 false = [some (0, false, 105), none, some (0, true, 21)] := by rfl

def vec_x_2021 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2021 false = [some (0, false, 105), some (0, true, 36), some (0, true, 21)] := by rfl

def vec_x_2022 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2022 false = [some (0, false, 105), none, some (0, true, 24)] := by rfl

def vec_x_2023 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2023 false = [some (0, false, 105), some (0, true, 36), some (0, true, 24)] := by rfl

def vec_x_2024 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2024 false = [some (0, false, 105), none, some (0, true, 26)] := by rfl

def vec_x_2025 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2025 false = [some (0, false, 105), some (0, true, 36), some (0, true, 26)] := by rfl

def vec_x_2026 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2026 false = [some (0, false, 105), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_2027 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2027 false = [some (0, false, 105), some (0, true, 36), some (0, true, 36)] := by rfl

def vec_x_2028 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2028 false = [some (0, false, 105), none, some (0, true, 101)] := by rfl

def vec_x_2029 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2029 false = [some (0, false, 105), some (0, true, 36), some (0, true, 101)] := by rfl

def vec_x_2030 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2030 false = [some (0, false, 105), none, some (0, true, 105)] := by rfl

def vec_x_2031 : Zunno.GameState :=
  { human := [3], agent := [105, 36], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2031 false = [some (0, false, 105), some (0, true, 36), some (0, true, 105)] := by rfl

def vec_x_2032 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2032 false = [some (0, false, 105), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_2033 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [2], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2033 false = [some (0, false, 105), some (0, true, 101), some (0, true, 2)] := by rfl

def vec_x_2034 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2034 false = [some (0, false, 105), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_2035 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2035 false = [some (0, false, 105), some (0, true, 101), some (0, true, 11)] := by rfl

def vec_x_2036 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2036 false = [some (0, false, 105), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_2037 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [21], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2037 false = [some (0, false, 105), some (0, true, 101), some (0, true, 21)] := by rfl

def vec_x_2038 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2038 false = [some (0, false, 105), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_2039 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [24], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2039 false = [some (0, false, 105), some (0, true, 101), some (0, true, 24)] := by rfl

def vec_x_2040 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2040 false = [some (0, false, 105), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_2041 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2041 false = [some (0, false, 105), some (0, true, 101), some (0, true, 26)] := by rfl

def vec_x_2042 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2042 false = [some (0, false, 105), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_2043 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2043 false = [some (0, false, 105), some (0, true, 101), some (0, true, 36)] := by rfl

def vec_x_2044 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2044 false = [some (0, false, 105), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_2045 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [101], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2045 false = [some (0, false, 105), some (0, true, 101), some (0, true, 101)] := by rfl

def vec_x_2046 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 0, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2046 false = [some (0, false, 105), some (0, true, 101), some (0, true, 105)] := by rfl

def vec_x_2047 : Zunno.GameState :=
  { human := [3], agent := [105, 101], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [105], activeColor := 1, humanTurn := false, winner := none }

example : Zunno.playOutcomes vec_x_2047 false = [some (0, false, 105), some (0, true, 101), some (0, true, 105)] := by rfl

end Zunno
