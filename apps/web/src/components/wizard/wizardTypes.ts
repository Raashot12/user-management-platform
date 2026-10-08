export type SchoolDraft = {
  schoolName: string;
  qualification: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
};

export type UserDraft = {
  profilePhotoUrl: string;
  firstName: string;
  lastName: string;
  dob: string;
  occupation: string;
  gender: string;
  email: string;
  phoneNumber: string;
  fax: string;
  linkedInUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  schools: SchoolDraft[];
};

export type UserDraftField = Exclude<keyof UserDraft, "schools">;
export type WizardStep = { title: string; detail: string; heading: string; intro: string };

export const wizardSteps: WizardStep[] = [
  { title: "Profile", detail: "The essentials that identify this person.", heading: "Profile information", intro: "Start with the details that make this profile recognizable." },
  { title: "Contact", detail: "Ways to reach and connect.", heading: "Contact information", intro: "Add the best ways to reach this person." },
  { title: "Address", detail: "Location and mailing details.", heading: "Address", intro: "Add their primary location." },
  { title: "Education", detail: "Schools and a final review.", heading: "Education and review", intro: "Add past schools, then review the profile before creating it." },
];

export const createEmptySchool = (): SchoolDraft => ({ schoolName: "", qualification: "", fieldOfStudy: "", startDate: "", endDate: "" });
export const createInitialDraft = (): UserDraft => ({
  profilePhotoUrl: "", firstName: "", lastName: "", dob: "", occupation: "", gender: "PREFER_NOT_TO_SAY",
  email: "", phoneNumber: "", fax: "", linkedInUrl: "", address: "", city: "", state: "", country: "", zipCode: "",
  schools: [createEmptySchool()],
});
