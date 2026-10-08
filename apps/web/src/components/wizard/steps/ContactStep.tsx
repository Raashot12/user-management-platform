import { useFormContext } from "react-hook-form";
import type { UserDraft } from "../wizardTypes";
import { WizardField } from "../WizardField";

export function ContactStep() {
  const { register, formState: { errors } } = useFormContext<UserDraft>();
  return (
    <div className="wizard-fields">
      <WizardField id="email" label="Email address" wide error={errors.email?.message}>
        <input autoFocus id="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} type="email" autoComplete="email" required placeholder="name@company.com" {...register("email")} />
      </WizardField>
      <WizardField id="phoneNumber" label="Phone number" error={errors.phoneNumber?.message}>
        <input id="phoneNumber" aria-invalid={Boolean(errors.phoneNumber)} aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined} type="tel" autoComplete="tel" inputMode="tel" required placeholder="+2348012345678" {...register("phoneNumber")} />
      </WizardField>
      <WizardField id="fax" label="Fax" optional error={errors.fax?.message}>
        <input id="fax" aria-invalid={Boolean(errors.fax)} aria-describedby={errors.fax ? "fax-error" : undefined} type="tel" placeholder="+234 1 555 0100" {...register("fax")} />
      </WizardField>
      <WizardField id="linkedInUrl" label="LinkedIn profile" optional wide error={errors.linkedInUrl?.message}>
        <input id="linkedInUrl" aria-invalid={Boolean(errors.linkedInUrl)} aria-describedby={errors.linkedInUrl ? "linkedInUrl-error" : undefined} type="url" autoComplete="url" placeholder="https://linkedin.com/in/name" {...register("linkedInUrl")} />
      </WizardField>
    </div>
  );
}
