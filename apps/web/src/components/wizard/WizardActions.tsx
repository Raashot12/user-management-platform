type Props = { step: number; isLastStep: boolean; isSubmitting: boolean; onCancel: () => void; onBack: () => void };

export function WizardActions({ step, isLastStep, isSubmitting, onCancel, onBack }: Props) {
  return (
    <footer className="wizard-actions">
      <button className="wizard-cancel" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
      <div className="wizard-action-group">
        {step > 0 && <button className="wizard-back" type="button" onClick={onBack} disabled={isSubmitting}>Back</button>}
        <button className="wizard-next" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><span className="button-spinner" aria-hidden="true" />Saving step...</> : isLastStep ? "Complete profile" : <>Continue<span aria-hidden="true">&rarr;</span></>}
        </button>
      </div>
    </footer>
  );
}
