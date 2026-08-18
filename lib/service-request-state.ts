// The form state shared between the submit action and the configurator.
//
// This lives outside actions.ts on purpose. A `"use server"` module may only
// export async functions — every other export is stripped from the client
// build, so importing a plain constant from there yields `undefined` at
// runtime rather than a compile error. (It surfaces as the form's initial
// state being undefined, which is a confusing crash a long way from the
// cause.) Types and constants belong in a normal module like this one.

export type SubmitState = {
  status: "idle" | "error" | "success"
  message: string
  /** Keyed by input `name`, so the field renders its own error inline. */
  fieldErrors: Record<string, string>
}

export const INITIAL_SUBMIT_STATE: SubmitState = {
  status: "idle",
  message: "",
  fieldErrors: {},
}
