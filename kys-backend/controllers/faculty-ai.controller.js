const { generateFacultyInsights } = require('../services/groq.service');
const { normalizeStudentRecord } = require('../services/studentContextAdapter');
const { 
    Student, 
    MentoringMinute, 
    Faculty, 
    PostAdmissionAcademicRecord,
    Project,
    Internship,
    CareerObjective,
    Skills,
    SWOC
} = require('../models');
const { sendResponse } = require('../utils/responseWrapper');
const logger = require('../utils/logger');

/**
 * Generate AI-powered remarks for a student
 * POST /api/faculty/ai-remarks
 */
const generateAIRemarks = async (req, res) => {
    try {
        logger.info({ reqId: req.id, message: 'AI Remarks Request Initiated', studentUid: req.body?.studentContext?.uid });

        const { query, studentContext } = req.body;

        if (!query || typeof query !== 'string') {
            return sendResponse(res, { success: false, status: 400, error: 'Query is required' });
        }

        if (!studentContext || !studentContext.uid) {
            return sendResponse(res, { success: false, status: 400, error: 'Student context is required' });
        }

        // Verify faculty has access to this student
        const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
        if (!faculty) {
            return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });
        }

        // Fetch student and verify they are assigned to this faculty
        const student = await Student.findOne({
            where: { uid: studentContext.uid, mentor_id: faculty.id },
            attributes: ['id', 'uid', 'semester', 'first_name', 'middle_name', 'last_name'],
        });

        if (!student) {
            return sendResponse(res, { success: false, status: 403, error: 'Student not found or not assigned to this faculty' });
        }

        // Fetch recent mentoring minutes
        const recentMinutes = await MentoringMinute.findAll({
            where: { student_id: student.id },
            order: [['date', 'DESC']],
            limit: 3,
            attributes: ['date', 'remarks', 'suggestion', 'action'],
        });

        // Fetch academic records for SGPA
        const academicRecords = await PostAdmissionAcademicRecord.findAll({
            where: { student_id: student.id },
            order: [['semester', 'ASC']],
            attributes: ['semester', 'sgpa', 'backlog_subjects'],
        });

        // Fetch additional student details in parallel
        const [
            projects,
            internships,
            careerObjective,
            skills,
            swoc
        ] = await Promise.all([
            Project.findAll({ where: { student_id: student.id } }),
            Internship.findAll({ where: { student_id: student.id } }),
            CareerObjective.findOne({ where: { student_id: student.id } }),
            Skills.findOne({ where: { student_id: student.id } }),
            SWOC.findOne({ where: { student_id: student.id } })
        ]);

        // Build model-shaped context, then normalize via shared adapter (same as chatbot path)
        const enrichedContext = normalizeStudentRecord({
            uid: student.uid,
            name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
            semester: student.semester,
            program: studentContext.program,
            academics: academicRecords.map((record) => ({
                semester: record.semester,
                sgpa: record.sgpa,
                backlog_subjects: record.backlog_subjects,
            })),
            projects: projects.map((project) => ({
                title: project.title,
                description: project.description,
            })),
            internships: internships.map((internship) => ({
                title: internship.title,
                company_name: internship.company_name,
                domain: internship.domain,
                internship_type: internship.internship_type,
                paid_unpaid: internship.paid_unpaid,
                description: internship.description,
            })),
            career_objective: careerObjective
                ? {
                    career_goal: careerObjective.career_goal,
                    specific_details: careerObjective.specific_details,
                    interested_in_campus_placement: careerObjective.interested_in_campus_placement,
                    clarity_preparedness: careerObjective.clarity_preparedness,
                }
                : null,
            skills: skills
                ? {
                    programming_languages: skills.programming_languages,
                    technologies_frameworks: skills.technologies_frameworks,
                    domains_of_interest: skills.domains_of_interest,
                    familiar_tools_platforms: skills.familiar_tools_platforms,
                }
                : null,
            swoc: swoc
                ? {
                    strengths: swoc.strengths,
                    weaknesses: swoc.weaknesses,
                    opportunities: swoc.opportunities,
                    challenges: swoc.challenges,
                }
                : null,
            recent_mentoring_minutes: recentMinutes.map((minute) => ({
                date: minute.date,
                remarks: minute.remarks,
                suggestion: minute.suggestion,
                action: minute.action,
            })),
        });

        // Generate AI insights using the same service as chatbot
        const aiResponse = await generateFacultyInsights({
            facultyQuery: query,
            studentDataset: {
                total_students: 1,
                students: [enrichedContext],
            },
            mode: 'remarks',
        }, req.id);

        logger.info({ reqId: req.id, message: 'AI Remarks Generated Successfully', studentUid: student.uid });

        return sendResponse(res, {
            success: true,
            data: {
                content: aiResponse,
                studentUid: student.uid,
                timestamp: new Date().toISOString(),
            }
        });
    } catch (error) {
        logger.error({ reqId: req.id, message: 'AI Remarks Generation Error', error: error.message, stack: error.stack });
        return sendResponse(res, { success: false, status: 500, error: error.message || 'Failed to generate AI remarks' });
    }
};

module.exports = {
    generateAIRemarks,
};
