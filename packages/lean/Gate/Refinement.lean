/-
Mandate refinement — GENERATED FILE, do not edit by hand.

Source: packages/proofs/vectors/mandate-refinement.json (every case
evaluated by the REAL TypeScript engine, @swaraj/rules).
Regenerate: node scripts/gen-refinement-vectors.mjs && node scripts/sync-refinement.mjs

The Lean kernel checks Gate.decideConcrete (the concrete instantiation of
the proven abstract decision function, Gate.Mandate) against the TypeScript
engine's outcome for EVERY case in the bounded space: 469 mandates x
17 actions = 7973 cases. Any divergence between the Lean
model and the TypeScript implementation inside this space breaks the build.
-/

import Gate.Concrete

namespace Gate

def refRulePool : List Gate.CRule := [
  { ruleId := "r00", effect := Gate.MandateEffect.permit, preds := [Gate.CPred.appEq "zunno"] },
  { ruleId := "r01", effect := Gate.MandateEffect.permit, preds := [Gate.CPred.nameIn ["draw_card", "move", "play_card"]] },
  { ruleId := "r02", effect := Gate.MandateEffect.permit, preds := [Gate.CPred.paramLte "cardValue" 104] },
  { ruleId := "r03", effect := Gate.MandateEffect.permit, preds := [Gate.CPred.paramStringEq "tableId" "table-42"] },
  { ruleId := "r04", effect := Gate.MandateEffect.forbid, preds := [Gate.CPred.nameEq "shuffle_deck"] },
  { ruleId := "r05", effect := Gate.MandateEffect.forbid, preds := [Gate.CPred.paramGt "cardValue" 104] },
  { ruleId := "r06", effect := Gate.MandateEffect.permit, preds := [] },
  { ruleId := "r07", effect := Gate.MandateEffect.forbid, preds := [] },
  { ruleId := "r08", effect := Gate.MandateEffect.permit, preds := [Gate.CPred.amountLte 10000000000000000] },
  { ruleId := "r09", effect := Gate.MandateEffect.permit, preds := [Gate.CPred.currencyEq "ETH", Gate.CPred.recipientEq "0x82b2cce9a52c7e56838a5c46833067f9eb006911"] },
  { ruleId := "r10", effect := Gate.MandateEffect.forbid, preds := [Gate.CPred.amountGt 10000000000000000] },
  { ruleId := "r11", effect := Gate.MandateEffect.forbid, preds := [Gate.CPred.currencyEq "USD"] },
  { ruleId := "r12", effect := Gate.MandateEffect.permit, preds := [] },
  { ruleId := "r13", effect := Gate.MandateEffect.forbid, preds := [Gate.CPred.amountEq 10000000000000000] }
]

