function computePercentileThresholds(cgpaValues) {
  if (!cgpaValues || cgpaValues.length === 0) {
    return { bottom20Threshold: 0, top15Threshold: Infinity };
  }
  
  const sorted = [...cgpaValues].sort((a, b) => a - b);
  
  const getPercentile = (p) => {
    if (sorted.length === 1) return sorted[0];
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  return {
    bottom20Threshold: getPercentile(20),
    top15Threshold: getPercentile(85)
  };
}

function classifyStudents(students) {
  const cohorts = {};
  
  // Group CGPAs by department + semester for valid students
  students.forEach(student => {
    const cgpa = parseFloat(student.cgpa) || 0;
    const backlogs = parseInt(student.backlogs) || 0;
    
    // Skip students who haven't filled profile (0 CGPA & 0 backlogs) from skewing the cohort percentiles
    if (cgpa === 0 && backlogs === 0) return;

    if (student.semester >= 2 && cgpa >= 0) {
      const key = `${student.department}_${student.semester}`;
      if (!cohorts[key]) cohorts[key] = [];
      cohorts[key].push(cgpa);
    }
  });

  const cohortThresholds = {};
  for (const [key, cgpas] of Object.entries(cohorts)) {
    cohortThresholds[key] = computePercentileThresholds(cgpas);
  }

  return students.map(student => {
    const isSemester2Plus = student.semester >= 2;
    const cgpa = parseFloat(student.cgpa) || 0;
    const key = `${student.department}_${student.semester}`;
    const thresholds = cohortThresholds[key] || { bottom20Threshold: 0, top15Threshold: Infinity };

    const slowReasons = [];
    const advancedReasons = [];

    // Slow Learner conditions
    if (student.backlogs >= 2) {
      slowReasons.push(`Backlogs: ${student.backlogs} (>= 2)`);
    }
    if (isSemester2Plus && student.cgpa != null && cgpa <= thresholds.bottom20Threshold) {
      slowReasons.push(`Bottom 20% CGPA in cohort (${cgpa.toFixed(2)} <= ${thresholds.bottom20Threshold.toFixed(2)})`);
    }
    
    const mseMarks = student.mse_marks !== undefined ? student.mse_marks : student.mseMarks;
    if (mseMarks != null && mseMarks < 45) {
      slowReasons.push(`MSE Marks: ${mseMarks}% (< 45%)`);
    }

    // Advanced Learner conditions
    if (isSemester2Plus && student.cgpa != null && cgpa >= thresholds.top15Threshold) {
      advancedReasons.push(`Top 15% CGPA in cohort (${cgpa.toFixed(2)} >= ${thresholds.top15Threshold.toFixed(2)})`);
    }
    
    // Some Sequelize responses use strings for JSON fields if not parsed
    let achievements = student.achievements;
    if (typeof achievements === 'string') {
      try { achievements = JSON.parse(achievements); } catch (e) {}
    }
    if (Array.isArray(achievements) && achievements.length > 0) {
      advancedReasons.push(`Has verified achievements (${achievements.length})`);
    }

    let hasInnovationOrResearch = false;
    let publications = student.publications;
    if (typeof publications === 'string') {
      try { publications = JSON.parse(publications); } catch (e) {}
    }
    if (Array.isArray(publications) && publications.length > 0) {
      hasInnovationOrResearch = true;
    }
    
    let projects = student.projects;
    if (typeof projects === 'string') {
      try { projects = JSON.parse(projects); } catch (e) {}
    }
    if (Array.isArray(projects) && projects.length > 0) {
      const hasTaggedProject = projects.some(p => {
        const str = JSON.stringify(p).toLowerCase();
        return str.includes('innovation') || str.includes('patent') || str.includes('research');
      });
      if (hasTaggedProject) {
        hasInnovationOrResearch = true;
      }
    }

    if (hasInnovationOrResearch) {
      advancedReasons.push(`Has innovation/research projects or publications`);
    }

    let isSlowLearner = slowReasons.length > 0;
    let isAdvancedLearner = advancedReasons.length > 0;

    // RULE 1: Priority to Slow learner over Advanced learner
    if (isSlowLearner && isAdvancedLearner) {
      isAdvancedLearner = false;
      advancedReasons.length = 0; // Clear advanced reasons so it doesn't show in UI
    }

    // RULE 2: If profile details are unfilled (CGPA is 0 and backlogs is 0), they should not be classified
    if (cgpa === 0 && student.backlogs === 0) {
      isSlowLearner = false;
      isAdvancedLearner = false;
      slowReasons.length = 0;
      advancedReasons.length = 0;
    }

    return {
      ...student,
      classification: {
        isSlowLearner,
        isAdvancedLearner,
        slowReasons,
        advancedReasons
      }
    };
  });
}

module.exports = { classifyStudents, computePercentileThresholds };
