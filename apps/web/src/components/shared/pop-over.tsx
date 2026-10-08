import { useEffect, useRef, useState, type ReactNode } from "react";

type PopOverItem = {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  tone?: "default" | "danger";
  disabled?: boolean;
};

type Props = { items: PopOverItem[]; label: string };

export function PopOver({ items, label }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="popover-root" ref={rootRef}>
      <button
        ref={triggerRef}
        className="popover-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          width="18"
          height="18"
          fill="currentColor"
        >
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="popover-menu" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              className={
                "popover-item" +
                (item.tone === "danger" ? " is-danger" : "") +
                (item.iconPosition === "right" ? " icon-right" : "")
              }
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.icon && (
                <span className="popover-item-icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
