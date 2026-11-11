/**
 * Local re-export of Swaraj Agent Mandate schemas for offline typing.
 * Runtime validation for dashboard Activate uses @swaraj/schemas on the API.
 */
export {
  AgentMandateSchema as AgentMandateWireSchema,
  type AgentMandate as AgentMandateWire,
  type MandatePredicate,
  type MandateRule,
} from "@swaraj/schemas";
