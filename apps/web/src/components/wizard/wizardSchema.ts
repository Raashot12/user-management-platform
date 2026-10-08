import type { FieldPath } from "react-hook-form";
import { z } from "zod";
import type { UserDraft } from "./wizardTypes";

function localToday() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(value + "T00:00:00.000Z");
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function isHttpUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

const requiredText = (label: string, minimum = 1) => z.string().refine(
  (value) => value.trim().length >= minimum,
  { message: minimum > 1 ? `${label} must be at least ${minimum} characters.` : `${label} is required.` },
);
const optionalUrl = (label: string) => z.string().refine(isHttpUrl, { message: `Enter a valid ${label} URL.` });
const optionalDate = z.string().refine((value) => !value || isIsoDate(value), { message: "Enter a valid date." });

const schoolSchema = z.object({
  schoolName: requiredText("School or institution", 2),
  qualification: z.string(),
  fieldOfStudy: z.string(),
  startDate: optionalDate,
  endDate: optionalDate,
}).refine((school) => !school.startDate || !school.endDate || school.startDate <= school.endDate, {
  path: ["endDate"],
  message: "End date must be after the start date.",
});

export const userDraftSchema = z.object({
  profilePhotoUrl: optionalUrl("profile photo"),
  firstName: requiredText("First name", 2),
  lastName: requiredText("Last name", 2),
  dob: z.string()
    .refine((value) => value.length > 0, { message: "Date of birth is required." })
    .refine(isIsoDate, { message: "Enter a valid date of birth." })
    .refine((value) => !isIsoDate(value) || value <= localToday(), { message: "Date of birth cannot be in the future." }),
  occupation: requiredText("Occupation", 2),
  gender: z.string().refine((value) => ["PREFER_NOT_TO_SAY", "FEMALE", "MALE", "OTHER"].includes(value), { message: "Choose a gender option." }),
  email: z.string().refine((value) => value.trim().length > 0, { message: "Email address is required." }).refine((value) => z.email().safeParse(value.trim()).success, { message: "Enter a valid email address." }),
  phoneNumber: z.string().regex(/^\+?[1-9][0-9]{7,14}$/, { message: "Enter 8 to 15 digits in international format, optionally starting with +." }),
  fax: z.string(),
  linkedInUrl: optionalUrl("LinkedIn profile"),
  address: requiredText("Street address", 3),
  city: requiredText("City"),
  state: requiredText("State or region"),
  country: requiredText("Country"),
  zipCode: requiredText("Postal code"),
  schools: z.array(schoolSchema).min(1, { message: "Add at least one school." }),
});

export const stepFields: FieldPath<UserDraft>[][] = [
  ["profilePhotoUrl", "firstName", "lastName", "dob", "gender", "occupation"],
  ["email", "phoneNumber", "fax", "linkedInUrl"],
  ["address", "city", "state", "country", "zipCode"],
  ["schools"],
];