def refActionPool : List Gate.CAction := [
  { kind := true, app := "zunno", name := "play_card", params := [("cardValue", 11), ("handIndex", 0), ("chosenColor", 4)], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "draw_card", params := [], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "shuffle_deck", params := [], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "move", params := [], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "play_card", params := [("cardValue", 104), ("handIndex", 0), ("chosenColor", 4)], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "play_card", params := [("cardValue", 105), ("handIndex", 0), ("chosenColor", 4)], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "play_card", params := [("cardValue", 108), ("handIndex", 0), ("chosenColor", 4)], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "play_card", params := [("cardValue", 11)], sparams := [("tableId", "table-42")], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "chess", name := "move", params := [], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "chess", name := "play_card", params := [("cardValue", 105)], sparams := [], amount := 0, currency := "", recipient := "" },
  { kind := true, app := "zunno", name := "play_card", params := [("cardValue", 105)], sparams := [("tableId", "table-42")], amount := 0, currency := "", recipient := "" },
  { kind := false, app := "undefined", name := "undefined", params := [], sparams := [], amount := 10000000000000000, currency := "ETH", recipient := "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  { kind := false, app := "undefined", name := "undefined", params := [], sparams := [], amount := 9999999999999999, currency := "ETH", recipient := "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  { kind := false, app := "undefined", name := "undefined", params := [], sparams := [], amount := 10000000000000001, currency := "ETH", recipient := "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  { kind := false, app := "undefined", name := "undefined", params := [], sparams := [], amount := 10000000000000000, currency := "USD", recipient := "vendor@example.com" },
  { kind := false, app := "undefined", name := "undefined", params := [], sparams := [], amount := 5000000000000, currency := "USD", recipient := "vendor@example.com" },
  { kind := false, app := "undefined", name := "undefined", params := [], sparams := [], amount := 0, currency := "ETH", recipient := "0x82b2cce9a52c7e56838a5c46833067f9eb006911" }
]

def refMandate_0 : List Gate.CRule := [refRulePool[0]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_0)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_1 : List Gate.CRule := [refRulePool[0], refRulePool[1]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_1)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_2 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[2]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_2)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_3 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_3)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_4 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_4)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_5 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_5)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_6 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_6)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_7 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_7)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_8 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_8)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_9 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_9)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_10 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_10)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_11 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_11)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_12 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_12)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_13 : List Gate.CRule := [refRulePool[0], refRulePool[1], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_13)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_14 : List Gate.CRule := [refRulePool[0], refRulePool[2]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_14)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_15 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_15)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_16 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_16)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_17 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_17)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_18 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_18)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_19 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_19)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_20 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_20)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_21 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_21)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_22 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_22)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_23 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_23)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_24 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_24)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_25 : List Gate.CRule := [refRulePool[0], refRulePool[2], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_25)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_26 : List Gate.CRule := [refRulePool[0], refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_26)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_27 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_27)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_28 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_28)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_29 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_29)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_30 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_30)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_31 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_31)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_32 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_32)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_33 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_33)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_34 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_34)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_35 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_35)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_36 : List Gate.CRule := [refRulePool[0], refRulePool[3], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_36)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_37 : List Gate.CRule := [refRulePool[0], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_37)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_38 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_38)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_39 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_39)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_40 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_40)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_41 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_41)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_42 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_42)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_43 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_43)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_44 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_44)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_45 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_45)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_46 : List Gate.CRule := [refRulePool[0], refRulePool[4], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_46)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_47 : List Gate.CRule := [refRulePool[0], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_47)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_48 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_48)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_49 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_49)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_50 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_50)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_51 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_51)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_52 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_52)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_53 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_53)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_54 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_54)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_55 : List Gate.CRule := [refRulePool[0], refRulePool[5], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_55)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_56 : List Gate.CRule := [refRulePool[0], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_56)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_57 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_57)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_58 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_58)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_59 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_59)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_60 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_60)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_61 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_61)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_62 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_62)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_63 : List Gate.CRule := [refRulePool[0], refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_63)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_64 : List Gate.CRule := [refRulePool[0], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_64)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_65 : List Gate.CRule := [refRulePool[0], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_65)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_66 : List Gate.CRule := [refRulePool[0], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_66)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_67 : List Gate.CRule := [refRulePool[0], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_67)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_68 : List Gate.CRule := [refRulePool[0], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_68)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_69 : List Gate.CRule := [refRulePool[0], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_69)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_70 : List Gate.CRule := [refRulePool[0], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_70)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_71 : List Gate.CRule := [refRulePool[0], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_71)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_72 : List Gate.CRule := [refRulePool[0], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_72)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_73 : List Gate.CRule := [refRulePool[0], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_73)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_74 : List Gate.CRule := [refRulePool[0], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_74)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_75 : List Gate.CRule := [refRulePool[0], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_75)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_76 : List Gate.CRule := [refRulePool[0], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_76)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_77 : List Gate.CRule := [refRulePool[0], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_77)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_78 : List Gate.CRule := [refRulePool[0], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_78)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_79 : List Gate.CRule := [refRulePool[0], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_79)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_80 : List Gate.CRule := [refRulePool[0], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_80)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_81 : List Gate.CRule := [refRulePool[0], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_81)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_82 : List Gate.CRule := [refRulePool[0], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_82)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_83 : List Gate.CRule := [refRulePool[0], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_83)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_84 : List Gate.CRule := [refRulePool[0], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_84)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_85 : List Gate.CRule := [refRulePool[0], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_85)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_86 : List Gate.CRule := [refRulePool[0], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_86)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_87 : List Gate.CRule := [refRulePool[0], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_87)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_88 : List Gate.CRule := [refRulePool[0], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_88)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_89 : List Gate.CRule := [refRulePool[0], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_89)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_90 : List Gate.CRule := [refRulePool[0], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_90)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_91 : List Gate.CRule := [refRulePool[0], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_91)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_92 : List Gate.CRule := [refRulePool[1]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_92)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_93 : List Gate.CRule := [refRulePool[1], refRulePool[2]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_93)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_94 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_94)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_95 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_95)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_96 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_96)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_97 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_97)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_98 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_98)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_99 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_99)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_100 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_100)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_101 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_101)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_102 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_102)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_103 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_103)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_104 : List Gate.CRule := [refRulePool[1], refRulePool[2], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_104)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_105 : List Gate.CRule := [refRulePool[1], refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_105)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_106 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_106)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_107 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_107)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_108 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_108)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_109 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_109)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_110 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_110)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_111 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_111)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_112 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_112)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_113 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_113)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_114 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_114)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_115 : List Gate.CRule := [refRulePool[1], refRulePool[3], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_115)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_116 : List Gate.CRule := [refRulePool[1], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_116)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_117 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_117)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_118 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_118)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_119 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_119)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_120 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_120)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_121 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_121)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_122 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_122)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_123 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_123)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_124 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_124)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_125 : List Gate.CRule := [refRulePool[1], refRulePool[4], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_125)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_126 : List Gate.CRule := [refRulePool[1], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_126)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_127 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_127)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_128 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_128)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_129 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_129)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_130 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_130)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_131 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_131)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_132 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_132)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_133 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_133)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_134 : List Gate.CRule := [refRulePool[1], refRulePool[5], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_134)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_135 : List Gate.CRule := [refRulePool[1], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_135)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_136 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_136)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_137 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_137)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_138 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_138)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_139 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_139)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_140 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_140)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_141 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_141)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_142 : List Gate.CRule := [refRulePool[1], refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_142)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_143 : List Gate.CRule := [refRulePool[1], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_143)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_144 : List Gate.CRule := [refRulePool[1], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_144)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_145 : List Gate.CRule := [refRulePool[1], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_145)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_146 : List Gate.CRule := [refRulePool[1], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_146)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_147 : List Gate.CRule := [refRulePool[1], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_147)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_148 : List Gate.CRule := [refRulePool[1], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_148)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_149 : List Gate.CRule := [refRulePool[1], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_149)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_150 : List Gate.CRule := [refRulePool[1], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_150)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_151 : List Gate.CRule := [refRulePool[1], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_151)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_152 : List Gate.CRule := [refRulePool[1], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_152)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_153 : List Gate.CRule := [refRulePool[1], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_153)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_154 : List Gate.CRule := [refRulePool[1], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_154)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_155 : List Gate.CRule := [refRulePool[1], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_155)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_156 : List Gate.CRule := [refRulePool[1], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_156)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_157 : List Gate.CRule := [refRulePool[1], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_157)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_158 : List Gate.CRule := [refRulePool[1], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_158)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_159 : List Gate.CRule := [refRulePool[1], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_159)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_160 : List Gate.CRule := [refRulePool[1], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_160)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_161 : List Gate.CRule := [refRulePool[1], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_161)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_162 : List Gate.CRule := [refRulePool[1], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_162)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_163 : List Gate.CRule := [refRulePool[1], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_163)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_164 : List Gate.CRule := [refRulePool[1], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_164)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_165 : List Gate.CRule := [refRulePool[1], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_165)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_166 : List Gate.CRule := [refRulePool[1], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_166)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_167 : List Gate.CRule := [refRulePool[1], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_167)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_168 : List Gate.CRule := [refRulePool[1], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_168)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_169 : List Gate.CRule := [refRulePool[1], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_169)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_170 : List Gate.CRule := [refRulePool[1], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_170)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_171 : List Gate.CRule := [refRulePool[2]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_171)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_172 : List Gate.CRule := [refRulePool[2], refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_172)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_173 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_173)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_174 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_174)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_175 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_175)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_176 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_176)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_177 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_177)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_178 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_178)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_179 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_179)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_180 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_180)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_181 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_181)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_182 : List Gate.CRule := [refRulePool[2], refRulePool[3], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_182)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_183 : List Gate.CRule := [refRulePool[2], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_183)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_184 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_184)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_185 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_185)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_186 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_186)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_187 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_187)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_188 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_188)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_189 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_189)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_190 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_190)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_191 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_191)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_192 : List Gate.CRule := [refRulePool[2], refRulePool[4], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_192)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_193 : List Gate.CRule := [refRulePool[2], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_193)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_194 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_194)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_195 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_195)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_196 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_196)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_197 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_197)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_198 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_198)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_199 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_199)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_200 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_200)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_201 : List Gate.CRule := [refRulePool[2], refRulePool[5], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_201)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_202 : List Gate.CRule := [refRulePool[2], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_202)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_203 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_203)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_204 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_204)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_205 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_205)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_206 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_206)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_207 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_207)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_208 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_208)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_209 : List Gate.CRule := [refRulePool[2], refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_209)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_210 : List Gate.CRule := [refRulePool[2], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_210)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_211 : List Gate.CRule := [refRulePool[2], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_211)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_212 : List Gate.CRule := [refRulePool[2], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_212)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_213 : List Gate.CRule := [refRulePool[2], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_213)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_214 : List Gate.CRule := [refRulePool[2], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_214)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_215 : List Gate.CRule := [refRulePool[2], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_215)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_216 : List Gate.CRule := [refRulePool[2], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_216)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_217 : List Gate.CRule := [refRulePool[2], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_217)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_218 : List Gate.CRule := [refRulePool[2], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_218)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_219 : List Gate.CRule := [refRulePool[2], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_219)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_220 : List Gate.CRule := [refRulePool[2], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_220)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_221 : List Gate.CRule := [refRulePool[2], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_221)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_222 : List Gate.CRule := [refRulePool[2], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_222)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_223 : List Gate.CRule := [refRulePool[2], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_223)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_224 : List Gate.CRule := [refRulePool[2], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_224)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_225 : List Gate.CRule := [refRulePool[2], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_225)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_226 : List Gate.CRule := [refRulePool[2], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_226)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_227 : List Gate.CRule := [refRulePool[2], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_227)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_228 : List Gate.CRule := [refRulePool[2], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_228)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_229 : List Gate.CRule := [refRulePool[2], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_229)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_230 : List Gate.CRule := [refRulePool[2], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_230)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_231 : List Gate.CRule := [refRulePool[2], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_231)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_232 : List Gate.CRule := [refRulePool[2], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_232)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_233 : List Gate.CRule := [refRulePool[2], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_233)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_234 : List Gate.CRule := [refRulePool[2], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_234)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_235 : List Gate.CRule := [refRulePool[2], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_235)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_236 : List Gate.CRule := [refRulePool[2], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_236)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_237 : List Gate.CRule := [refRulePool[2], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_237)) = [Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_238 : List Gate.CRule := [refRulePool[3]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_238)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_239 : List Gate.CRule := [refRulePool[3], refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_239)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_240 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_240)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_241 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_241)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_242 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_242)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_243 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_243)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_244 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_244)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_245 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_245)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_246 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_246)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_247 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_247)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_248 : List Gate.CRule := [refRulePool[3], refRulePool[4], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_248)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_249 : List Gate.CRule := [refRulePool[3], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_249)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_250 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_250)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_251 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_251)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_252 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_252)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_253 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_253)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_254 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_254)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_255 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_255)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_256 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_256)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_257 : List Gate.CRule := [refRulePool[3], refRulePool[5], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_257)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_258 : List Gate.CRule := [refRulePool[3], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_258)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_259 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_259)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_260 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_260)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_261 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_261)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_262 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_262)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_263 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_263)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_264 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_264)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_265 : List Gate.CRule := [refRulePool[3], refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_265)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_266 : List Gate.CRule := [refRulePool[3], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_266)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_267 : List Gate.CRule := [refRulePool[3], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_267)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_268 : List Gate.CRule := [refRulePool[3], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_268)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_269 : List Gate.CRule := [refRulePool[3], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_269)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_270 : List Gate.CRule := [refRulePool[3], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_270)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_271 : List Gate.CRule := [refRulePool[3], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_271)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_272 : List Gate.CRule := [refRulePool[3], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_272)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_273 : List Gate.CRule := [refRulePool[3], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_273)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_274 : List Gate.CRule := [refRulePool[3], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_274)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_275 : List Gate.CRule := [refRulePool[3], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_275)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_276 : List Gate.CRule := [refRulePool[3], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_276)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_277 : List Gate.CRule := [refRulePool[3], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_277)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_278 : List Gate.CRule := [refRulePool[3], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_278)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_279 : List Gate.CRule := [refRulePool[3], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_279)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_280 : List Gate.CRule := [refRulePool[3], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_280)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_281 : List Gate.CRule := [refRulePool[3], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_281)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_282 : List Gate.CRule := [refRulePool[3], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_282)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_283 : List Gate.CRule := [refRulePool[3], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_283)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_284 : List Gate.CRule := [refRulePool[3], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_284)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_285 : List Gate.CRule := [refRulePool[3], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_285)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_286 : List Gate.CRule := [refRulePool[3], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_286)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_287 : List Gate.CRule := [refRulePool[3], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_287)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_288 : List Gate.CRule := [refRulePool[3], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_288)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_289 : List Gate.CRule := [refRulePool[3], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_289)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_290 : List Gate.CRule := [refRulePool[3], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_290)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_291 : List Gate.CRule := [refRulePool[3], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_291)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_292 : List Gate.CRule := [refRulePool[3], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_292)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_293 : List Gate.CRule := [refRulePool[3], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_293)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_294 : List Gate.CRule := [refRulePool[4]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_294)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_295 : List Gate.CRule := [refRulePool[4], refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_295)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_296 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_296)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_297 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_297)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_298 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_298)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_299 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_299)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_300 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_300)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_301 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_301)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_302 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_302)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_303 : List Gate.CRule := [refRulePool[4], refRulePool[5], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_303)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_304 : List Gate.CRule := [refRulePool[4], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_304)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_305 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_305)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_306 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_306)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_307 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_307)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_308 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_308)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_309 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_309)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_310 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_310)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_311 : List Gate.CRule := [refRulePool[4], refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_311)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_312 : List Gate.CRule := [refRulePool[4], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_312)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_313 : List Gate.CRule := [refRulePool[4], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_313)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_314 : List Gate.CRule := [refRulePool[4], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_314)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_315 : List Gate.CRule := [refRulePool[4], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_315)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_316 : List Gate.CRule := [refRulePool[4], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_316)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_317 : List Gate.CRule := [refRulePool[4], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_317)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_318 : List Gate.CRule := [refRulePool[4], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_318)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_319 : List Gate.CRule := [refRulePool[4], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_319)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_320 : List Gate.CRule := [refRulePool[4], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_320)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_321 : List Gate.CRule := [refRulePool[4], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_321)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_322 : List Gate.CRule := [refRulePool[4], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_322)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_323 : List Gate.CRule := [refRulePool[4], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_323)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_324 : List Gate.CRule := [refRulePool[4], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_324)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_325 : List Gate.CRule := [refRulePool[4], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_325)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_326 : List Gate.CRule := [refRulePool[4], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_326)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_327 : List Gate.CRule := [refRulePool[4], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_327)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_328 : List Gate.CRule := [refRulePool[4], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_328)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_329 : List Gate.CRule := [refRulePool[4], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_329)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_330 : List Gate.CRule := [refRulePool[4], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_330)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_331 : List Gate.CRule := [refRulePool[4], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_331)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_332 : List Gate.CRule := [refRulePool[4], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_332)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_333 : List Gate.CRule := [refRulePool[4], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_333)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_334 : List Gate.CRule := [refRulePool[4], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_334)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_335 : List Gate.CRule := [refRulePool[4], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_335)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_336 : List Gate.CRule := [refRulePool[4], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_336)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_337 : List Gate.CRule := [refRulePool[4], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_337)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_338 : List Gate.CRule := [refRulePool[4], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_338)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_339 : List Gate.CRule := [refRulePool[4], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_339)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_340 : List Gate.CRule := [refRulePool[5]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_340)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_341 : List Gate.CRule := [refRulePool[5], refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_341)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_342 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_342)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_343 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_343)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_344 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_344)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_345 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_345)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_346 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_346)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_347 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_347)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_348 : List Gate.CRule := [refRulePool[5], refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_348)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_349 : List Gate.CRule := [refRulePool[5], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_349)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_350 : List Gate.CRule := [refRulePool[5], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_350)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_351 : List Gate.CRule := [refRulePool[5], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_351)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_352 : List Gate.CRule := [refRulePool[5], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_352)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_353 : List Gate.CRule := [refRulePool[5], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_353)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_354 : List Gate.CRule := [refRulePool[5], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_354)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_355 : List Gate.CRule := [refRulePool[5], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_355)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_356 : List Gate.CRule := [refRulePool[5], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_356)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_357 : List Gate.CRule := [refRulePool[5], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_357)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_358 : List Gate.CRule := [refRulePool[5], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_358)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_359 : List Gate.CRule := [refRulePool[5], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_359)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_360 : List Gate.CRule := [refRulePool[5], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_360)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_361 : List Gate.CRule := [refRulePool[5], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_361)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_362 : List Gate.CRule := [refRulePool[5], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_362)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_363 : List Gate.CRule := [refRulePool[5], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_363)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_364 : List Gate.CRule := [refRulePool[5], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_364)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_365 : List Gate.CRule := [refRulePool[5], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_365)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_366 : List Gate.CRule := [refRulePool[5], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_366)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_367 : List Gate.CRule := [refRulePool[5], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_367)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_368 : List Gate.CRule := [refRulePool[5], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_368)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_369 : List Gate.CRule := [refRulePool[5], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_369)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_370 : List Gate.CRule := [refRulePool[5], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_370)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_371 : List Gate.CRule := [refRulePool[5], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_371)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_372 : List Gate.CRule := [refRulePool[5], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_372)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_373 : List Gate.CRule := [refRulePool[5], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_373)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_374 : List Gate.CRule := [refRulePool[5], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_374)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_375 : List Gate.CRule := [refRulePool[5], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_375)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_376 : List Gate.CRule := [refRulePool[5], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_376)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_377 : List Gate.CRule := [refRulePool[6]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_377)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_378 : List Gate.CRule := [refRulePool[6], refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_378)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_379 : List Gate.CRule := [refRulePool[6], refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_379)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_380 : List Gate.CRule := [refRulePool[6], refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_380)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_381 : List Gate.CRule := [refRulePool[6], refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_381)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_382 : List Gate.CRule := [refRulePool[6], refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_382)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_383 : List Gate.CRule := [refRulePool[6], refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_383)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_384 : List Gate.CRule := [refRulePool[6], refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_384)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_385 : List Gate.CRule := [refRulePool[6], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_385)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_386 : List Gate.CRule := [refRulePool[6], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_386)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_387 : List Gate.CRule := [refRulePool[6], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_387)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_388 : List Gate.CRule := [refRulePool[6], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_388)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_389 : List Gate.CRule := [refRulePool[6], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_389)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_390 : List Gate.CRule := [refRulePool[6], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_390)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_391 : List Gate.CRule := [refRulePool[6], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_391)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_392 : List Gate.CRule := [refRulePool[6], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_392)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_393 : List Gate.CRule := [refRulePool[6], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_393)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_394 : List Gate.CRule := [refRulePool[6], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_394)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_395 : List Gate.CRule := [refRulePool[6], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_395)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_396 : List Gate.CRule := [refRulePool[6], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_396)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_397 : List Gate.CRule := [refRulePool[6], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_397)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_398 : List Gate.CRule := [refRulePool[6], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_398)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_399 : List Gate.CRule := [refRulePool[6], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_399)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_400 : List Gate.CRule := [refRulePool[6], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_400)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_401 : List Gate.CRule := [refRulePool[6], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_401)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_402 : List Gate.CRule := [refRulePool[6], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_402)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_403 : List Gate.CRule := [refRulePool[6], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_403)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_404 : List Gate.CRule := [refRulePool[6], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_404)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_405 : List Gate.CRule := [refRulePool[6], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_405)) = [Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_406 : List Gate.CRule := [refRulePool[7]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_406)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_407 : List Gate.CRule := [refRulePool[7], refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_407)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_408 : List Gate.CRule := [refRulePool[7], refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_408)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_409 : List Gate.CRule := [refRulePool[7], refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_409)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_410 : List Gate.CRule := [refRulePool[7], refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_410)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_411 : List Gate.CRule := [refRulePool[7], refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_411)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_412 : List Gate.CRule := [refRulePool[7], refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_412)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_413 : List Gate.CRule := [refRulePool[7], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_413)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_414 : List Gate.CRule := [refRulePool[7], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_414)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_415 : List Gate.CRule := [refRulePool[7], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_415)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_416 : List Gate.CRule := [refRulePool[7], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_416)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_417 : List Gate.CRule := [refRulePool[7], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_417)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_418 : List Gate.CRule := [refRulePool[7], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_418)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_419 : List Gate.CRule := [refRulePool[7], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_419)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_420 : List Gate.CRule := [refRulePool[7], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_420)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_421 : List Gate.CRule := [refRulePool[7], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_421)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_422 : List Gate.CRule := [refRulePool[7], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_422)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_423 : List Gate.CRule := [refRulePool[7], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_423)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_424 : List Gate.CRule := [refRulePool[7], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_424)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_425 : List Gate.CRule := [refRulePool[7], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_425)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_426 : List Gate.CRule := [refRulePool[7], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_426)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_427 : List Gate.CRule := [refRulePool[7], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_427)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_428 : List Gate.CRule := [refRulePool[8]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_428)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_429 : List Gate.CRule := [refRulePool[8], refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_429)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_430 : List Gate.CRule := [refRulePool[8], refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_430)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_431 : List Gate.CRule := [refRulePool[8], refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_431)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_432 : List Gate.CRule := [refRulePool[8], refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_432)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_433 : List Gate.CRule := [refRulePool[8], refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_433)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_434 : List Gate.CRule := [refRulePool[8], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_434)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_435 : List Gate.CRule := [refRulePool[8], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_435)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_436 : List Gate.CRule := [refRulePool[8], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_436)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_437 : List Gate.CRule := [refRulePool[8], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_437)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_438 : List Gate.CRule := [refRulePool[8], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_438)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_439 : List Gate.CRule := [refRulePool[8], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_439)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_440 : List Gate.CRule := [refRulePool[8], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_440)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_441 : List Gate.CRule := [refRulePool[8], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_441)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_442 : List Gate.CRule := [refRulePool[8], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_442)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_443 : List Gate.CRule := [refRulePool[8], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_443)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_444 : List Gate.CRule := [refRulePool[9]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_444)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_445 : List Gate.CRule := [refRulePool[9], refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_445)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_446 : List Gate.CRule := [refRulePool[9], refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_446)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_447 : List Gate.CRule := [refRulePool[9], refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_447)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_448 : List Gate.CRule := [refRulePool[9], refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_448)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_449 : List Gate.CRule := [refRulePool[9], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_449)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_450 : List Gate.CRule := [refRulePool[9], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_450)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_451 : List Gate.CRule := [refRulePool[9], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_451)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_452 : List Gate.CRule := [refRulePool[9], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_452)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_453 : List Gate.CRule := [refRulePool[9], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_453)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_454 : List Gate.CRule := [refRulePool[9], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_454)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_455 : List Gate.CRule := [refRulePool[10]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_455)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_456 : List Gate.CRule := [refRulePool[10], refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_456)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_457 : List Gate.CRule := [refRulePool[10], refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_457)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_458 : List Gate.CRule := [refRulePool[10], refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_458)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_459 : List Gate.CRule := [refRulePool[10], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_459)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_460 : List Gate.CRule := [refRulePool[10], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_460)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_461 : List Gate.CRule := [refRulePool[10], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_461)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_462 : List Gate.CRule := [refRulePool[11]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_462)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_463 : List Gate.CRule := [refRulePool[11], refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_463)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_464 : List Gate.CRule := [refRulePool[11], refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_464)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow] := by rfl

def refMandate_465 : List Gate.CRule := [refRulePool[11], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_465)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

def refMandate_466 : List Gate.CRule := [refRulePool[12]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_466)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_467 : List Gate.CRule := [refRulePool[12], refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_467)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow, Gate.Outcome.block, Gate.Outcome.allow, Gate.Outcome.allow] := by rfl

def refMandate_468 : List Gate.CRule := [refRulePool[13]]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_468)) = [Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block, Gate.Outcome.block] := by rfl

end Gate
