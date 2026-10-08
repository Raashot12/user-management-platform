import { jsPDF as JSpdf, type TextOptionsLight } from "jspdf";
import type { User } from "../../usersApi";

const palette = {
  forest: [27, 82, 61] as [number, number, number],
  leaf: [47, 104, 68] as [number, number, number],
  ink: [31, 44, 36] as [number, number, number],
  muted: [103, 117, 107] as [number, number, number],
  pale: [240, 246, 241] as [number, number, number],
  line: [222, 231, 224] as [number, number, number],
};

const valueOrDash = (value?: string | null) => value?.trim() || "\u2014";

export function formatResumeDate(
  value?: string | null,
  includeDay = false,
): string {
  if (!value) return "\u2014";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en", {
    day: includeDay ? "numeric" : undefined,
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function getResumeName(user: User): string {
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    "People profile"
  );
}

function safeFileName(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "profile"
  );
}

function drawPdfSidebar(pdf: JSpdf, user: User, initials: string) {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const sidebarWidth = 58;
  pdf.setFillColor(...palette.forest);
  pdf.rect(0, 0, sidebarWidth, pageHeight, "F");
  pdf.setFillColor(255, 255, 255);
  pdf.circle(sidebarWidth / 2, 34, 17, "F");
  pdf.setTextColor(...palette.forest);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(initials, sidebarWidth / 2, 38, { align: "center" });

  const drawSideSection = (
    title: string,
    rows: { label: string; value?: string | null }[],
    startY: number,
  ) => {
    pdf.setTextColor(190, 220, 197);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(title.toUpperCase(), 9, startY);
    pdf.setDrawColor(92, 142, 109);
    pdf.setLineWidth(0.35);
    pdf.line(9, startY + 4, sidebarWidth - 9, startY + 4);
    let y = startY + 12;
    rows.filter((row) => row.value?.trim()).forEach((row) => {
      pdf.setTextColor(190, 220, 197);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.5);
      pdf.text(row.label.toUpperCase(), 9, y);
      y += 3.5;
      pdf.setTextColor(250, 253, 250);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      const lines = pdf.splitTextToSize(row.value!.trim(), sidebarWidth - 18) as string[];
      pdf.text(lines, 9, y);
      y += lines.length * 4.5 + 3.5;
    });
    return y;
  };

  let y = drawSideSection(
    "Contact",
    [
      { label: "Email", value: user.contact?.email },
      { label: "Phone", value: user.contact?.phoneNumber },
      { label: "LinkedIn", value: user.contact?.linkedInUrl },
      { label: "Fax", value: user.contact?.fax },
    ],
    64,
  );
  y += 8;
  y = drawSideSection(
    "Location",
    [{ label: "Address", value: user.address ? [user.address.address, user.address.city, user.address.state, user.address.country, user.address.zipCode].filter(Boolean).join(", ") : undefined }],
    y,
  ) + 8;
  drawSideSection(
    "Personal",
    [
      { label: "Date of birth", value: formatResumeDate(user.dob, true) },
      { label: "Gender", value: valueOrDash(user.gender).replaceAll("_", " ").toLowerCase() },
    ],
    y,
  );
  return sidebarWidth;
}

