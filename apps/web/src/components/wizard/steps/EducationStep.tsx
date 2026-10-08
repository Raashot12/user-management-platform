import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type { UserDraft } from "../wizardTypes";
import { WizardField } from "../WizardField";

type Props = { onEditStep: (index: number) => void };

export function EducationStep({ onEditStep }: Props) {
  const { control, register, formState: { errors } } = useFormContext<UserDraft>();
  const { fields, append, remove } = useFieldArray({ control, name: "schools" });
  const draft = useWatch({ control }) as UserDraft;

  return (
    <div className="wizard-education">
      <div className="school-list">
        {fields.map((field, index) => (
          <fieldset className="school-entry" key={field.id}>
            <legend>School {index + 1}</legend>
            {fields.length > 1 && <button className="remove-school" type="button" onClick={() => remove(index)} aria-label={"Remove school " + (index + 1)}>Remove</button>}
            <div className="wizard-fields school-fields">
              <WizardField id={`schools.${index}.schoolName`} label="School or institution" wide error={errors.schools?.[index]?.schoolName?.message}>
                <input autoFocus={index === 0} id={`schools.${index}.schoolName`} aria-invalid={Boolean(errors.schools?.[index]?.schoolName)} aria-describedby={errors.schools?.[index]?.schoolName ? `schools.${index}.schoolName-error` : undefined} minLength={2} required placeholder="University of Lagos" {...register(`schools.${index}.schoolName`)} />
              </WizardField>
              <WizardField id={`schools.${index}.qualification`} label="Qualification" optional error={errors.schools?.[index]?.qualification?.message}>
                <input id={`schools.${index}.qualification`} aria-invalid={Boolean(errors.schools?.[index]?.qualification)} aria-describedby={errors.schools?.[index]?.qualification ? `schools.${index}.qualification-error` : undefined} placeholder="B.Sc." {...register(`schools.${index}.qualification`)} />
              </WizardField>
              <WizardField id={`schools.${index}.fieldOfStudy`} label="Field of study" optional error={errors.schools?.[index]?.fieldOfStudy?.message}>
                <input id={`schools.${index}.fieldOfStudy`} aria-invalid={Boolean(errors.schools?.[index]?.fieldOfStudy)} aria-describedby={errors.schools?.[index]?.fieldOfStudy ? `schools.${index}.fieldOfStudy-error` : undefined} placeholder="Computer Science" {...register(`schools.${index}.fieldOfStudy`)} />
              </WizardField>
              <WizardField id={`schools.${index}.startDate`} label="Start date" optional error={errors.schools?.[index]?.startDate?.message}>
                <input id={`schools.${index}.startDate`} aria-invalid={Boolean(errors.schools?.[index]?.startDate)} aria-describedby={errors.schools?.[index]?.startDate ? `schools.${index}.startDate-error` : undefined} type="date" {...register(`schools.${index}.startDate`)} />
              </WizardField>
              <WizardField id={`schools.${index}.endDate`} label="End date" optional error={errors.schools?.[index]?.endDate?.message}>
                <input id={`schools.${index}.endDate`} aria-invalid={Boolean(errors.schools?.[index]?.endDate)} aria-describedby={errors.schools?.[index]?.endDate ? `schools.${index}.endDate-error` : undefined} type="date" {...register(`schools.${index}.endDate`)} />
              </WizardField>
            </div>
          </fieldset>
        ))}
      </div>
      <button className="add-school-button" type="button" onClick={() => append({ schoolName: "", qualification: "", fieldOfStudy: "", startDate: "", endDate: "" })}><span aria-hidden="true">+</span>Add another school</button>
      <section className="wizard-review" aria-labelledby="review-heading">
        <div className="review-title-row">
          <div><p className="review-kicker">READY TO CREATE</p><h2 id="review-heading">Review this profile</h2></div>
          <span className="review-count">{fields.length} {fields.length === 1 ? "school" : "schools"}</span>
        </div>
        <dl className="review-details">
          <div><dt>Name</dt><dd>{[draft.firstName.trim(), draft.lastName.trim()].filter(Boolean).join(" ") || "Not entered"}</dd><button type="button" onClick={() => onEditStep(0)}>Edit</button></div>
          <div><dt>Contact</dt><dd>{draft.email.trim() || "Not entered"}</dd><button type="button" onClick={() => onEditStep(1)}>Edit</button></div>
          <div><dt>Location</dt><dd>{[draft.city.trim(), draft.country.trim()].filter(Boolean).join(", ") || "Not entered"}</dd><button type="button" onClick={() => onEditStep(2)}>Edit</button></div>
        </dl>
      </section>
    </div>
  );
}
