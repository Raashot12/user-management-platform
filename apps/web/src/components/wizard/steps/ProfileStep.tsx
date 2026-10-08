import { useFormContext } from "react-hook-form";
import type { UserDraft } from "../wizardTypes";
import { WizardField } from "../WizardField";

type Props = { today: string };

export function ProfileStep({ today }: Props) {
  const { register, formState: { errors } } = useFormContext<UserDraft>();
  return (
    <div className="wizard-fields">
      <WizardField id="profilePhotoUrl" label="Profile photo URL" optional hint="Use a publicly accessible image link." wide error={errors.profilePhotoUrl?.message}>
        <input id="profilePhotoUrl" aria-invalid={Boolean(errors.profilePhotoUrl)} aria-describedby={errors.profilePhotoUrl ? "profilePhotoUrl-error" : undefined} type="url" placeholder="https://example.com/photo.jpg" {...register("profilePhotoUrl")} />
      </WizardField>
      <WizardField id="firstName" label="First name" error={errors.firstName?.message}>
        <input autoFocus id="firstName" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "firstName-error" : undefined} autoComplete="given-name" minLength={2} required placeholder="e.g. Ada" {...register("firstName")} />
      </WizardField>
      <WizardField id="lastName" label="Last name" error={errors.lastName?.message}>
        <input id="lastName" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "lastName-error" : undefined} autoComplete="family-name" minLength={2} required placeholder="e.g. Okafor" {...register("lastName")} />
      </WizardField>
      <WizardField id="dob" label="Date of birth" error={errors.dob?.message}>
        <input id="dob" aria-invalid={Boolean(errors.dob)} aria-describedby={errors.dob ? "dob-error" : undefined} type="date" max={today} required {...register("dob")} />
      </WizardField>
      <WizardField id="gender" label="Gender" error={errors.gender?.message}>
        <select id="gender" aria-invalid={Boolean(errors.gender)} aria-describedby={errors.gender ? "gender-error" : undefined} required {...register("gender")}>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option><option value="FEMALE">Female</option><option value="MALE">Male</option><option value="OTHER">Other</option>
        </select>
      </WizardField>
      <WizardField id="occupation" label="Occupation" wide error={errors.occupation?.message}>
        <input id="occupation" aria-invalid={Boolean(errors.occupation)} aria-describedby={errors.occupation ? "occupation-error" : undefined} autoComplete="organization-title" minLength={2} required placeholder="e.g. Product designer" {...register("occupation")} />
      </WizardField>
    </div>
  );
}
