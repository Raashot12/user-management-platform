import { useState } from "react";
import type { User } from "../../usersApi";
import { isUserComplete, useDeleteUserMutation } from "../../usersApi";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { PopOver } from "../shared/pop-over";

type Props = {
  users: User[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number;
  isLoading: boolean; isError: boolean; onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void; onContinue: (user: User) => void; onViewDetails: (user: User) => void; onEdit: (user: User) => void;
};
const emDash = "\u2014";
const initials = (first = "", last = "") => (first.charAt(0) + last.charAt(0)).toUpperCase();
const menuIcon = (path: string) => <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={path} strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function PeopleDirectory({ users, totalCount, pageNumber, pageSize, totalPages, isLoading, isError, onPageChange, onPageSizeChange, onContinue, onViewDetails, onEdit }: Props) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const visibleUsers = users.filter((user) =>
    (user.firstName + " " + user.lastName + " " + user.occupation + " " + (user.contact?.email ?? "")).toLowerCase().includes(search.toLowerCase()),
  );
  const lastPage = Math.max(1, totalPages);
  const rangeStart = totalCount ? (pageNumber - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(pageNumber * pageSize, totalCount);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteError("");
    try { await deleteUser(deleteTarget.id).unwrap(); setDeleteTarget(null); }
    catch { setDeleteError("The profile could not be deleted. Please try again."); }
  }

  return <>
    <section className="toolbar" aria-label="Directory controls">
      <label className="search"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" strokeLinecap="round" /></svg><input placeholder="Search this page..." aria-label="Search people on this page" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <div className="view-toggle" role="group" aria-label="Directory view">
        <button className={viewMode === "list" ? "selected" : ""} aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}><svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 4h12M3 9h12M3 14h12" strokeLinecap="round" /></svg></button>
        <button className={viewMode === "grid" ? "selected" : ""} aria-label="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}><svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="10" y="3" width="5" height="5" rx="1" /><rect x="3" y="10" width="5" height="5" rx="1" /><rect x="10" y="10" width="5" height="5" rx="1" /></svg></button>
      </div>
    </section>
    <section className={"directory-card" + (viewMode === "grid" ? " is-grid" : "")} aria-label="People directory">
      <div className="table-head"><span>NAME</span><span>ROLE</span><span>LOCATION</span><span>CONTACT</span><span>EDUCATION</span><span>STATUS</span><span /></div>
      {isLoading && <div className="empty-state" role="status"><span className="loading-dot" />Loading directory...</div>}
      {isError && <div className="empty-state error-state" role="alert"><strong>Could not connect to the API</strong><span>Start the API and PostgreSQL, then refresh this page.</span><code>corepack pnpm dev</code></div>}
      {!isLoading && !isError && totalCount === 0 && <div className="empty-state"><span className="empty-icon" aria-hidden="true">P</span><strong>Your directory is ready</strong><span>Add a person to create the first profile.</span></div>}
      {!isLoading && !isError && totalCount > 0 && visibleUsers.length === 0 && <div className="empty-state"><strong>No matching people</strong><span>Try a different name, role, or email on this page.</span></div>}
      {visibleUsers.map((user) => {
        const complete = isUserComplete(user);
        const fullName = (user.firstName + " " + user.lastName).trim();
        const location = complete ? [user.address?.city, user.address?.country].filter(Boolean).join(", ") || emDash : emDash;
        const contact = complete ? user.contact?.phoneNumber || emDash : emDash;
        const education = complete ? user.academics?.[0]?.schoolName || emDash : emDash;
        const items = [
          ...(complete
            ? [
                { label: "View details", icon: menuIcon("M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"), onSelect: () => onViewDetails(user) },
                { label: "Edit", icon: menuIcon("M4 13.5V16h2.5L15 7.5 12.5 5 4 13.5Z M11.5 6l2.5 2.5"), onSelect: () => onEdit(user) },
              ]
            : [{ label: "Continue", icon: menuIcon("M4 10h11 M11 6l4 4-4 4"), onSelect: () => onContinue(user) }]),
          { label: "Delete", icon: menuIcon("M4 6h12 M8 6V4h4v2 M6 6l1 10h6l1-10"), iconPosition: "right" as const, tone: "danger" as const, onSelect: () => { setDeleteError(""); setDeleteTarget(user); } },
        ];
        return <article className={"person-row" + (complete ? "" : " is-incomplete")} key={user.id}>
          <div className="person-cell" data-label="Name"><PersonAvatar user={user} /><span><strong>{fullName}</strong><small>{complete ? user.contact?.email || emDash : "Profile saved"}</small></span></div>
          <span className="role-cell" data-label="Role">{user.occupation || emDash}</span>
          <span className="location-cell" data-label="Location">{location}</span>
          <span className="contact-cell" data-label="Contact">{contact}</span>
          <span className="education-cell" data-label="Education">{education}</span>
          <span className="status-cell" data-label="Status"><span className={complete ? "status-badge is-complete" : "status-badge is-incomplete"}>{complete ? "Completed" : "Incomplete"}</span></span>
          <span className="person-menu"><PopOver label={"Actions for " + fullName} items={items} /></span>
        </article>;
      })}
    </section>
    <nav className="directory-pagination" aria-label="People pages">
      <div className="pagination-summary">{search ? visibleUsers.length + " matching on this page \u00b7 " : ""}Showing {rangeStart}{rangeStart !== rangeEnd ? "\u2013" + rangeEnd : ""} of {totalCount} people</div>
      <div className="pagination-controls">
        <label className="page-size-control">Rows<select aria-label="Rows per page" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></label>
        <span className="page-indicator">Page {pageNumber} of {lastPage}</span>
        <button className="page-button" type="button" aria-label="Previous page" disabled={pageNumber <= 1} onClick={() => onPageChange(pageNumber - 1)}>Previous</button>
        <button className="page-button" type="button" aria-label="Next page" disabled={pageNumber >= lastPage} onClick={() => onPageChange(pageNumber + 1)}>Next</button>
      </div>
    </nav>
    <footer className="page-footer"><span>{totalCount} people total</span><span>People directory <span className="footer-dot" aria-hidden="true" /> {isError ? "API connection needed" : isLoading ? "Connecting to API..." : "Connected to API"}</span></footer>
    {deleteTarget && <ConfirmDeleteDialog userName={[deleteTarget.firstName, deleteTarget.lastName].join(" ")} isDeleting={isDeleting} error={deleteError} onCancel={() => { if (!isDeleting) setDeleteTarget(null); }} onConfirm={() => void confirmDelete()} />}
  </>;
}

function PersonAvatar({ user }: { user: User }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <span className="avatar person-avatar" aria-hidden="true">
      {user.profilePhotoUrl && !imageFailed
        ? <img src={user.profilePhotoUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        : initials(user.firstName, user.lastName)}
    </span>
  );
}
