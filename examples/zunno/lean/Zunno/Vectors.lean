/-
Shared engine vectors — GENERATED FILE, do not edit by hand.

Source: vectors/engine-vectors.json (produced by the REAL TypeScript engine,
scripts/gen-vectors.ts). Regenerate: pnpm vectors && pnpm lean:sync

Each example is kernel-checked: the Lean model must reproduce the exact
outcome the TypeScript engine computed — same UNO card codec (1..108),
same legality, same effects, same winner.
-/

import Zunno.Engine
import Zunno.Bridge

namespace Zunno


example : Zunno.isPlayable 11 5 0 = true := by rfl -- #0 card=11 top=5 color=0

example : Zunno.isPlayable 11 36 1 = true := by rfl -- #1 card=11 top=36 color=1

example : Zunno.isPlayable 11 26 1 = false := by rfl -- #2 card=11 top=26 color=1

example : Zunno.isPlayable 21 5 0 = true := by rfl -- #3 card=21 top=5 color=0

example : Zunno.isPlayable 21 71 2 = true := by rfl -- #4 card=21 top=71 color=2

example : Zunno.isPlayable 24 24 3 = true := by rfl -- #5 card=24 top=24 color=3

example : Zunno.isPlayable 101 5 0 = true := by rfl -- #6 card=101 top=5 color=0

example : Zunno.isPlayable 105 26 1 = true := by rfl -- #7 card=105 top=26 color=1

example : Zunno.isPlayable 2 76 2 = false := by rfl -- #8 card=2 top=76 color=2

example : Zunno.isPlayable 3 27 1 = true := by rfl -- #9 card=3 top=27 color=1

def vec_play_state_0 : Zunno.GameState :=
  { human := [11, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_0 true 11 4).map Zunno.summarize = some (0, false, 11) := by rfl -- red5_number_match

def vec_play_state_1 : Zunno.GameState :=
  { human := [21, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_1 true 21 4).map Zunno.summarize = some (0, true, 21) := by rfl -- skip_keeps_turn

def vec_play_state_2 : Zunno.GameState :=
  { human := [24, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_2 true 24 4).map Zunno.summarize = some (0, true, 24) := by rfl -- draw_two_penalizes

def vec_play_state_3 : Zunno.GameState :=
  { human := [101, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_3 true 101 2).map Zunno.summarize = some (0, false, 101) := by rfl -- wild_chooses_color

def vec_play_state_4 : Zunno.GameState :=
  { human := [105, 2], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [11], activeColor := 0, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_4 true 105 3).map Zunno.summarize = some (0, true, 105) := by rfl -- wild4_penalizes_four

def vec_play_state_5 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_5 true 11 4).map Zunno.summarize = some (1, true, 11) := by rfl -- last_card_wins

def vec_play_state_6 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [26], activeColor := 1, humanTurn := true, winner := none }

example : (Zunno.playCard vec_play_state_6 true 11 4) = none := by rfl -- illegal_play_rejected

def vec_play_state_7 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : (Zunno.playCard vec_play_state_7 true 11 4) = none := by rfl -- not_your_turn_rejected

def vec_play_state_8 : Zunno.GameState :=
  { human := [3], agent := [11, 2], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : (Zunno.playCard vec_play_state_8 false 11 4).map Zunno.summarize = some (0, true, 11) := by rfl -- agent_plays_number

def vec_draw_state_0 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := true, winner := none }

example : (Zunno.drawCard vec_draw_state_0 true).map Zunno.summarize = some (0, false, 36) := by rfl -- human_draws

def vec_draw_state_1 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : (Zunno.drawCard vec_draw_state_1 false).map Zunno.summarize = some (0, true, 36) := by rfl -- agent_draws

def vec_draw_state_2 : Zunno.GameState :=
  { human := [11], agent := [3], drawPile := [50, 51, 52, 53, 54, 55, 56, 57], discard := [36], activeColor := 1, humanTurn := false, winner := none }

example : (Zunno.drawCard vec_draw_state_2 true) = none := by rfl -- draw_wrong_turn

end Zunno
