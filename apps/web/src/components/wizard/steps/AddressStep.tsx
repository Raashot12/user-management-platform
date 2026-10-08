import { useFormContext } from "react-hook-form";
import type { UserDraft } from "../wizardTypes";
import { WizardField } from "../WizardField";

export function AddressStep() {
  const { register, formState: { errors } } = useFormContext<UserDraft>();
  return (
    <div className="wizard-fields">
      <WizardField id="address" label="Street address" wide error={errors.address?.message}>
        <input autoFocus id="address" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} autoComplete="street-address" minLength={3} required placeholder="12 Marina Road" {...register("address")} />
      </WizardField>
      <WizardField id="city" label="City" error={errors.city?.message}>
        <input id="city" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined} autoComplete="address-level2" required placeholder="Lagos" {...register("city")} />
      </WizardField>
      <WizardField id="state" label="State / region" error={errors.state?.message}>
        <input id="state" aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? "state-error" : undefined} autoComplete="address-level1" required placeholder="Lagos" {...register("state")} />
      </WizardField>
      <WizardField id="country" label="Country" error={errors.country?.message}>
        <input id="country" aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? "country-error" : undefined} autoComplete="country-name" required placeholder="Nigeria" {...register("country")} />
      </WizardField>
      <WizardField id="zipCode" label="Postal code" error={errors.zipCode?.message}>
        <input id="zipCode" aria-invalid={Boolean(errors.zipCode)} aria-describedby={errors.zipCode ? "zipCode-error" : undefined} autoComplete="postal-code" required placeholder="101001" {...register("zipCode")} />
      </WizardField>
    </div>
  );
}
