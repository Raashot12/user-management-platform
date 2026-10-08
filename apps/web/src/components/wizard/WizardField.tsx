import type { ReactNode } from "react";

type Props = { id: string; label: string; optional?: boolean; hint?: string; wide?: boolean; error?: string; children: ReactNode };

export function WizardField({ id, label, optional = false, hint, wide = false, error, children }: Props) {
  return (
    <label className={wide ? "wizard-field wizard-field-wide" : "wizard-field"} htmlFor={id}>
      <span>{label}{optional && <> <em>Optional</em></>}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <small id={id + "-error"} className="wizard-field-error" role="alert">{error}</small>}
    </label>
  );
}
