import type { User } from "../../usersApi";

type Props = { peopleCount: number };

export function WorkspaceSidebar({ peopleCount }: Props) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#people" aria-label="People workspace home">
        <span className="brand-mark" aria-hidden="true">p</span>
        <span>people<span className="brand-dot">.</span></span>
      </a>
      <div className="workspace-label">WORKSPACE</div>
      <nav aria-label="Workspace navigation">
        <a className="nav-item active" href="#people" aria-current="page">
          <span className="nav-symbol" aria-hidden="true">P</span>
          People<span className="nav-count">{peopleCount}</span>
        </a>
        <a className="nav-item muted" href="#documents"><span className="nav-symbol" aria-hidden="true">D</span>Documents</a>
        <a className="nav-item muted" href="#settings"><span className="nav-symbol" aria-hidden="true">S</span>Settings</a>
      </nav>
      <div className="sidebar-bottom">
        <span className="avatar admin-avatar" aria-hidden="true">AD</span>
        <span><strong>Admin user</strong><small>Workspace admin</small></span>
        <span className="more" aria-hidden="true">���</span>
      </div>
    </aside>
  );
}