export function downloadResumePdf(user: User): void {
  const pdf = new JSpdf({ orientation: "portrait", unit: "mm", format: "a4" });
  const name = getResumeName(user);
  const initials =
    [user.firstName?.[0], user.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "P";
  const textOptions: TextOptionsLight = { align: "left" };
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const sidebarWidth = drawPdfSidebar(pdf, user, initials);
  const mainX = sidebarWidth + 10;
  const mainWidth = pageWidth - mainX - 10;
  let y = 21;

  pdf.setTextColor(...palette.leaf);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("PEOPLE  /  PROFILE RESUME", mainX, y, textOptions);
  y += 12;
  const nameLines = pdf.splitTextToSize(name, mainWidth) as string[];
  pdf.setTextColor(...palette.ink);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text(nameLines, mainX, y, textOptions);
  y += nameLines.length * 9 + 1;
  pdf.setTextColor(...palette.muted);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  const roleLines = pdf.splitTextToSize(
    valueOrDash(user.occupation),
    mainWidth,
  ) as string[];
  pdf.text(roleLines, mainX, y, textOptions);
  y += roleLines.length * 5.5 + 8;
  pdf.setDrawColor(...palette.line);
  pdf.setLineWidth(0.5);
  pdf.line(mainX, y, pageWidth - 10, y);
  y += 12;

  const sectionHeading = (title: string) => {
    pdf.setTextColor(...palette.forest);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(title.toUpperCase(), mainX, y);
    y += 6;
  };
  const newPage = () => {
    pdf.addPage();
    drawPdfSidebar(pdf, user, initials);
    y = 20;
    pdf.setTextColor(...palette.muted);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(`${name}  /  PROFILE RESUME`, mainX, y);
    y += 13;
  };

  sectionHeading("Education");
  const schools = user.academics ?? [];
  if (schools.length === 0) {
    pdf.setTextColor(...palette.muted);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("—", mainX, y);
    y += 10;
  } else {
    schools.forEach((school) => {
      const schoolLines = pdf.splitTextToSize(
        valueOrDash(school.schoolName),
        mainWidth,
      ) as string[];
      const detail = [school.qualification, school.fieldOfStudy]
        .filter(Boolean)
        .join("  ·  ");
      const detailLines = detail
        ? (pdf.splitTextToSize(detail, mainWidth) as string[])
        : [];
      const dates = [
        formatResumeDate(school.startDate),
        formatResumeDate(school.endDate),
      ]
        .filter((date) => date !== "—")
        .join("  —  ");
      const blockHeight =
        schoolLines.length * 5.5 +
        detailLines.length * 4.5 +
        (dates ? 10 : 5) +
        12;
      if (y + blockHeight > pageHeight - 18) newPage();
      pdf.setFillColor(...palette.leaf);
      pdf.circle(mainX + 1, y - 1, 1.1, "F");
      pdf.setTextColor(...palette.ink);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(schoolLines, mainX + 6, y, textOptions);
      y += schoolLines.length * 5.5 + 1;
      if (detailLines.length) {
        pdf.setTextColor(...palette.muted);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(detailLines, mainX + 6, y, textOptions);
        y += detailLines.length * 4.5 + 1;
      }
      if (dates) {
        pdf.setTextColor(...palette.leaf);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.text(dates, mainX + 6, y, textOptions);
        y += 6;
      }
      y += 5;
    });
  }

  const profileFields = [
    { label: "First name", value: valueOrDash(user.firstName) },
    { label: "Last name", value: valueOrDash(user.lastName) },
    { label: "Occupation", value: valueOrDash(user.occupation) },
  ];
  if (y + 48 > pageHeight - 16) newPage();
  y += 8;
  sectionHeading("Profile Details");
  const detailGap = 10;
  const detailColumnWidth = (mainWidth - detailGap) / 2;
  const drawProfileField = (label: string, value: string, x: number, width: number, top: number) => {
    pdf.setTextColor(...palette.muted);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.text(label.toUpperCase(), x, top);
    const lines = pdf.splitTextToSize(value, width) as string[];
    pdf.setTextColor(...palette.ink);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(lines, x, top + 5);
    return lines.length * 5 + 5;
  };
  const firstFieldHeight = drawProfileField(profileFields[0].label, profileFields[0].value, mainX, detailColumnWidth, y);
  const lastFieldHeight = drawProfileField(profileFields[1].label, profileFields[1].value, mainX + detailColumnWidth + detailGap, detailColumnWidth, y);
  y += Math.max(firstFieldHeight, lastFieldHeight) + 7;
  y += drawProfileField(profileFields[2].label, profileFields[2].value, mainX, mainWidth, y) + 5;

  pdf.save(`${safeFileName(name)}-resume.pdf`);
}
