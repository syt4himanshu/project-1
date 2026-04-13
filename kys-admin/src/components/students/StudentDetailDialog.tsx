import { useMemo, useRef, useState } from "react";
import { Printer, Download, Loader2, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import InfoTable from "@/components/shared/InfoTable";
import CollapsibleSection from "@/components/shared/CollapsibleSection";
import { useStudentDetail } from "@/hooks/useStudents";
import { formatDate } from "@/lib/utils";

interface Props {
  studentId: number | null;
  onClose: () => void;
}

const GOAL_COLORS: Record<string, string> = {
  Placement: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Higher Studies": "bg-amber-100 text-amber-700 border-amber-200",
  "Not Decided": "bg-slate-100 text-slate-700 border-slate-200",
};

const SESSION_LABEL = "KYS-Mentoring System 2026-27";

type AnyRecord = Record<string, unknown>;

function textValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  return String(value).trim();
}

function isEmpty(value: unknown) {
  const text = textValue(value).toLowerCase();
  return (
    text === "" ||
    text === "n/a" ||
    text === "na" ||
    text === "none" ||
    text === "-" ||
    text === "--" ||
    text === "null" ||
    text === "undefined"
  );
}

function showValue(value: unknown) {
  if (isEmpty(value)) return "N/A";
  const text = textValue(value);
  if (text === "HSSC") return "HSC";
  return text;
}

function pick(record: AnyRecord | undefined, ...keys: string[]) {
  if (!record) return "";
  for (const key of keys) {
    const value = record[key];
    if (!isEmpty(value)) return value;
  }
  return "";
}

function extractBacklogSubjects(record: AnyRecord) {
  const raw = textValue(record.backlog_subjects);
  if (!raw) return [];
  return raw
    .split(/[,\n;]+/)
    .map((subject) => subject.trim())
    .filter((subject) => !isEmpty(subject));
}

function normalizeBacklogCount(record: AnyRecord) {
  const numeric = Number(record.backlogs);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  return extractBacklogSubjects(record).length;
}

function normalizeActiveBacklogCount(records: AnyRecord[], source?: AnyRecord) {
  const directCandidates = [
    source?.number_of_active_backlogs,
    source?.active_backlogs,
    source?.current_backlogs,
  ];
  for (const candidate of directCandidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  }

  if (!records.length) return 0;
  const latest = [...records]
    .sort((a, b) => Number(a.semester ?? 0) - Number(b.semester ?? 0))
    .at(-1);
  return latest ? normalizeBacklogCount(latest) : 0;
}

async function nextFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function uniqueSorted(values: number[]) {
  return Array.from(new Set(values.map((v) => Math.round(v)))).sort(
    (a, b) => a - b,
  );
}

