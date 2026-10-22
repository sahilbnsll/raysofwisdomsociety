import type { Evenings } from "@/content/event";
import { validFor, type Evening } from "./evening";

/** What gate staff see after a scan. Shared by the pass page and the gate console. */
export type VerdictState = "admit" | "admitted" | "already" | "wrong-evening" | "not-found";

export interface GatePass {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
  admitted: Partial<Record<Evening, string>>;
}

export interface Verdict {
  state: VerdictState;
  evening: Evening;
  pass?: GatePass;
  /** ISO time of the earlier check-in, when state is "already". */
  admittedAt?: string;
}

export function verdictFor(pass: GatePass | null, evening: Evening): Verdict {
  if (!pass) return { state: "not-found", evening };
  if (pass.admitted[evening]) return { state: "already", evening, pass, admittedAt: pass.admitted[evening] };
  if (!validFor(pass.days, evening)) return { state: "wrong-evening", evening, pass };
  return { state: "admit", evening, pass };
}

export const toGatePass = (p: GatePass): GatePass => ({ id: p.id, name: p.name, guests: p.guests, days: p.days, admitted: p.admitted });
