import { useEffect, useRef, useState, type FormEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  useAddUserAcademicsMutation,
  useAddUserAddressMutation,
  useAddUserContactMutation,
  useCreateUserInfoMutation,
  useUpdateUserMutation,
  type School,
  type User,
} from "./usersApi";
import { AddressStep } from "./components/wizard/steps/AddressStep";
import { ContactStep } from "./components/wizard/steps/ContactStep";
import { EducationStep } from "./components/wizard/steps/EducationStep";
import { ProfileStep } from "./components/wizard/steps/ProfileStep";
import { WizardActions } from "./components/wizard/WizardActions";
import { WizardHeader } from "./components/wizard/WizardHeader";
import { WizardProgressRail } from "./components/wizard/WizardProgressRail";
import {
  createEmptySchool,
  createInitialDraft,
  wizardSteps,
  type SchoolDraft,
  type UserDraft,
} from "./components/wizard/wizardTypes";
import { stepFields, userDraftSchema } from "./components/wizard/wizardSchema";
import "./wizard.css";

gsap.registerPlugin(useGSAP);

type Props = { onClose: () => void; user?: User; startAtBeginning?: boolean };

function getResumeStep(user?: User) {
  if (!user) return 0;
  if (!user.contact?.email || !user.contact.phoneNumber) return 1;
  if (!user.address?.address || !user.address.city || !user.address.state || !user.address.country || !user.address.zipCode) return 2;
  return 3;
}

function toDraft(user?: User): UserDraft {
  if (!user) return createInitialDraft();
  const schools: SchoolDraft[] = (user.academics ?? []).map((school) => ({
    schoolName: school.schoolName ?? "",
    qualification: school.qualification ?? "",
    fieldOfStudy: school.fieldOfStudy ?? "",
    startDate: school.startDate ?? "",
    endDate: school.endDate ?? "",
  }));
  return {
    ...createInitialDraft(),
    profilePhotoUrl: user.profilePhotoUrl ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
    occupation: user.occupation,
    gender: user.gender,
    email: user.contact?.email ?? "",
    phoneNumber: user.contact?.phoneNumber ?? "",
    fax: user.contact?.fax ?? "",
    linkedInUrl: user.contact?.linkedInUrl ?? "",
    address: user.address?.address ?? "",
    city: user.address?.city ?? "",
    state: user.address?.state ?? "",
    country: user.address?.country ?? "",
    zipCode: user.address?.zipCode ?? "",
    schools: schools.length ? schools : [createEmptySchool()],
  };
}

