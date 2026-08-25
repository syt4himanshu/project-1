import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { classificationApi } from "../../services/classificationApi";
import {
  Users2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
} from "lucide-react";
import type { ClassifiedStudent } from "../../types/classification";
import { StudentDetailModal } from "../../modules/admin/components/students/StudentDetailModal";
import { env } from "../../app/config/env";

const ClassificationsPage = () => {
  const [semester, setSemester] = useState("");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<ClassifiedStudent | null>(null);
  const [previewStudentId, setPreviewStudentId] = useState<number | null>(null);
  const [planType, setPlanType] = useState<"slow" | "advanced">("slow");
  const [mechanism, setMechanism] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [policyExpanded, setPolicyExpanded] = useState(false);

  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isSummaryError,
  } = useQuery({
    queryKey: ["classificationSummary"],
    queryFn: classificationApi.getSummary,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: paginatedData,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    refetch,
  } = useQuery({
    queryKey: ["classifiedStudents", semester, type, page, debouncedSearch],
    queryFn: () =>
      classificationApi.getStudents({
        semester,
        type,
        search: debouncedSearch,
        page,
        limit,
      }),
  });

  const addSupportPlanMutation = useMutation({
    mutationFn: classificationApi.addSupportPlan,
    onSuccess: () => {
      setModalOpen(false);
      setToastMessage("Support plan created successfully");
      setTimeout(() => setToastMessage(""), 3000);
      resetModal();
    },
  });

  const resetModal = () => {
    setSelectedStudent(null);
    setMechanism("");
    setScheduledAt("");
    setNotes("");
  };

  const openSupportModal = (student: ClassifiedStudent) => {
    setSelectedStudent(student);
    if (
      student.classification.isSlowLearner &&
      !student.classification.isAdvancedLearner
    ) {
      setPlanType("slow");
    } else if (
      student.classification.isAdvancedLearner &&
      !student.classification.isSlowLearner
    ) {
      setPlanType("advanced");
    } else {
      setPlanType("slow");
    }
    setModalOpen(true);
  };

  const handleAddPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    addSupportPlanMutation.mutate({
      studentId: selectedStudent.id,
      type: planType,
      mechanism,
      scheduledAt: new Date(scheduledAt).toISOString(),
      notes,
    });
  };

  const [slowMechanisms, setSlowMechanisms] = useState<string[]>(() => {
    const saved = localStorage.getItem("kys_slow_mechanisms");
    return saved
      ? JSON.parse(saved)
      : [
          "Remedial Class",
          "Mentoring Session",
          "Peer Learning",
          "Counselling",
          "Parent Interaction",
        ];
  });

  const [advancedMechanisms, setAdvancedMechanisms] = useState<string[]>(() => {
    const saved = localStorage.getItem("kys_advanced_mechanisms");
    return saved
      ? JSON.parse(saved)
      : [
          "MOOC Enrollment",
          "Research Internship",
          "Hackathon Registration",
          "Industry Project",
          "Technical Skill Program",
          "GATE Guidance",
          "Student Coordinator Role",
        ];
  });

  useEffect(() => {
    localStorage.setItem("kys_slow_mechanisms", JSON.stringify(slowMechanisms));
  }, [slowMechanisms]);

  useEffect(() => {
    localStorage.setItem(
      "kys_advanced_mechanisms",
      JSON.stringify(advancedMechanisms),
    );
  }, [advancedMechanisms]);

  const [newSlowMechanism, setNewSlowMechanism] = useState("");
  const [newAdvancedMechanism, setNewAdvancedMechanism] = useState("");
  const [isAddingSlow, setIsAddingSlow] = useState(false);
  const [isAddingAdvanced, setIsAddingAdvanced] = useState(false);

  const handleAddSlowMechanism = () => {
    if (
      newSlowMechanism.trim() &&
      !slowMechanisms.includes(newSlowMechanism.trim())
    ) {
      setSlowMechanisms([...slowMechanisms, newSlowMechanism.trim()]);
    }
    setNewSlowMechanism("");
    setIsAddingSlow(false);
  };

  const handleAddAdvancedMechanism = () => {
    if (
      newAdvancedMechanism.trim() &&
      !advancedMechanisms.includes(newAdvancedMechanism.trim())
    ) {
      setAdvancedMechanisms([
        ...advancedMechanisms,
        newAdvancedMechanism.trim(),
      ]);
    }
    setNewAdvancedMechanism("");
    setIsAddingAdvanced(false);
  };

  const [isImporting, setIsImporting] = useState(false);

  const handleImportMSE = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const rows = text
        .split("\n")
        .map((row) => row.split(",").map((cell) => cell.trim()));

      const headers = rows[0].map((h) =>
        h.toLowerCase().replace(/[^a-z]/g, ""),
      );
      const rollNoIdx = headers.findIndex(
        (h) => h.includes("roll") || h.includes("uid"),
      );
      const semIdx = headers.findIndex((h) => h.includes("sem"));
      const mseIdx = headers.findIndex(
        (h) => h.includes("mse") || h.includes("mark"),
      );

      if (rollNoIdx === -1 || semIdx === -1 || mseIdx === -1) {
        throw new Error(
          "CSV must contain headers: Roll No, Semester, MSE Marks",
        );
      }

      const data = rows
        .slice(1)
        .filter(
          (row) =>
            row.length > Math.max(rollNoIdx, semIdx, mseIdx) && row[rollNoIdx],
        )
        .map((row) => ({
          rollNo: row[rollNoIdx],
          semester: parseInt(row[semIdx]),
          mseMarks: parseFloat(row[mseIdx]),
        }))
        .filter((row) => !isNaN(row.semester) && !isNaN(row.mseMarks));

      const apiBase = env.apiBaseUrl || "";
      const res = await fetch(
        `${apiBase}/api/admin/classifications/import-mse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("kys.auth.session") || "{}")
                .accessToken
            }`,
          },
          body: JSON.stringify({ data }),
        },
      );

      if (!res.ok) throw new Error("Failed to import");

      const result = await res.json();
      setToastMessage(`Successfully imported ${result.updated} records!`);
      setTimeout(() => setToastMessage(""), 4000);
      refetch();
    } catch (error: any) {
      alert(
        error.message ||
          "Failed to import MSE marks. Please check your CSV format.",
      );
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f3f6fb] pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-300 transform">
          <div className="bg-green-50 text-green-800 px-5 py-4 rounded-xl shadow-lg border border-green-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-sm">{toastMessage}</span>
            <button
              onClick={() => setToastMessage("")}
              className="text-green-600 hover:text-green-800 ml-2 bg-green-100/50 hover:bg-green-200 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#1f2245] to-[#2d3b7a] px-6 py-7 shadow-md sm:px-8 lg:px-12">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-3 text-[1.95rem] font-bold tracking-[-0.02em] text-white">
              <Users2 className="h-8 w-8 text-indigo-300" />
              Student Learner Classification
            </h1>
            <p className="text-sm font-medium text-indigo-200 sm:text-[0.98rem]">
              SVPCET IQAC Academic Support System
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-indigo-50 shadow-sm backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-indigo-200" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <label
              className={`flex cursor-pointer items-center gap-2 rounded-full border border-indigo-400 bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-400 ${
                isImporting ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              {isImporting ? "Importing..." : "Import MSE% CSV"}
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportMSE}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-0 pt-5 sm:px-6 lg:px-8">
        {isSummaryError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">
                Failed to load summary statistics. Please refresh the page.
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex min-h-[148px] flex-col justify-center gap-2 rounded-xl border border-[#e4eaf2] bg-white p-5 shadow-sm">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                Total Analyzed
              </span>
              <span className="text-[3.2rem] font-bold leading-none text-[#111827]">
                {isLoadingSummary ? (
                  <span className="block h-10 w-20 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary?.total || 0
                )}
              </span>
            </div>

            <div className="flex min-h-[148px] flex-col justify-center gap-2 rounded-xl border border-[#e4eaf2] bg-white p-5 shadow-sm">
              <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Slow Learners
              </span>
              <span className="text-[3.2rem] font-bold leading-none text-red-600">
                {isLoadingSummary ? (
                  <span className="block h-10 w-20 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary?.slowLearners || 0
                )}
              </span>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
                {summary?.total
                  ? Math.round(
                      ((summary.slowLearners || 0) / summary.total) * 100,
                    )
                  : 0}
                % OF COHORT
              </span>
            </div>

            <div className="flex min-h-[148px] flex-col justify-center gap-2 rounded-xl border border-[#e4eaf2] bg-white p-5 shadow-sm">
              <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Advanced Learners
              </span>
              <span className="text-[3.2rem] font-bold leading-none text-green-600">
                {isLoadingSummary ? (
                  <span className="block h-10 w-20 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary?.advancedLearners || 0
                )}
              </span>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
                {summary?.total
                  ? Math.round(
                      ((summary.advancedLearners || 0) / summary.total) * 100,
                    )
                  : 0}
                % OF COHORT
              </span>
            </div>
          </div>
        )}

        {/* Info Panel (Collapsible) */}
        <div className="mt-2 overflow-hidden rounded-xl border border-[#dfe6ee] bg-white shadow-sm">
          <button
            onClick={() => setPolicyExpanded(!policyExpanded)}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-[1.05rem] font-semibold text-[#1f2937] outline-none transition-colors hover:bg-[#f5f7fb]"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#eef2ff] p-1.5 text-[#4f46e5]">
                <HelpCircle className="h-5 w-5" />
              </div>
              SVPCET IQAC Support Policy Mechanisms
            </div>
            <div className="rounded-full border border-[#e3e8f0] bg-white p-1 shadow-sm">
              {policyExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </div>
          </button>

          {policyExpanded && (
            <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-red-700 flex items-center justify-between text-[16px]">
                  <span className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" /> Slow Learner
                    Interventions
                  </span>
                  {!isAddingSlow && (
                    <button
                      onClick={() => setIsAddingSlow(true)}
                      className="text-red-600 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs font-bold transition-colors"
                    >
                      + Add
                    </button>
                  )}
                </h4>
                {isAddingSlow && (
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={newSlowMechanism}
                      onChange={(e) => setNewSlowMechanism(e.target.value)}
                      placeholder="e.g. Extra Tutorials"
                      className="flex-1 h-8 text-sm border border-red-200 rounded px-2 focus:ring-1 focus:ring-red-400 outline-none"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddSlowMechanism()
                      }
                      autoFocus
                    />
                    <button
                      onClick={handleAddSlowMechanism}
                      className="bg-red-600 text-white px-3 text-sm font-semibold rounded hover:bg-red-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSlow(false);
                        setNewSlowMechanism("");
                      }}
                      className="bg-gray-100 text-gray-600 px-2 text-sm font-semibold rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2.5">
                  {slowMechanisms.map((m) => (
                    <span
                      key={m}
                      className="bg-red-50 text-red-700 border border-red-100 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-green-700 flex items-center justify-between text-[16px]">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Advanced Learner
                    Opportunities
                  </span>
                  {!isAddingAdvanced && (
                    <button
                      onClick={() => setIsAddingAdvanced(true)}
                      className="text-green-600 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs font-bold transition-colors"
                    >
                      + Add
                    </button>
                  )}
                </h4>
                {isAddingAdvanced && (
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={newAdvancedMechanism}
                      onChange={(e) => setNewAdvancedMechanism(e.target.value)}
                      placeholder="e.g. Advanced AI Project"
                      className="flex-1 h-8 text-sm border border-green-200 rounded px-2 focus:ring-1 focus:ring-green-400 outline-none"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddAdvancedMechanism()
                      }
                      autoFocus
                    />
                    <button
                      onClick={handleAddAdvancedMechanism}
                      className="bg-green-600 text-white px-3 text-sm font-semibold rounded hover:bg-green-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingAdvanced(false);
                        setNewAdvancedMechanism("");
                      }}
                      className="bg-gray-100 text-gray-600 px-2 text-sm font-semibold rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2.5">
                  {advancedMechanisms.map((m) => (
                    <span
                      key={m}
                      className="bg-green-50 text-green-700 border border-green-100 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters Bar */}
        <div className="mt-2 flex flex-col items-center gap-4 rounded-xl border border-[#dfe6ee] bg-white p-4 shadow-sm lg:flex-row">
          <div className="relative w-full flex-grow lg:max-w-[32rem]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a93a7]" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              className="h-11 w-full rounded-lg border border-[#dfe6ee] bg-[#f8fafc] pl-10 pr-4 text-sm text-gray-800 placeholder-[#7c8395] outline-none transition-all focus:border-[#a9b8d6] focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex w-full flex-wrap gap-4 lg:w-auto lg:flex-nowrap">
            <select
              className="h-11 flex-1 rounded-lg border border-[#dfe6ee] bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-[#a9b8d6] lg:w-40"
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
            <select
              className="h-11 flex-1 rounded-lg border border-[#dfe6ee] bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-[#a9b8d6] lg:w-52"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Classification Types</option>
              <option value="slow">Slow Learners Only</option>
              <option value="advanced">Advanced Learners Only</option>
              <option value="general">General Pool</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[450px]">
          {isStudentsError ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-red-50/30">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1 text-[16px]">
                Error Loading Data
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                We encountered an issue fetching the student data. Please try
                refreshing the page or contact support if the issue persists.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="flex-grow h-full relative flex flex-col">
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[900px] whitespace-nowrap text-left text-[14px] text-gray-600">
                  <thead className="sticky top-0 z-10 border-b border-[#e5e7eb] bg-[#f7f9fc] text-gray-700 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 text-left text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        Semester
                      </th>
                      <th className="px-6 py-4 text-left text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        CGPA
                      </th>
                      <th className="px-6 py-4 text-left text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        Backlogs
                      </th>
                      <th className="px-6 py-4 text-left text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        MSE%
                      </th>
                      <th className="px-6 py-4 text-left text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        Classification
                      </th>
                      <th className="px-6 py-4 text-right text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#4b5563]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoadingStudents ? (
                      Array.from({ length: 7 }).map((_, i) => (
                        <tr key={i} className="even:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded-md w-36 animate-pulse"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded-md w-28 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded-md w-10 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded-md w-12 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded-md w-12 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <div className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                              <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : paginatedData?.students.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-gray-50/50">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-gray-900 font-semibold mb-2 text-[16px]">
                              No students found
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                              We couldn't find any students matching your
                              current filter criteria. Try adjusting your
                              filters or clearing the search term.
                            </p>
                            <button
                              onClick={() => {
                                setSemester("");
                                setType("all");
                                setSearch("");
                                setPage(1);
                              }}
                              className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg text-sm hover:bg-indigo-100 transition-colors"
                            >
                              Clear Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData?.students.map((student) => (
                        <tr
                          key={student.id}
                          className="transition-colors hover:bg-gray-50 even:bg-[#f9fafb]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6e8ff] text-[11px] font-bold text-[#3d4ed8]">
                                {student.name
                                  ? student.name.charAt(0).toUpperCase()
                                  : "?"}
                              </div>
                              <span className="font-semibold text-[#111827]">
                                {student.name || "Unknown Student"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-[#111827]">
                            Sem {student.semester}
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#111827]">
                            {student.cgpa != null
                              ? Number(student.cgpa).toFixed(2)
                              : "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                student.backlogs && student.backlogs >= 2
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {student.backlogs ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#111827]">
                            {student.mseMarks != null ? (
                              <span className="font-medium">
                                {student.mseMarks}%
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {student.classification.isSlowLearner && (
                                <span
                                  title={student.classification.slowReasons.join(
                                    "\n",
                                  )}
                                  className="cursor-help rounded-full border border-red-200 bg-red-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-red-700"
                                >
                                  Slow Learner
                                </span>
                              )}
                              {student.classification.isAdvancedLearner && (
                                <span
                                  title={student.classification.advancedReasons.join(
                                    "\n",
                                  )}
                                  className="cursor-help rounded-full border border-green-200 bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-green-700"
                                >
                                  Advanced Learner
                                </span>
                              )}
                              {!student.classification.isSlowLearner &&
                                !student.classification.isAdvancedLearner && (
                                  <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">
                                    General
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="rounded-lg border border-[#dfe6ee] bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                                onClick={() => setPreviewStudentId(student.id)}
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => openSupportModal(student)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#3d4ed8] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3445c6]"
                              >
                                <span className="text-base leading-none">
                                  +
                                </span>{" "}
                                Support Plan
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/30 border-t border-gray-100">
                {isLoadingStudents ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse h-44"
                    ></div>
                  ))
                ) : paginatedData?.students.length === 0 ? (
                  <div className="px-6 py-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
                    <p className="text-gray-500 text-sm">
                      No students found matching your filters.
                    </p>
                  </div>
                ) : (
                  paginatedData?.students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[15px] shrink-0">
                          {student.name ? student.name.charAt(0) : "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-[15px] leading-snug">
                            {student.name || "Unknown Student"}
                          </span>
                          <span className="text-[13px] font-medium text-gray-500 mt-0.5">
                            {student.rollNo} <span className="mx-1">•</span> Sem{" "}
                            {student.semester}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm pt-1">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            CGPA
                          </span>
                          <span className="font-semibold text-gray-800 text-[15px]">
                            {student.cgpa != null
                              ? Number(student.cgpa).toFixed(2)
                              : "-"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Backlogs
                          </span>
                          <span
                            className={`self-start px-2 py-0.5 rounded text-xs font-bold ${
                              student.backlogs && student.backlogs >= 2
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {student.backlogs ?? 0}
                          </span>
                        </div>

                        <div className="flex flex-col col-span-2 mt-1 gap-1.5">
                          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Classification
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {student.classification.isSlowLearner && (
                              <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[11px] font-bold tracking-wide uppercase rounded-md border border-red-200">
                                Slow Learner
                              </span>
                            )}
                            {student.classification.isAdvancedLearner && (
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold tracking-wide uppercase rounded-md border border-green-200">
                                Advanced Learner
                              </span>
                            )}
                            {!student.classification.isSlowLearner &&
                              !student.classification.isAdvancedLearner && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold tracking-wide uppercase rounded-md border border-gray-200">
                                  General
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => setPreviewStudentId(student.id)}
                          className="px-3 py-1.5 text-gray-600 bg-transparent hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold transition-all"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => openSupportModal(student)}
                          className="px-3 py-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <span>+</span> Support Plan
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between mt-auto">
            <span className="text-sm font-medium text-gray-500">
              Showing{" "}
              <span className="text-gray-900 font-semibold">
                {paginatedData?.total ? (page - 1) * limit + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="text-gray-900 font-semibold">
                {Math.min(page * limit, paginatedData?.total || 0)}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 font-semibold">
                {paginatedData?.total || 0}
              </span>{" "}
              students
            </span>
            <div className="flex items-center gap-3">
              <button
                disabled={page === 1 || isLoadingStudents}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-sm font-semibold text-gray-700 min-w-[80px] text-center">
                Page {page}
              </div>
              <button
                disabled={
                  !paginatedData ||
                  page * limit >= paginatedData.total ||
                  isLoadingStudents
                }
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Plan Modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1a1f36] to-indigo-900 px-6 py-5 flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg tracking-wide">
                  Add Support Plan
                </h3>
                <p className="text-indigo-200 text-sm mt-0.5 font-medium flex items-center gap-2">
                  <User className="w-4 h-4 opacity-70" />
                  {selectedStudent.name} <span className="opacity-50">•</span>{" "}
                  {selectedStudent.rollNo}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleAddPlanSubmit}
              className="p-6 flex flex-col gap-5 bg-white"
            >
              {/* Classification Info Banner */}
              <div
                className={`p-4 rounded-xl border ${
                  selectedStudent.classification.isSlowLearner &&
                  selectedStudent.classification.isAdvancedLearner
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : selectedStudent.classification.isAdvancedLearner
                    ? "bg-green-50 border-green-200 text-green-900"
                    : selectedStudent.classification.isSlowLearner
                    ? "bg-red-50 border-red-200 text-red-900"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-full bg-white/60 shadow-sm`}>
                    {selectedStudent.classification.isSlowLearner &&
                      selectedStudent.classification.isAdvancedLearner && (
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                      )}
                    {selectedStudent.classification.isAdvancedLearner &&
                      !selectedStudent.classification.isSlowLearner && (
                        <TrendingUp className="w-4 h-4 text-green-700" />
                      )}
                    {selectedStudent.classification.isSlowLearner &&
                      !selectedStudent.classification.isAdvancedLearner && (
                        <TrendingDown className="w-4 h-4 text-red-700" />
                      )}
                    {!selectedStudent.classification.isSlowLearner &&
                      !selectedStudent.classification.isAdvancedLearner && (
                        <Users2 className="w-4 h-4 text-gray-700" />
                      )}
                  </div>
                  <p className="text-sm font-semibold tracking-wide">
                    {selectedStudent.classification.isSlowLearner &&
                    selectedStudent.classification.isAdvancedLearner
                      ? "Both Categories (Slow & Advanced Learner)"
                      : selectedStudent.classification.isAdvancedLearner
                      ? "Advanced Learner"
                      : selectedStudent.classification.isSlowLearner
                      ? "Slow Learner"
                      : "General Classification"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Target Category
                </label>
                <select
                  required
                  value={planType}
                  onChange={(e) => {
                    setPlanType(e.target.value as "slow" | "advanced");
                    setMechanism("");
                  }}
                  className="w-full h-11 bg-gray-50 border border-gray-300 rounded-lg px-4 text-[14px] focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm cursor-pointer transition-all"
                >
                  <option value="slow">Slow Learner Interventions</option>
                  <option value="advanced">
                    Advanced Learner Opportunities
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Support Mechanism
                </label>
                <select
                  required
                  value={mechanism}
                  onChange={(e) => setMechanism(e.target.value)}
                  className="w-full h-11 bg-gray-50 border border-gray-300 rounded-lg px-4 text-[14px] focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm cursor-pointer transition-all"
                >
                  <option value="" disabled>
                    Select an approved intervention...
                  </option>
                  {(planType === "slow"
                    ? slowMechanisms
                    : advancedMechanisms
                  ).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Scheduled Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    max="9999-12-31"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full pl-11 pr-4 h-11 bg-gray-50 border border-gray-300 rounded-lg text-[14px] focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any specific context, goals, or expectations..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[14px] focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-all resize-none"
                />
              </div>

              <div className="mt-2 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSupportPlanMutation.isPending}
                  className="w-full sm:w-auto px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {addSupportPlanMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Support Plan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewStudentId !== null && (
        <StudentDetailModal
          studentId={previewStudentId}
          onClose={() => setPreviewStudentId(null)}
        />
      )}
    </div>
  );
};

export default ClassificationsPage;
