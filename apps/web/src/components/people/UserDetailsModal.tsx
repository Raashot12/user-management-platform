import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGetUserQuery, type User } from "../../usersApi";

function formatResumeDate(value?: string | null, includeDay = false): string {
  if (!value) return "—";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en", { day: includeDay ? "numeric" : undefined, month: "short", year: "numeric" }).format(new Date(year, month - 1, day));
}
const getResumeName = (user: User) => [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || "People profile";

type Props = { userId: string; onClose: () => void };
const emDash = "\u2014";
const display = (value?: string | null) => value?.trim() || emDash;
const initials = (user: User) => [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "P";
const safeLink = (value: string) => /^https?:\/\//i.test(value) ? value : undefined;
const icon = (path: string) => <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={path} strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function UserDetailsModal({ userId, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [exportError, setExportError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { data: user, isLoading, isError, refetch } = useGetUserQuery(userId, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, []);

  async function handleDocxDownload() {
    if (!user) return;
    setExportError("");
    setIsExporting(true);
    try { const { downloadResumeDocx } = await import("../shared/resume-docx-template"); await downloadResumeDocx(user); }
    catch { setExportError("The editable document could not be created. Please try again."); }
    finally { setIsExporting(false); }
  }

  async function handlePdfDownload() {
    if (!user) return;
    setExportError("");
    setIsExporting(true);
    try { const { downloadResumePdf } = await import("../shared/resume-pdf-template"); downloadResumePdf(user); }
    catch { setExportError("The PDF could not be created. Please try again."); }
    finally { setIsExporting(false); }
  }

  const fullName = user ? getResumeName(user) : "Resume preview";
  const address = user?.address ? [user.address.address, user.address.city, user.address.state, user.address.country, user.address.zipCode].filter(Boolean).join(", ") : emDash;
  const gender = display(user?.gender).replaceAll("_", " ").toLowerCase();

  return (
    <dialog ref={dialogRef} className="details-dialog resume-dialog" aria-labelledby="details-heading" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
      <header className="resume-dialog-header">
        <div className="resume-dialog-title"><span className="resume-title-icon">{icon("M5 3h7l4 4v10H5z M12 3v4h4 M8 11h5 M8 14h5")}</span><span><strong id="details-heading">Resume preview</strong><small>{isLoading ? "Loading profile…" : fullName}</small></span></div>
        <button type="button" className="resume-close" aria-label="Close resume preview" onClick={onClose}>{icon("M5 5l10 10M15 5 5 15")}</button>
      </header>

      <div className="resume-dialog-body" aria-busy={isLoading}>
        {isLoading && <div className="resume-state" role="status"><span className="loading-dot" /><strong>Preparing the resume</strong><span>Loading the full profile…</span></div>}
        {isError && <div className="resume-state resume-error" role="alert"><strong>Could not load this profile</strong><span>Check the API connection and try again.</span><button type="button" className="resume-retry" onClick={() => void refetch()}>Try again</button></div>}
        {!isLoading && !isError && user && <article className="resume-paper" aria-label={fullName + " resume"}>
          <aside className="resume-rail">
            <div className="resume-portrait" aria-label={user.profilePhotoUrl ? "Profile photo" : "Profile initials"}>
              <span>{initials(user)}</span>
              {user.profilePhotoUrl && <img src={user.profilePhotoUrl} alt={fullName} onError={(event) => { event.currentTarget.style.display = "none"; }} />}
            </div>
            <ResumeSection title="Contact">
              <ResumeLine label="Email" value={display(user.contact?.email)} />
              <ResumeLine label="Phone" value={display(user.contact?.phoneNumber)} />
              {user.contact?.fax && <ResumeLine label="Fax" value={user.contact.fax} />}
              {user.contact?.linkedInUrl && <ResumeLine label="LinkedIn" value={user.contact.linkedInUrl} href={safeLink(user.contact.linkedInUrl)} />}
            </ResumeSection>
            <ResumeSection title="Location"><p className="resume-address">{address}</p></ResumeSection>
            <ResumeSection title="Personal details">
              <ResumeLine label="Date of birth" value={formatResumeDate(user.dob, true)} />
              <ResumeLine label="Gender" value={gender} />
            </ResumeSection>
          </aside>
          <div className="resume-main">
            <p className="resume-kicker">PEOPLE <span>/</span> PROFILE RESUME</p>
            <h1>{fullName}</h1>
            <p className="resume-role">{display(user.occupation)}</p>
            <div className="resume-rule" />
            <section className="resume-main-section">
              <h2>Education</h2>
              {(user.academics ?? []).length === 0 && <p className="resume-empty">No academic background was added.</p>}
              <div className="resume-education-list">{(user.academics ?? []).map((school, index) => <article className="resume-education" key={school.id ?? school.schoolName + index}>
                <span className="resume-education-mark" aria-hidden="true" />
                <div><h3>{display(school.schoolName)}</h3><p>{[school.qualification, school.fieldOfStudy].filter(Boolean).join(" · ") || "Academic background"}</p><small>{[formatResumeDate(school.startDate), formatResumeDate(school.endDate)].filter((date) => date !== emDash).join(" — ") || emDash}</small></div>
              </article>)}</div>
            </section>
            <section className="resume-main-section resume-profile-section">
              <h2>Profile details</h2>
              <dl><div><dt>First name</dt><dd>{display(user.firstName)}</dd></div><div><dt>Last name</dt><dd>{display(user.lastName)}</dd></div><div><dt>Occupation</dt><dd>{display(user.occupation)}</dd></div></dl>
            </section>
          </div>
        </article>}
        {exportError && <p className="resume-export-error" role="alert">{exportError}</p>}
      </div>

      <footer className="resume-dialog-footer">
        <button type="button" className="secondary-button" onClick={onClose}>Close</button>
        <div className="resume-download-actions">
          <button type="button" className="resume-export-button resume-pdf-button" disabled={!user || isLoading || isError || isExporting} onClick={() => void handlePdfDownload()}>{icon("M5 2h7l4 4v12H5z M12 2v5h4 M7 12h6 M7 15h6")}<span>{isExporting ? "Preparing file…" : "Download PDF"}</span></button>
          <button type="button" className="resume-export-button resume-docx-button" disabled={!user || isLoading || isError || isExporting} onClick={() => void handleDocxDownload()}>{icon("M5 2h7l4 4v12H5z M12 2v5h4 M7 11h6 M7 14h6")}<span>{isExporting ? "Preparing DOCX…" : "Editable DOCX"}</span></button>
        </div>
      </footer>
    </dialog>
  );
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="resume-rail-section"><h2>{title}</h2>{children}</section>;
}

function ResumeLine({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = href ? <a href={href} target="_blank" rel="noreferrer">{value}</a> : value;
  return <div className="resume-line"><span>{label}</span><p>{content}</p></div>;
}
