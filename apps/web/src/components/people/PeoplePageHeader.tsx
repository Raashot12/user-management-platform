type Props = { onAddPerson: () => void };

export function PeoplePageHeader({ onAddPerson }: Props) {
  return (
    <>
      <header className="topbar">
        <span>Workspace <span className="crumb">/</span> People</span>
        <div className="top-actions">
          <button className="icon-button" aria-label="Notifications" type="button">
            <svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 8a5 5 0 0 0-10 0c0 6-2 6-2 7h14c0-1-2-1-2-7ZM8 18h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="avatar admin-avatar" aria-hidden="true">AD</span>
        </div>
      </header>
      <section className="page-heading">
        <div>
          <div className="eyebrow">DIRECTORY</div>
          <h1>People</h1>
          <p className="subtitle">Manage profiles and keep your team information in one place.</p>
        </div>
        <button className="primary-button add-person-button" onClick={onAddPerson}>
          <span aria-hidden="true">+</span>Add person
        </button>
      </section>
    </>
  );
}