export function CreateUserWizard({ onClose, user, startAtBeginning = false }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(() => (user && !startAtBeginning ? getResumeStep(user) : 0));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(() => user?.id ?? null);
  const [savedSections, setSavedSections] = useState(() => ({
    contact: Boolean(user?.contact?.email && user.contact.phoneNumber),
    address: Boolean(user?.address?.address && user.address.city && user.address.state && user.address.country && user.address.zipCode),
    academics: Boolean(user?.academics?.length),
  }));
  const form = useForm<UserDraft>({
    resolver: zodResolver(userDraftSchema),
    defaultValues: toDraft(user),
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });
  const { trigger, getValues } = form;
  const [createUserInfo] = useCreateUserInfoMutation();
  const [addContact] = useAddUserContactMutation();
  const [addAddress] = useAddUserAddressMutation();
  const [addAcademics] = useAddUserAcademicsMutation();
  const [updateUser] = useUpdateUserMutation();
  const isLastStep = step === wizardSteps.length - 1;
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  const today = localToday.toISOString().slice(0, 10);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, []);

  useGSAP(() => {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(panel, { autoAlpha: 0, y: 8, filter: "blur(2px)" }, {
      autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.24, ease: "power2.out",
    });
  }, { scope: dialogRef, dependencies: [step], revertOnUpdate: true });

  function closeWizard() {
    if (isSubmitting) return;
    setError("");
    onClose();
  }

  async function saveCurrentStep(values: UserDraft) {
    setError("");
    setIsSubmitting(true);
    let profileId = createdUserId;
    try {
      if (step === 0) {
        const userInfo = {
          ...(values.profilePhotoUrl.trim() ? { profilePhotoUrl: values.profilePhotoUrl.trim() } : {}),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          dob: values.dob,
          occupation: values.occupation.trim(),
          gender: values.gender,
        };
        if (profileId) await updateUser({ id: profileId, body: { userInfo } }).unwrap();
        else {
          const profile = await createUserInfo(userInfo).unwrap();
          profileId = profile.id;
          setCreatedUserId(profile.id);
        }
      } else if (step === 1) {
        if (!profileId) throw new Error("Save the profile step before contact details.");
        const contact = {
          email: values.email.trim(),
          phoneNumber: values.phoneNumber.trim(),
          ...(values.fax.trim() ? { fax: values.fax.trim() } : {}),
          ...(values.linkedInUrl.trim() ? { linkedInUrl: values.linkedInUrl.trim() } : {}),
        };
        if (savedSections.contact) await updateUser({ id: profileId, body: { userContact: contact } }).unwrap();
        else {
          try { await addContact({ id: profileId, body: contact }).unwrap(); }
          catch { await updateUser({ id: profileId, body: { userContact: contact } }).unwrap(); }
          setSavedSections((current) => ({ ...current, contact: true }));
        }
      } else if (step === 2) {
        if (!profileId) throw new Error("Save the profile step before address details.");
        const address = {
          address: values.address.trim(), city: values.city.trim(), state: values.state.trim(),
          country: values.country.trim(), zipCode: values.zipCode.trim(),
        };
        if (savedSections.address) await updateUser({ id: profileId, body: { userAddress: address } }).unwrap();
        else {
          try { await addAddress({ id: profileId, body: address }).unwrap(); }
          catch { await updateUser({ id: profileId, body: { userAddress: address } }).unwrap(); }
          setSavedSections((current) => ({ ...current, address: true }));
        }
      } else {
        if (!profileId) throw new Error("Save the profile step before education details.");
        const schools: School[] = values.schools.map((school) => ({
          schoolName: school.schoolName.trim(),
          ...(school.qualification.trim() ? { qualification: school.qualification.trim() } : {}),
          ...(school.fieldOfStudy.trim() ? { fieldOfStudy: school.fieldOfStudy.trim() } : {}),
          ...(school.startDate ? { startDate: school.startDate } : {}),
          ...(school.endDate ? { endDate: school.endDate } : {}),
        }));
        if (savedSections.academics) await updateUser({ id: profileId, body: { userAcademics: { schools } } }).unwrap();
        else {
          try { await addAcademics({ id: profileId, body: { schools } }).unwrap(); }
          catch { await updateUser({ id: profileId, body: { userAcademics: { schools } } }).unwrap(); }
          setSavedSections((current) => ({ ...current, academics: true }));
        }
      }

      if (isLastStep) onClose();
      else setStep((current) => Math.min(current + 1, wizardSteps.length - 1));
    } catch {
      setError("This step could not be saved. Your entries are still here; try again when the connection is available.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (!valid) return;
    await saveCurrentStep(getValues());
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(0, current - 1));
  }

  function goToStep(index: number) {
    if (index <= step) {
      setError("");
      setStep(index);
    }
  }

  return (
    <dialog ref={dialogRef} className="wizard-dialog" aria-labelledby="wizard-heading"
      onCancel={(event) => { event.preventDefault(); closeWizard(); }}
      onClick={(event) => { if (event.target === event.currentTarget) closeWizard(); }}>
      <div className="wizard-layout">
        <WizardProgressRail step={step} steps={wizardSteps} isSubmitting={isSubmitting} onSelectStep={goToStep} />
        <section className="wizard-main">
          <WizardHeader step={step} steps={wizardSteps} isSubmitting={isSubmitting} onClose={closeWizard} />
          <div className="wizard-step-panel" ref={panelRef}>
            <FormProvider {...form}>
              <form className="wizard-form" noValidate onSubmit={(event) => void handleContinue(event)}>
                <div className="wizard-form-scroll">
                  <p className="wizard-step-count">STEP {String(step + 1).padStart(2, "0")}</p>
                  <h1 id="wizard-heading">{wizardSteps[step].heading}</h1>
                  <p className="wizard-intro">{wizardSteps[step].intro}</p>
                  {step === 0 && <ProfileStep today={today} />}
                  {step === 1 && <ContactStep />}
                  {step === 2 && <AddressStep />}
                  {step === 3 && <EducationStep onEditStep={goToStep} />}
                </div>
                {error && <p className="wizard-error" role="alert">{error}</p>}
                <WizardActions step={step} isLastStep={isLastStep} isSubmitting={isSubmitting} onCancel={closeWizard} onBack={goBack} />
              </form>
            </FormProvider>
          </div>
        </section>
      </div>
    </dialog>
  );
}
