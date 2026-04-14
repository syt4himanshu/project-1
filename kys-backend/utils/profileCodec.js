const TEXT_META_MARKER = '\n[[KYS_META]]';
const EXAM_META_MARKER = '[[KYS_META]]';

const cloneArray = (value) => (Array.isArray(value) ? value.map((item) => ({ ...item })) : []);

function safeParseMeta(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function packText(baseValue, meta = {}) {
  const base = baseValue == null ? '' : String(baseValue);
  const entries = Object.entries(meta).filter(([, value]) => value !== undefined);
  if (!entries.length) return base;
  return `${base}${TEXT_META_MARKER}${JSON.stringify(Object.fromEntries(entries))}`;
}

function unpackText(value) {
  const text = value == null ? '' : String(value);
  const markerIndex = text.indexOf(TEXT_META_MARKER);
  if (markerIndex === -1) {
    return { base: text, meta: {} };
  }

  return {
    base: text.slice(0, markerIndex),
    meta: safeParseMeta(text.slice(markerIndex + TEXT_META_MARKER.length)),
  };
}

function packExamName(examName, meta = {}) {
  const base = examName == null ? '' : String(examName);
  const entries = Object.entries(meta).filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (!entries.length) return base;
  return `${base}${EXAM_META_MARKER}${JSON.stringify(Object.fromEntries(entries))}`;
}

function unpackExamName(value) {
  const text = value == null ? '' : String(value);
  const markerIndex = text.indexOf(EXAM_META_MARKER);
  if (markerIndex === -1) {
    return { base: text, meta: {} };
  }

  return {
    base: text.slice(0, markerIndex),
    meta: safeParseMeta(text.slice(markerIndex + EXAM_META_MARKER.length)),
  };
}

function encodePastEducationRecords(records = []) {
  return cloneArray(records).map((record) => {
    const examName = record.exam_name || '';
    const packed = {
      ...record,
      exam_name: packExamName(examName, {
        board: record.board,
        exam_type: record.exam_type,
      }),
    };

    delete packed.board;
    delete packed.exam_type;
    return packed;
  });
}

function decodePastEducationRecords(records = []) {
  return cloneArray(records).map((record) => {
    const unpacked = unpackExamName(record.exam_name);
    return {
      ...record,
      exam_name: unpacked.base,
      board: unpacked.meta.board ?? '',
      exam_type: unpacked.meta.exam_type ?? '',
    };
  });
}

function encodePostAdmissionRecords(records = []) {
  return cloneArray(records).map((record) => {
    const packed = {
      ...record,
      backlog_subjects: packText(record.backlog_subjects, {
        season: record.season,
        year_of_passing: record.year_of_passing,
        college_rank: record.college_rank,
        academic_awards: record.academic_awards,
      }),
    };

    delete packed.season;
    delete packed.year_of_passing;
    delete packed.college_rank;
    delete packed.academic_awards;
    return packed;
  });
}

function decodePostAdmissionRecords(records = []) {
  return cloneArray(records).map((record) => {
    const unpacked = unpackText(record.backlog_subjects);
    return {
      ...record,
      backlog_subjects: unpacked.base,
      season: unpacked.meta.season ?? '',
      year_of_passing: unpacked.meta.year_of_passing ?? null,
      college_rank: unpacked.meta.college_rank ?? '',
      academic_awards: unpacked.meta.academic_awards ?? '',
    };
  });
}

function encodeInternships(records = []) {
  return cloneArray(records).map((record) => {
    const packed = {
      ...record,
      company_name: packText(record.company_name, { designation: record.designation }),
      domain: packText(record.domain, { description: record.description }),
    };

    delete packed.designation;
    delete packed.description;
    return packed;
  });
}

function decodeInternships(records = []) {
  return cloneArray(records).map((record) => {
    const company = unpackText(record.company_name);
    const domain = unpackText(record.domain);
    return {
      ...record,
      company_name: company.base,
      designation: company.meta.designation ?? '',
      domain: domain.base,
      description: domain.meta.description ?? '',
    };
  });
}

function encodeCareerObjective(record = {}) {
  const packed = {
    ...record,
    campus_placement_reasons: packText(record.campus_placement_reasons, {
      non_technical_areas: record.non_technical_areas,
      student_mentor_interest: record.student_mentor_interest,
      expectations_from_institute: record.expectations_from_institute,
    }),
  };

  delete packed.non_technical_areas;
  delete packed.student_mentor_interest;
  delete packed.expectations_from_institute;
  return packed;
}

function decodeCareerObjective(record) {
  if (!record || typeof record !== 'object') return record;
  const unpacked = unpackText(record.campus_placement_reasons);
  return {
    ...record,
    campus_placement_reasons: unpacked.base,
    non_technical_areas: unpacked.meta.non_technical_areas ?? '',
    student_mentor_interest: unpacked.meta.student_mentor_interest ?? '',
    expectations_from_institute: unpacked.meta.expectations_from_institute ?? '',
  };
}

function encodeSkills(record = {}, skillPrograms = []) {
  const packed = {
    ...record,
    familiar_tools_platforms: packText(record.familiar_tools_platforms, {
      technical_soft_skills_overall: record.technical_soft_skills_overall,
      additional_technical_skills: record.additional_technical_skills,
      additional_soft_skills: record.additional_soft_skills,
      skill_programs: skillPrograms,
    }),
  };

  delete packed.technical_soft_skills_overall;
  delete packed.additional_technical_skills;
  delete packed.additional_soft_skills;
  return packed;
}

function decodeSkills(record) {
  if (!record || typeof record !== 'object') {
    return { skills: record, skill_programs: [] };
  }

  const unpacked = unpackText(record.familiar_tools_platforms);
  return {
    skills: {
      ...record,
      familiar_tools_platforms: unpacked.base,
      technical_soft_skills_overall: unpacked.meta.technical_soft_skills_overall ?? '',
      additional_technical_skills: unpacked.meta.additional_technical_skills ?? '',
      additional_soft_skills: unpacked.meta.additional_soft_skills ?? '',
    },
    skill_programs: Array.isArray(unpacked.meta.skill_programs) ? unpacked.meta.skill_programs : [],
  };
}

function encodeStudentProfilePayload(data = {}) {
  const encoded = { ...data };

  if (Array.isArray(data.past_education_records)) {
    encoded.past_education_records = encodePastEducationRecords(data.past_education_records);
  }
  if (Array.isArray(data.post_admission_records)) {
    encoded.post_admission_records = encodePostAdmissionRecords(data.post_admission_records);
  }
  if (Array.isArray(data.internships)) {
    encoded.internships = encodeInternships(data.internships);
  }
  if (data.career_objective && typeof data.career_objective === 'object') {
    encoded.career_objective = encodeCareerObjective(data.career_objective);
  }
  if ((data.skills && typeof data.skills === 'object') || Array.isArray(data.skill_programs)) {
    encoded.skills = encodeSkills(
      data.skills && typeof data.skills === 'object' ? data.skills : {},
      Array.isArray(data.skill_programs) ? data.skill_programs : [],
    );
  }

  delete encoded.skill_programs;
  delete encoded.admission_type;
  return encoded;
}

function decodeStudentProfilePayload(data = {}) {
  const decoded = { ...data };

  if (Array.isArray(decoded.past_education_records)) {
    decoded.past_education_records = decodePastEducationRecords(decoded.past_education_records);
  }
  if (Array.isArray(decoded.post_admission_records)) {
    decoded.post_admission_records = decodePostAdmissionRecords(decoded.post_admission_records);
  }
  if (Array.isArray(decoded.internships)) {
    decoded.internships = decodeInternships(decoded.internships);
  }
  if (decoded.career_objective && typeof decoded.career_objective === 'object') {
    decoded.career_objective = decodeCareerObjective(decoded.career_objective);
  }
  if (decoded.skills && typeof decoded.skills === 'object') {
    const unpackedSkills = decodeSkills(decoded.skills);
    decoded.skills = unpackedSkills.skills;
    decoded.skill_programs = unpackedSkills.skill_programs;
  } else if (!Array.isArray(decoded.skill_programs)) {
    decoded.skill_programs = [];
  }

  if (!decoded.admission_type) {
    const records = Array.isArray(decoded.past_education_records) ? decoded.past_education_records : [];
    decoded.admission_type = records.some((record) => record.exam_name === 'DIPLOMA')
      ? 'diploma'
      : records.some((record) => record.exam_name === 'HSSC' || record.exam_name === 'ENTRANCE_EXAM')
        ? 'hsc'
        : '';
  }

  return decoded;
}

module.exports = {
  packText,
  unpackText,
  packExamName,
  unpackExamName,
  decodePostAdmissionRecords,
  decodePastEducationRecords,
  decodeInternships,
  decodeCareerObjective,
  decodeSkills,
  encodeStudentProfilePayload,
  decodeStudentProfilePayload,
};
