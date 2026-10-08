import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { User } from "../../usersApi";

const valueOrDash = (value?: string | null) => value?.trim() || "—";
export function formatResumeDate(
  value?: string | null,
  includeDay = false,
): string {
  if (!value) return "—";
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
function docxHeading(text: string, side = false): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        color: side ? "D5E9DA" : "1B523D",
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 120 },
    border: {
      bottom: {
        color: side ? "4C7C61" : "DDE7DF",
        style: BorderStyle.SINGLE,
        size: 5,
        space: 4,
      },
    },
  });
}

function docxLabelValue(
  label: string,
  value?: string | null,
  side = false,
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}  `,
        bold: true,
        color: side ? "D5E9DA" : "64756A",
      }),
      new TextRun({
        text: valueOrDash(value),
        color: side ? "FFFFFF" : "26372D",
      }),
    ],
    spacing: { after: 110 },
  });
}

export async function downloadResumeDocx(user: User): Promise<void> {
  const fullName = getResumeName(user);
  const initials =
    [user.firstName?.[0], user.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "P";
  const contact = user.contact;
  const address = user.address;
  const leftChildren = [
    new Paragraph({
      children: [
        new TextRun({ text: initials, bold: true, size: 32, color: "1B523D" }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 260 },
    }),
    docxHeading("Contact", true),
    ...(contact
      ? [
          docxLabelValue("Email", contact.email, true),
          docxLabelValue("Phone", contact.phoneNumber, true),
          ...(contact.linkedInUrl
            ? [docxLabelValue("LinkedIn", contact.linkedInUrl, true)]
            : []),
          ...(contact.fax ? [docxLabelValue("Fax", contact.fax, true)] : []),
        ]
      : [docxLabelValue("Contact", "—", true)]),
    docxHeading("Location", true),
    docxLabelValue("Address", address?.address, true),
    docxLabelValue("City", address?.city, true),
    docxLabelValue("Region", address?.state, true),
    docxLabelValue("Country", address?.country, true),
    docxLabelValue("Postal code", address?.zipCode, true),
    docxHeading("Personal", true),
    docxLabelValue("Date of birth", formatResumeDate(user.dob, true), true),
    docxLabelValue(
      "Gender",
      valueOrDash(user.gender).replaceAll("_", " ").toLowerCase(),
      true,
    ),
  ];
  const rightChildren: Paragraph[] = [
    new Paragraph({
      text: "PEOPLE  /  PROFILE RESUME",
      style: "Subtitle",
      spacing: { after: 240 },
    }),
    new Paragraph({
      text: fullName,
      heading: HeadingLevel.TITLE,
      spacing: { after: 80 },
    }),
    new Paragraph({
      text: valueOrDash(user.occupation),
      style: "Subtitle",
      spacing: { after: 320 },
    }),
    docxHeading("Education"),
  ];
  const schools = user.academics ?? [];
  if (!schools.length)
    rightChildren.push(new Paragraph({ text: "—", spacing: { after: 160 } }));
  schools.forEach((school) => {
    rightChildren.push(
      new Paragraph({
        text: valueOrDash(school.schoolName),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 140, after: 60 },
      }),
    );
    const qualification = [school.qualification, school.fieldOfStudy]
      .filter(Boolean)
      .join("  ·  ");
    if (qualification)
      rightChildren.push(
        new Paragraph({ text: qualification, spacing: { after: 60 } }),
      );
    const dates = [
      formatResumeDate(school.startDate),
      formatResumeDate(school.endDate),
    ]
      .filter((date) => date !== "—")
      .join("  —  ");
    if (dates)
      rightChildren.push(
        new Paragraph({
          children: [new TextRun({ text: dates, color: "598E6C", size: 19 })],
          spacing: { after: 100 },
        }),
      );
  });

  const leftCell = new TableCell({
    width: { size: 3300, type: WidthType.DXA },
    shading: { fill: "1B523D", type: ShadingType.CLEAR },
    margins: { top: 220, right: 220, bottom: 220, left: 280 },
    children: leftChildren,
  });
  const rightCell = new TableCell({
    width: { size: 6700, type: WidthType.DXA },
    margins: { top: 300, right: 380, bottom: 300, left: 400 },
    children: rightChildren,
  });
  const layout = new Table({
    width: { size: 10000, type: WidthType.DXA },
    columnWidths: [3300, 6700],
    rows: [new TableRow({ children: [leftCell, rightCell] })],
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
  });
  const resumeDocument = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Aptos", size: 21, color: "26372D" },
          paragraph: { spacing: { line: 280 } },
        },
      },
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          run: { font: "Aptos Display", size: 44, bold: true, color: "1F2C24" },
          paragraph: { spacing: { after: 120 } },
        },
        {
          id: "Subtitle",
          name: "Subtitle",
          basedOn: "Normal",
          run: { font: "Aptos", size: 22, color: "64756A" },
          paragraph: { spacing: { after: 100 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          run: { font: "Aptos", size: 21, bold: true, color: "1B523D" },
          paragraph: { spacing: { before: 200, after: 110 } },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          run: { font: "Aptos", size: 23, bold: true, color: "26372D" },
          paragraph: { spacing: { before: 140, after: 60 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 650, right: 650, bottom: 650, left: 650 } },
        },
        children: [layout],
      },
    ],
  });
  const blob = await Packer.toBlob(resumeDocument);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeFileName(fullName)}-resume.docx`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
