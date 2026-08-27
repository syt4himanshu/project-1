import { useState } from "react";
import type { ChangeEvent } from "react";
import { State, City } from "country-state-city";
import { uploadProfilePhoto } from "../../api/student";
import { useStudentProfileDraft } from "../../hooks/useStudentProfileWizard";
import { FileText } from "lucide-react";
import {
  field,
  input,
  inputCls,
  select,
  searchableSelect,
  sectionCardCls,
  textareaCls,
} from "./shared";

export default function Step1Personal() {
  const { data, update, getFieldValidation, error, uploadPhoto, editorRole } =
    useStudentProfileDraft();
  const pi = (data.personal_info as Record<string, unknown>) || {};
  const postAdmissionRecords =
    (data.post_admission_records as Record<string, unknown>[]) || [];
  const upd = (k: string, v: unknown) => update({ personal_info: { [k]: v } });

  const handleSemesterChange = (value: string) => {
    const semester = value ? Number(value.replace("Semester ", "")) : null;
    const filteredRecords = semester
      ? postAdmissionRecords.filter(
        (record) => Number(record.semester) < semester,
      )
      : postAdmissionRecords;

    update({
      semester,
      post_admission_records: filteredRecords,
    });
  };

  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const getValidation = (fieldName: string, joiPath: string) => {
    const joiVal = getFieldValidation(joiPath);
    if (joiVal.error && joiVal.touched) {
      return joiVal;
    }

    const missingFields =
      error && error.startsWith("Please fill required fields: ")
        ? error.replace("Please fill required fields: ", "").split(", ")
        : [];

    if (missingFields.includes(fieldName)) {
      return {
        error: `${fieldName} is required`,
        touched: true,
        markTouched: joiVal.markTouched,
      };
    }
    return joiVal;
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (data.is_profile_locked && editorRole !== "faculty") {
      setUploadMsg(
        "Profile is locked by your faculty mentor and photo cannot be changed.",
      );
      e.target.value = "";
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      setUploadMsg("File size must be less than 1MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadMsg("Uploading photo...");
    try {
      if (uploadPhoto) {
        const response = await uploadPhoto(file);
        update({
          personal_info: {
            photoUrl: response.photoUrl ?? null,
            photo_public_id: response.photo_public_id ?? null,
            photoPreviewUrl:
              response.photoPreviewUrl ?? response.photo_preview_url ?? null,
            photo_preview_url:
              response.photo_preview_url ?? response.photoPreviewUrl ?? null,
          },
        });
      } else {
        const response = await uploadProfilePhoto(file);
        update({
          personal_info: {
            photoUrl: response.data?.photoUrl ?? null,
            photo_public_id: response.data?.photo_public_id ?? null,
            photoPreviewUrl: response.data?.photo_preview_url ?? null,
            photo_preview_url: response.data?.photo_preview_url ?? null,
          },
        });
      }
      setUploadMsg("Photo uploaded successfully.");
    } catch (error) {
      console.error("[UPLOAD] Upload failed:", error);
      setUploadMsg("Failed to upload photo. You can try again later.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-5">
      <section id="profile-section-personal" className={sectionCardCls}>
        <p className="mb-4 text-xs font-medium text-[var(--text-muted)]">
          Fields marked with{" "}
          <span style={{ color: "var(--danger)" }} className="font-bold">
            *
          </span>{" "}
          are required and need to be filled.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {field(
            "Full Name *",
            input(
              "text",
              (data.full_name as string) || "",
              (v) => update({ full_name: v }),
              "Enter full name",
              getValidation("Full Name", "full_name"),
            ),
          )}
          {field(
            "Section *",
            select(
              ["A", "B"],
              (data.section as string) || "",
              (v) => update({ section: v }),
              "Select Section",
              getValidation("Section", "section"),
            ),
          )}

          {field(
            "Semester *",
            select(
              [
                "Semester 1",
                "Semester 2",
                "Semester 3",
                "Semester 4",
                "Semester 5",
                "Semester 6",
                "Semester 7",
                "Semester 8",
              ],
              data.semester ? `Semester ${data.semester}` : "",
              handleSemesterChange,
              "Select Semester",
              getValidation("Semester", "semester"),
            ),
          )}
          {field(
            "Year of Admission",
            select(
              Array.from({ length: 20 }, (_, i) => String(2021 + i)),
              data.year_of_admission ? String(data.year_of_admission) : "",
              (v) => update({ year_of_admission: v ? Number(v) : null }),
              "Select Year",
            ),
          )}

          {field(
            "Date of Birth *",
            input(
              "date",
              (pi.dob as string) || "",
              (v) => upd("dob", v),
              "dd-mm-yyyy",
              getValidation("Date of Birth", "personal_info.dob"),
            ),
          )}
          {field(
            "Gender *",
            select(
              ["Male", "Female", "Other"],
              (pi.gender as string) || "",
              (v) => upd("gender", v),
              "Select Gender",
              getValidation("Gender", "personal_info.gender"),
            ),
          )}

          {field(
            "Blood Group",
            select(
              ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
              (pi.blood_group as string) || "",
              (v) => upd("blood_group", v),
              "Select Blood Group",
            ),
          )}
          {field(
            "Category *",
            <div className="space-y-2">
              {select(
                ["General", "OBC", "SC", "ST", "NT", "EWS", "Other"],
                (pi.category as string) &&
                  !["General", "OBC", "SC", "ST", "NT", "EWS"].includes(
                    pi.category as string,
                  )
                  ? "Other"
                  : (pi.category as string) || "",
                (v) => {
                  if (v === "Other") {
                    upd("category", "Other");
                  } else {
                    upd("category", v);
                  }
                },
                "Select Category",
                getValidation("Category", "personal_info.category"),
              )}
              {((pi.category as string) === "Other" ||
                ((pi.category as string) &&
                  ![
                    "General",
                    "OBC",
                    "SC",
                    "ST",
                    "NT",
                    "EWS",
                    "Other",
                  ].includes(pi.category as string))) &&
                input(
                  "text",
                  (pi.category as string) === "Other"
                    ? ""
                    : (pi.category as string) || "",
                  (v) => upd("category", v),
                  "Enter category",
                  getValidation("Custom Category", "personal_info.category"),
                )}
            </div>,
          )}

          {field(
            "Aadhar Card Number",
            input(
              "text",
              (pi.aadhar_number as string) || "",
              (v) => upd("aadhar_number", v),
              "e.g. 123412341234",
              getFieldValidation("personal_info.aadhar_number"),
            ),
          )}
          {field(
            "MIS UID *",
            input(
              "text",
              (pi.mis_uid as string) || "",
              (v) => upd("mis_uid", v),
              "e.g. 240030**",
              getValidation("MIS UID", "personal_info.mis_uid"),
            ),
          )}

          {field(
            "WhatsApp Mobile No. *",
            input(
              "tel",
              (pi.mobile_no as string) || "",
              (v) => upd("mobile_no", v),
              "e.g. 9876543210",
              getValidation("WhatsApp Mobile No.", "personal_info.mobile_no"),
            ),
          )}
          {field(
            "Personal Email *",
            input(
              "email",
              (pi.personal_email as string) || "",
              (v) => upd("personal_email", v),
              "e.g. student@example.com",
              getValidation("Personal Email", "personal_info.personal_email"),
            ),
          )}

          {field(
            "College Email (Professional) *",
            input(
              "email",
              (pi.college_email as string) || "",
              (v) => upd("college_email", v),
              "e.g. student@college.edu",
              getValidation(
                "College Email (Professional)",
                "personal_info.college_email",
              ),
            ),
          )}
          {field(
            "LinkedIn ID",
            input(
              "url",
              (pi.linked_in_id as string) || "",
              (v) => upd("linked_in_id", v),
              "https://linkedin.com/in/username",
            ),
          )}

          {field(
            "GitHub ID",
            input(
              "url",
              (pi.github_id as string) || "",
              (v) => upd("github_id", v),
              "https://github.com/username",
            ),
          )}
        </div>
      </section>

      <section id="profile-section-parents" className={sectionCardCls}>
        <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">
          Parent&apos;s Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {field(
            "Father's Name *",
            input(
              "text",
              (pi.father_name as string) || "",
              (v) => upd("father_name", v),
              "Enter father name",
              getValidation("Father's Name", "personal_info.father_name"),
            ),
          )}
          {field(
            "Father's WhatsApp Mobile No. *",
            input(
              "tel",
              (pi.father_mobile_no as string) || "",
              (v) => upd("father_mobile_no", v),
              "e.g. 9876543210",
              getValidation(
                "Father's WhatsApp Mobile No.",
                "personal_info.father_mobile_no",
              ),
            ),
          )}
          {field(
            "Father's Email ID",
            input(
              "email",
              (pi.father_email as string) || "",
              (v) => upd("father_email", v),
              "e.g. parent@example.com",
              getFieldValidation("personal_info.father_email"),
            ),
          )}
          {field(
            "Father's Occupation *",
            input(
              "text",
              (pi.father_occupation as string) || "",
              (v) => upd("father_occupation", v),
              "Enter occupation",
              getValidation(
                "Father's Occupation",
                "personal_info.father_occupation",
              ),
            ),
          )}

          {field(
            "Mother's Name *",
            input(
              "text",
              (pi.mother_name as string) || "",
              (v) => upd("mother_name", v),
              "Enter mother name",
              getValidation("Mother's Name", "personal_info.mother_name"),
            ),
          )}
          {field(
            "Mother's WhatsApp Mobile No. *",
            input(
              "tel",
              (pi.mother_mobile_no as string) || "",
              (v) => upd("mother_mobile_no", v),
              "e.g. 9876543210",
              getValidation(
                "Mother's WhatsApp Mobile No.",
                "personal_info.mother_mobile_no",
              ),
            ),
          )}
          {field(
            "Mother's Email ID",
            input(
              "email",
              (pi.mother_email as string) || "",
              (v) => upd("mother_email", v),
              "e.g. parent@example.com",
              getFieldValidation("personal_info.mother_email"),
            ),
          )}
          {field(
            "Mother's Occupation *",
            input(
              "text",
              (pi.mother_occupation as string) || "",
              (v) => upd("mother_occupation", v),
              "Enter occupation",
              getValidation(
                "Mother's Occupation",
                "personal_info.mother_occupation",
              ),
            ),
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-[#d6deea] bg-[#f7f9fc] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">
            Local Guardian Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {field(
              "Local Guardian Name",
              input(
                "text",
                (pi.guardian_name as string) || "",
                (v) => upd("guardian_name", v),
                "Enter guardian name",
              ),
            )}
            {field(
              "Local Guardian Mobile Number",
              input(
                "tel",
                (pi.guardian_mobile as string) || "",
                (v) => upd("guardian_mobile", v),
                "e.g. 9876543210",
                getFieldValidation("personal_info.guardian_mobile"),
              ),
            )}
            {field(
              "Local Guardian Email ID",
              input(
                "email",
                (pi.guardian_email as string) || "",
                (v) => upd("guardian_email", v),
                "e.g. guardian@example.com",
                getFieldValidation("personal_info.guardian_email"),
              ),
            )}
          </div>
        </div>
      </section>

      <section id="profile-section-emergency" className={sectionCardCls}>
        <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {field(
            "Emergency Contact Person *",
            input(
              "text",
              (pi.emergency_contact_name as string) || "",
              (v) => upd("emergency_contact_name", v),
              "Enter contact person name",
              getValidation(
                "Emergency Contact Person",
                "personal_info.emergency_contact_name",
              ),
            ),
          )}
          {field(
            "Emergency Contact Mobile *",
            input(
              "tel",
              (pi.emergency_contact_number as string) || "",
              (v) => upd("emergency_contact_number", v),
              "e.g. 9876543210",
              getValidation(
                "Emergency Contact Mobile",
                "personal_info.emergency_contact_number",
              ),
            ),
          )}
        </div>
      </section>

      <div id="profile-section-location" className="space-y-4">
        <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">
          Location Details
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 mb-5">
          {field(
            "State *",
            searchableSelect(
              State.getStatesOfCountry("IN").map((s) => s.name),
              (pi.state as string) || "",
              (v) => {
                update({
                  personal_info: {
                    state: v,
                    city: "",
                    pincode: "",
                  },
                });
              },
              "Select State",
              getValidation("State", "personal_info.state"),
            ),
          )}

          {field(
            "City *",
            (() => {
              const stateObj = State.getStatesOfCountry("IN").find(
                (s) => s.name === pi.state,
              );
              const cityList = stateObj
                ? City.getCitiesOfState("IN", stateObj.isoCode).map(
                  (c) => c.name,
                )
                : [];
              const isCustom =
                (pi.city as string) && !cityList.includes(pi.city as string);
              const selectedVal =
                isCustom || pi.city === "Other"
                  ? "Other"
                  : (pi.city as string) || "";

              return (
                <div className="flex flex-col gap-4">
                  {searchableSelect(
                    [...cityList, "Other"],
                    selectedVal,
                    async (v) => {
                      if (v === "Other") {
                        upd("city", "Other");
                      } else {
                        upd("city", v);
                        // auto fetch pincode
                        try {
                          const res = await fetch(
                            `https://api.postalpincode.in/postoffice/${v}`,
                          );
                          const data = await res.json();
                          if (data && data[0] && data[0].Status === "Success") {
                            const postOffices = data[0].PostOffice;
                            if (postOffices && postOffices.length > 0) {
                              upd("pincode", postOffices[0].Pincode);
                            }
                          }
                        } catch (e) {
                          console.error("Failed to fetch pincode", e);
                        }
                      }
                    },
                    "Select City",
                    getValidation("City", "personal_info.city"),
                  )}
                  {selectedVal === "Other" &&
                    input(
                      "text",
                      (pi.city as string) === "Other"
                        ? ""
                        : (pi.city as string) || "",
                      (v) => upd("city", v),
                      "Enter city name",
                      getValidation("Custom City", "personal_info.city"),
                    )}
                </div>
              );
            })(),
          )}

          {field(
            "Pincode *",
            input(
              "text",
              (pi.pincode as string) || "",
              (v) => upd("pincode", v),
              "e.g. 110001",
              getValidation("Pincode", "personal_info.pincode"),
            ),
          )}

          {field(
            "DIGIPIN",
            <div className="flex flex-col gap-1">
              {input(
                "text",
                (pi.digipin as string) || "",
                (v) => upd("digipin", v.toUpperCase()),
                "10-character alphanumeric",
                getValidation("DIGIPIN", "personal_info.digipin"),
              )}
              <div className="flex justify-end">
                <a
                  href="https://dac.indiapost.gov.in/mydigipin/home"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#2b5fa6] underline hover:text-[#1e4785]"
                >
                  Know Your DIGIPIN
                </a>
              </div>
            </div>,
          )}
        </div>

        {field(
          "Permanent Address *",
          <div className="space-y-1">
            <textarea
              value={(pi.permanent_address as string) || ""}
              onChange={(e) => {
                upd("permanent_address", e.target.value);
                getValidation(
                  "Permanent Address",
                  "personal_info.permanent_address",
                ).markTouched?.();
              }}
              onBlur={() =>
                getValidation(
                  "Permanent Address",
                  "personal_info.permanent_address",
                ).markTouched?.()
              }
              rows={4}
              placeholder="Street, City, State, PIN"
              className={`${textareaCls} ${getValidation(
                "Permanent Address",
                "personal_info.permanent_address",
              ).error &&
                  getValidation(
                    "Permanent Address",
                    "personal_info.permanent_address",
                  ).touched
                  ? "border-[#ef4444] focus:border-[#dc2626] focus:ring-[#ef4444]/20"
                  : ""
                }`}
            />
            {getValidation(
              "Permanent Address",
              "personal_info.permanent_address",
            ).error &&
              getValidation(
                "Permanent Address",
                "personal_info.permanent_address",
              ).touched && (
                <p className="text-xs font-medium text-[#dc2626]">
                  {
                    getValidation(
                      "Permanent Address",
                      "personal_info.permanent_address",
                    ).error
                  }
                </p>
              )}
          </div>,
        )}

        {field(
          "Present Address",
          <textarea
            value={(pi.present_address as string) || ""}
            onChange={(e) => upd("present_address", e.target.value)}
            rows={4}
            placeholder="Current address"
            className={textareaCls}
          />,
        )}
      </div>

      <div id="profile-section-photo">
        {/* Derive whether the photo validation error should be shown.
            The "Please fill required fields: ..." error string (set by the slice on
            Next/Submit) is the trigger — same mechanism used by getValidation() above. */}
        {(() => {
          const hasPhoto = Boolean(
            pi.photoUrl || pi.photo_url || pi.photoPreviewUrl || pi.photo_preview_url,
          );
          const missingFields =
            error && error.startsWith("Please fill required fields: ")
              ? error.replace("Please fill required fields: ", "").split(", ")
              : [];
          const photoError =
            !hasPhoto && missingFields.includes("Profile Photo")
              ? "Profile photo is required."
              : null;

          return (
            <>
              <label
                className={`mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] ${photoError ? "text-[#dc2626]" : "text-[#5f6f86]"
                  }`}
              >
                Profile Photo *
              </label>

              {hasPhoto ? (
                <>
                  <div className="mb-3 flex flex-col items-start gap-3 rounded-2xl border border-[#d9e1ec] bg-white p-3 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d9e1ec] bg-slate-50 dark:border-[#334155] dark:bg-slate-800">
                      {pi.photoPreviewUrl || pi.photo_preview_url ? (
                        <img
                          src={String(pi.photoPreviewUrl || pi.photo_preview_url)}
                          alt="PDF Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-10 w-10 text-slate-400" />
                      )}
                    </div>
                    <div className="w-full min-w-0">
                      <p className="text-sm font-medium text-[#32435f]">
                        Current uploaded document
                      </p>
                      <a
                        className="break-words text-sm text-[#2b5fa6] underline"
                        href={String(pi.photoUrl || pi.photo_url)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open uploaded document
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mb-2 text-sm text-[#7a879c]">
                  No document uploaded yet.
                </p>
              )}

              <div>
                <input
                  type="file"
                  id="passport-photo-upload"
                  accept="application/pdf"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="passport-photo-upload"
                  className={`${inputCls} m-0 flex cursor-pointer items-center ${photoError
                      ? "border-[#ef4444] focus-within:border-[#dc2626] focus-within:ring-[#ef4444]/20"
                      : ""
                    }`}
                  style={{ padding: "0.375rem 1rem 0.375rem 0.375rem" }}
                >
                  <div
                    className={`mr-3 rounded-lg bg-[#1f355f] px-3 py-2 text-sm font-semibold text-white transition-opacity ${uploading ? "opacity-50" : "hover:opacity-90"
                      }`}
                  >
                    {hasPhoto ? "Choose Another File" : "Choose File"}
                  </div>
                  <span className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {uploading ? "Uploading..." : "No file chosen"}
                  </span>
                </label>
              </div>

              {/* Field-level validation error — shown when Next/Submit is clicked without a photo */}
              {photoError && (
                <p className="mt-1 text-xs font-medium text-[#dc2626]">
                  {photoError}
                </p>
              )}

              {/* Upload status message — separate from validation, shown after user interaction */}
              {uploadMsg && (
                <p
                  className="mt-2 text-sm font-semibold"
                  style={{
                    color: uploadMsg.includes("successfully")
                      ? "#10b981"
                      : uploadMsg.includes("Uploading")
                        ? "#8796ac"
                        : "#ef4444",
                  }}
                >
                  {uploadMsg}
                </p>
              )}

              <div className="mt-2 flex flex-col gap-0.5 text-xs text-[#8796ac]">
                <p>Supported formats: PDF</p>
                <p>Maximum file size: 1 MB</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
