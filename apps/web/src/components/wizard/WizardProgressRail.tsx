import type { WizardStep } from "./wizardTypes";

type Props = { step: number; steps: WizardStep[]; isSubmitting: boolean; onSelectStep: (index: number) => void };

export function WizardProgressRail({ step, steps, isSubmitting, onSelectStep }: Props) {
  return (
    <aside className="wizard-rail" aria-label="Profile creation progress">
      <a className="wizard-brand" href="#people" onClick={(event) => event.preventDefault()}>
        <span className="brand-mark" aria-hidden="true">p</span><span>people<span className="brand-dot">.</span></span>
      </a>
      <ol className="wizard-steps">
        {steps.map((item, index) => (
          <li className={index === step ? "wizard-step is-current" : index < step ? "wizard-step is-complete" : "wizard-step"} key={item.title}>
            <button type="button" className="wizard-step-button" onClick={() => onSelectStep(index)} disabled={index > step || isSubmitting} aria-label={"Step " + (index + 1) + ": " + item.title} aria-current={index === step ? "step" : undefined}>
              <span className="wizard-step-number" aria-hidden="true">{index + 1}</span>
              <span className="wizard-step-copy"><strong>{item.title}</strong><span>{item.detail}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <div className="wizard-rail-note"><span className="rail-note-mark" aria-hidden="true" />Your details stay together in one profile.</div>
    </aside>
  );
}