export default function StudentDetailDialog({ studentId, onClose }: Props) {
  const { data: student, isLoading } = useStudentDetail(studentId ?? 0);
  const printRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [forceOpenForExport, setForceOpenForExport] = useState(false);
  const studentRecord = useMemo(
    () => (student as AnyRecord | undefined) ?? undefined,
    [student],
  );

  const prepareFullContent = async () => {
    setForceOpenForExport(true);
    await nextFrame();
    await nextFrame();
  };

  const cleanupFullContent = () => {
    setForceOpenForExport(false);
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      await prepareFullContent();
      const printWindow = window.open("", "_blank", "width=1200,height=900");
      if (!printWindow) return;

      const styleTags = Array.from(
        document.querySelectorAll('style, link[rel="stylesheet"]'),
      )
        .map((node) => node.outerHTML)
        .join("\n");

      printWindow.document.write(`
                <html>
                    <head>
                        <title>${showValue(
                          studentRecord?.name ??
                            studentRecord?.uid ??
                            "Student",
                        )} - Profile</title>
                        ${styleTags}
                        <style>
                            body { margin: 0; padding: 20px; background: white; }
                            #print-root { max-width: 1100px; margin: 0 auto; }
                        </style>
                    </head>
                    <body>
                        <div id="print-root">${printRef.current.innerHTML}</div>
                    </body>
                </html>
            `);
      printWindow.document.close();
      await new Promise<void>((resolve) => {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
            resolve();
          }, 150);
        };
      });
    } finally {
      cleanupFullContent();
      setExporting(false);
    }
  };

  const handlePDF = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      await prepareFullContent();
      await nextFrame();
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");
      const exportRoot = printRef.current;
      exportRoot.classList.add("pdf-export-mode");
      await nextFrame();

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const canvas = await html2canvas(exportRoot, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginTop = 8;
      const marginBottom = 12;
      const marginX = 8;
      const imageWidth = pageWidth - marginX * 2;
      const usablePageHeight = pageHeight - marginTop - marginBottom;
      const mmPerPixel = imageWidth / canvas.width;
      const pagePixelHeight = Math.floor(usablePageHeight / mmPerPixel);
      const minChunkHeight = 120;
      const rootRect = exportRoot.getBoundingClientRect();
      const rootHeight = Math.max(exportRoot.scrollHeight, rootRect.height, 1);
      const scaleY = canvas.height / rootHeight;

      const boundaryElements = Array.from(
        exportRoot.querySelectorAll(".section, table, tbody > tr"),
      ).filter((el): el is HTMLElement => el instanceof HTMLElement);

      const boundaries = uniqueSorted(
        boundaryElements
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const relativeBottom = rect.bottom - rootRect.top;
            return Math.max(
              0,
              Math.min(canvas.height, Math.round(relativeBottom * scaleY)),
            );
          })
          .concat([canvas.height]),
      );

      let cursor = 0;
      let pageIndex = 0;
      while (cursor < canvas.height - 1) {
        const targetEnd = Math.min(canvas.height, cursor + pagePixelHeight);
        const candidateCuts = boundaries.filter(
          (y) => y > cursor && y <= targetEnd,
        );
        const cutEnd = candidateCuts.length
          ? candidateCuts[candidateCuts.length - 1]
          : targetEnd;
        const cutPoint = Math.min(canvas.height, cutEnd);
        const sliceHeight = Math.max(1, cutPoint - cursor);

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) break;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          cursor,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight,
        );

        if (pageIndex > 0) pdf.addPage();
        const sliceHeightMm = sliceHeight * mmPerPixel;
        const pageImg = pageCanvas.toDataURL("image/png");
        pdf.addImage(
          pageImg,
          "PNG",
          marginX,
          marginTop,
          imageWidth,
          sliceHeightMm,
        );

        const nextCursor =
          cutPoint > cursor
            ? cutPoint
            : Math.min(canvas.height, cursor + pagePixelHeight);
        if (nextCursor <= cursor) break;
        cursor = nextCursor;
        pageIndex += 1;
      }

      pdf.save(
        `${showValue(
          studentRecord?.name ?? studentRecord?.uid ?? "student",
        )}-full-profile.pdf`,
      );
    } finally {
      if (printRef.current)
        printRef.current.classList.remove("pdf-export-mode");
      cleanupFullContent();
      setExporting(false);
    }
  };

  const pi = student?.personal_info as AnyRecord | undefined;
  const skills = student?.skills as AnyRecord | undefined;
  const swoc = student?.swoc as AnyRecord | undefined;
  const careerObj = student?.career_objective as AnyRecord | undefined;
  const academicRecords =
    (student?.academic_records as AnyRecord[] | undefined) ?? [];
  const latestAcademicRecord = [...academicRecords]
    .sort((a, b) => Number(a.semester ?? 0) - Number(b.semester ?? 0))
    .at(-1);
  const backlogSubjects = latestAcademicRecord
    ? extractBacklogSubjects(latestAcademicRecord)
    : Array.from(
        new Set(
          academicRecords.flatMap((record) => extractBacklogSubjects(record)),
        ),
      );
  const totalBacklogs = normalizeActiveBacklogCount(academicRecords, {
    ...(studentRecord ?? {}),
    ...(student?.personal_info as AnyRecord | undefined),
    ...(student?.career_objective as AnyRecord | undefined),
    ...(latestAcademicRecord ?? {}),
  });

  return (
    <Dialog
      open={!!studentId}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden">
        <div ref={printRef} id="student-detail-print">
          <style>{`
                        #student-detail-print.pdf-export-mode {
                            background: #fff !important;
                            color: #0f172a !important;
                        }
                        #student-detail-print.pdf-export-mode table {
                            border-collapse: collapse !important;
                        }
                        #student-detail-print.pdf-export-mode table,
                        #student-detail-print.pdf-export-mode th,
                        #student-detail-print.pdf-export-mode td,
                        #student-detail-print.pdf-export-mode [class*="border"] {
                            border-color: #94a3b8 !important;
                        }
                        #student-detail-print.pdf-export-mode th,
                        #student-detail-print.pdf-export-mode td {
                            border-bottom: 1px solid #cbd5e1 !important;
                        }
                        #student-detail-print.pdf-export-mode .text-slate-400,
                        #student-detail-print.pdf-export-mode .text-slate-500,
                        #student-detail-print.pdf-export-mode .text-slate-600 {
                            color: #334155 !important;
                        }
                        #student-detail-print.pdf-export-mode .pdf-exclude {
                            display: none !important;
                        }
                        #student-detail-print.pdf-export-mode * {
                            break-inside: avoid !important;
                            page-break-inside: avoid !important;
                        }
                        #student-detail-print.pdf-export-mode table,
                        #student-detail-print.pdf-export-mode tr,
                        #student-detail-print.pdf-export-mode td,
                        #student-detail-print.pdf-export-mode th,
                        #student-detail-print.pdf-export-mode .section {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        #student-detail-print.pdf-export-mode .section {
                            margin-bottom: 10px;
                        }
                    `}</style>
          {/* Header */}
          <div className="relative bg-slate-50 border-b border-slate-200 p-5 mt-2 sm:mt-0">
            <button
              type="button"
              onClick={onClose}
              className="pdf-exclude absolute top-2 left-2 p-1.5 rounded-md hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {isLoading ? (
              <div className="flex gap-4">
                <Skeleton className="w-22 h-22" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-7 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full gap-4">
                <div className="flex-shrink-0 flex items-center justify-start max-w-[120px] ml-6">
                  <img
                    src={new URL('/college-logo.png', import.meta.url).href}
                    alt="College Logo"
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-col flex items-center justify-center text-center px-4 flex-1">
                  <h2 className="text-[1.35rem] sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-1">
                    Student Information
                  </h2>
                  <p className="text-slate-700 font-semibold text-sm sm:text-base mb-0.5">
                    Department of Computer Science Engineering
                  </p>
                  <p className="text-slate-500 font-medium text-xs sm:text-sm">
                    {SESSION_LABEL}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center justify-end min-w-[96px] mr-6">
                  <div className="w-24 h-[120px] border-[3px] border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
                    {!isEmpty(pick(pi, "profile_photo", "photo_url")) ? (
                      <img
                        src={showValue(pick(pi, "profile_photo", "photo_url"))}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        No Photo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : student ? (
              <>
                <CollapsibleSection
                  title="Student's Personal Information"
                  defaultOpen
                  forceOpen={forceOpenForExport}
                >
                  <InfoTable
                    rows={[
                      {
                        label: "Department",
                        value: "Computer Science Engineering",
                      },
                      { label: "Full Name", value: showValue(student.name) },
                      { label: "Section", value: showValue(student.section) },
                      { label: "Semester", value: showValue(student.semester) },
                      {
                        label: "Roll No./UID",
                        value: showValue(
                          pick(pi, "roll_no", "roll_number", "mis_uid") ||
                            student.uid,
                        ),
                      },
                      {
                        label: "Year of Admission",
                        value: showValue(student.year_of_admission),
                      },
                      {
                        label: "Date of Birth",
                        value: isEmpty(pi?.dob)
                          ? "N/A"
                          : formatDate(textValue(pi?.dob)),
                      },
                      { label: "Gender", value: showValue(pi?.gender) },
                      {
                        label: "Blood Group",
                        value: showValue(pi?.blood_group),
                      },
                      { label: "Category", value: showValue(pi?.category) },
                      {
                        label: "Aadhar Card Number",
                        value: showValue(pick(pi, "aadhar", "aadhar_number")),
                      },
                      {
                        label: "MIS UID",
                        value: showValue(
                          pick(pi, "mis_uid", "roll_no", "roll_number", "uid"),
                        ),
                      },
                      {
                        label: "Mobile No.",
                        value: showValue(pick(pi, "mobile", "mobile_no")),
                      },
                      {
                        label: "Personal Email ID",
                        value: showValue(pi?.personal_email),
                      },
                      {
                        label: "College Email ID",
                        value: showValue(pi?.college_email),
                      },
                      {
                        label: "LinkedIn ID",
                        value: showValue(pick(pi, "linkedin", "linked_in_id")),
                      },
                      {
                        label: "GitHub ID",
                        value: showValue(pick(pi, "github", "github_id")),
                      },
                      {
                        label: "Permanent Address",
                        value: showValue(
                          pick(pi, "permanent_address", "address"),
                        ),
                      },
                      {
                        label: "Present Address",
                        value: showValue(pi?.present_address),
                      },
                      {
                        label: "Local Guardian Name",
                        value: showValue(pi?.local_guardian_name),
                      },
                      {
                        label: "Local Guardian Mobile",
                        value: showValue(pi?.local_guardian_mobile),
                      },
                      {
                        label: "Local Guardian Email",
                        value: showValue(pi?.local_guardian_email),
                      },
                    ]}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Parent's Information"
                  defaultOpen
                  forceOpen={forceOpenForExport}
                >
                  <InfoTable
                    rows={[
                      {
                        label: "Father's Name",
                        value: showValue(pi?.father_name),
                      },
                      {
                        label: "Father's Mobile No.",
                        value: showValue(
                          pick(pi, "father_mobile", "father_mobile_no"),
                        ),
                      },
                      {
                        label: "Father's Email ID",
                        value: showValue(pi?.father_email),
                      },
                      {
                        label: "Father's Occupation",
                        value: showValue(pi?.father_occupation),
                      },
                      {
                        label: "Mother's Name",
                        value: showValue(pi?.mother_name),
                      },
                      {
                        label: "Mother's Mobile No.",
                        value: showValue(
                          pick(pi, "mother_mobile", "mother_mobile_no"),
                        ),
                      },
                      {
                        label: "Mother's Email ID",
                        value: showValue(pi?.mother_email),
                      },
                      {
                        label: "Mother's Occupation",
                        value: showValue(pi?.mother_occupation),
                      },
                      {
                        label: "Emergency Contact",
                        value: showValue(
                          pick(
                            pi,
                            "emergency_contact",
                            "emergency_contact_number",
                          ),
                        ),
                      },
                    ]}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Past Education"
                  forceOpen={forceOpenForExport}
                >
                  {student.past_education &&
                  student.past_education.length > 0 ? (
                    <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            Exam
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            Percentage
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            Year of Passing
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.past_education.map((e, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-4 py-2">{showValue(e.exam)}</td>
                            <td className="px-4 py-2">
                              {showValue(e.percentage)}
                            </td>
                            <td className="px-4 py-2">
                              {showValue(e.year_of_passing)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-400 italic text-sm">No records</p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Post-Admission Academic Record"
                  forceOpen={forceOpenForExport}
                >
                  {student.academic_records &&
                  student.academic_records.length > 0 ? (
                    <>
                      <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-slate-700">
                              Semester
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-slate-700">
                              SGPA
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-slate-700">
                              Backlogs
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.academic_records.map((r, i) => (
                            <tr key={i} className="border-t border-slate-100">
                              <td className="px-4 py-2">
                                {showValue(r.semester)}
                              </td>
                              <td className="px-4 py-2">{showValue(r.sgpa)}</td>
                              <td className="px-4 py-2">
                                {String(normalizeBacklogCount(r as AnyRecord))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3">
                        <InfoTable
                          rows={[
                            {
                              label: "Number of Active Backlogs",
                              value: String(totalBacklogs),
                            },
                            {
                              label: "Backlog Subject Names",
                              value: backlogSubjects.length
                                ? backlogSubjects.join(", ")
                                : "None",
                            },
                          ]}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400 italic text-sm">No records</p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Projects"
                  forceOpen={forceOpenForExport}
                >
                  {student.projects && student.projects.length > 0 ? (
                    <div className="space-y-3">
                      {student.projects.map((p, i) => (
                        <div
                          key={i}
                          className="border border-slate-200 rounded-lg p-3"
                        >
                          <p className="font-semibold text-slate-800">
                            {String(p.title ?? "Untitled")}
                          </p>
                          <p className="text-slate-500 text-sm mt-1">
                            {String(p.description ?? "")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">No projects</p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Internships"
                  forceOpen={forceOpenForExport}
                >
                  {student.internships && student.internships.length > 0 ? (
                    <div className="space-y-3">
                      {student.internships.map((intern, i) => (
                        <div
                          key={i}
                          className="border border-slate-200 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-800">
                              {showValue(intern.company)}
                            </p>
                            <Badge className="bg-sky-100 text-sky-700 border-sky-200 text-xs">
                              {String(intern.type ?? "")}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                intern.paid
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {intern.paid ? "Paid" : "Unpaid"}
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-sm mt-1">{`${showValue(
                            intern.domain,
                          )} | ${showValue(intern.type)} | ${
                            isEmpty(intern.start_date)
                              ? "N/A"
                              : formatDate(textValue(intern.start_date))
                          } to ${
                            isEmpty(intern.end_date)
                              ? "N/A"
                              : formatDate(textValue(intern.end_date))
                          }`}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      No internships
                    </p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Co-Curricular Participations"
                  forceOpen={forceOpenForExport}
                >
                  {student.co_curricular_participations &&
                  student.co_curricular_participations.length > 0 ? (
                    <div className="space-y-2">
                      {student.co_curricular_participations.map((p, i) => (
                        <div
                          key={i}
                          className="border border-slate-100 rounded p-2 text-sm text-slate-700"
                        >
                          {showValue(p.activity)} - {showValue(p.role)} (
                          {showValue(p.year)})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      No participations
                    </p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Co-Curricular Organizations"
                  forceOpen={forceOpenForExport}
                >
                  {student.co_curricular_organizations &&
                  student.co_curricular_organizations.length > 0 ? (
                    <div className="space-y-2">
                      {student.co_curricular_organizations.map((o, i) => (
                        <div
                          key={i}
                          className="border border-slate-100 rounded p-2 text-sm text-slate-700"
                        >
                          {showValue(o.organization)} - {showValue(o.position)}{" "}
                          ({showValue(o.year)})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      No organizations
                    </p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Skills & Interests"
                  forceOpen={forceOpenForExport}
                >
                  <InfoTable
                    rows={[
                      {
                        label: "Programming Languages",
                        value: showValue(skills?.programming_languages),
                      },
                      {
                        label: "Technologies",
                        value: showValue(skills?.technologies),
                      },
                      { label: "Domains", value: showValue(skills?.domains) },
                      { label: "Tools", value: showValue(skills?.tools) },
                    ]}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="SWOC Analysis"
                  forceOpen={forceOpenForExport}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        key: "strengths",
                        label: "Strengths",
                        color: "emerald",
                      },
                      { key: "weaknesses", label: "Weaknesses", color: "red" },
                      {
                        key: "opportunities",
                        label: "Opportunities",
                        color: "sky",
                      },
                      {
                        key: "challenges",
                        label: "Challenges",
                        color: "amber",
                      },
                    ].map(({ key, label, color }) => (
                      <div
                        key={key}
                        className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3`}
                      >
                        <p
                          className={`font-semibold text-${color}-700 text-sm mb-1`}
                        >
                          {label}
                        </p>
                        <p className="text-sm text-slate-700">
                          {showValue(swoc?.[key])}
                        </p>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Career Objective"
                  forceOpen={forceOpenForExport}
                >
                  <InfoTable
                    rows={[
                      { label: "Goal", value: student.career_goal },
                      {
                        label: "Specific Details",
                        value: showValue(careerObj?.specific_details),
                      },
                      {
                        label: "Clarity & Preparedness",
                        value: careerObj?.clarity_score ? (
                          <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                            {String(careerObj.clarity_score)} / 5
                          </Badge>
                        ) : (
                          "N/A"
                        ),
                      },
                      {
                        label: "Campus Placement",
                        value: showValue(careerObj?.campus_placement),
                      },
                    ]}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Assigned Mentor"
                  forceOpen={forceOpenForExport}
                >
                  {student.mentor_name ? (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="font-semibold text-slate-800">
                        {student.mentor_name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      No mentor assigned
                    </p>
                  )}
                </CollapsibleSection>
              </>
            ) : null}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-3 flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={isLoading || exporting || !student}
          >
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
          <Button
            size="sm"
            onClick={handlePDF}
            disabled={isLoading || exporting || !student}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
