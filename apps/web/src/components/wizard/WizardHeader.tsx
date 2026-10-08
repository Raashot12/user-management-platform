import type { WizardStep } from "./wizardTypes";

type Props = { step: number; steps: WizardStep[]; isSubmitting: boolean; onClose: () => void };

export function WizardHeader({ step, steps, isSubmitting, onClose }: Props) {
  return (
    <header className="wizard-main-header">
      <div className="wizard-progress-copy" aria-live="polite">
        <span>Step {step + 1} of {steps.length}</span>
        <span>{Math.round(((step + 1) / steps.length) * 100)}% complete</span>
      </div>
      <div className="wizard-progress-track" role="progressbar" aria-label="Profile setup progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1} aria-valuetext={"Step " + (step + 1) + " of " + steps.length}>
        <span style={{ transform: "scaleX(" + (step + 1) / steps.length + ")" }} />
      </div>
      <button className="wizard-close" type="button" aria-label="Close profile form" onClick={onClose} disabled={isSubmitting}><span aria-hidden="true">×</span></button>
    </header>
  );
}
