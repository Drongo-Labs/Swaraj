# `@swaraj/rules`

Pure Agent Mandate evaluation for the unified action format.

Decision order is fixed:

1. Any matching `FORBID` rule blocks the action.
2. Otherwise, any matching `PERMIT` rule allows it.
3. Otherwise, the action is blocked by default deny.

Rules are ORed; predicates within one rule are ANDed. Parsing at the public
entry point is fail-closed and never returns rejected input values.
