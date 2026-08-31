const {
  WELL_FORMED_RESPONSE,
  TRUNCATED_RESPONSE,
} = require('./aiResponseValidator.fixtures');

const completionFromText = (text) => ({
  choices: [{ message: { content: text } }],
});

const providerSuccess = () =>
  Promise.resolve(completionFromText(WELL_FORMED_RESPONSE));

const providerEmpty = () => Promise.resolve(completionFromText(''));

const providerMalformed = () =>
  Promise.resolve(completionFromText('Unstructured answer without required sections.'));

const providerTruncated = () =>
  Promise.resolve(completionFromText(TRUNCATED_RESPONSE));

const makeProviderHttpError = (status, message, extra = {}) =>
  Object.assign(new Error(message), { status, ...extra });

const makeProviderNetworkError = (code, message) =>
  Object.assign(new Error(message), { code });

const providerErrors = {
  timeout: () => makeProviderNetworkError('ETIMEDOUT', 'Request timed out'),
  rateLimited: () => makeProviderHttpError(429, 'Rate limit exceeded'),
  unauthorized: () => makeProviderHttpError(401, 'Invalid API Key'),
  badRequest: () => makeProviderHttpError(400, 'Bad Request'),
  internal: () => makeProviderHttpError(500, 'Internal Server Error'),
  unavailable: () => makeProviderHttpError(503, 'Service Unavailable'),
  networkReset: () => makeProviderNetworkError('ECONNRESET', 'Connection reset'),
  networkDns: () => makeProviderNetworkError('ENOTFOUND', 'getaddrinfo ENOTFOUND api.groq.com'),
  modelDecommissioned: () =>
    Object.assign(new Error('model decommissioned'), {
      error: { error: { code: 'model_decommissioned' } },
    }),
  modelNotFound: () =>
    Object.assign(new Error('The model does not exist or you do not have access to it'), {
      status: 404,
      error: { error: { code: 'model_not_found' } },
    }),
};

const minimalStudentDataset = () => ({
  total_students: 1,
  students: [
    {
      name: 'Test Student',
      semester: 5,
      cgpa: 8.1,
      academicRecords: [{ semester: 4, sgpa: 8.0, backlogs: 'None' }],
    },
  ],
});

const missingStudentDataset = () => ({
  total_students: 0,
  students: [],
});

const largeStudentDataset = () => ({
  total_students: 1,
  students: [
    {
      name: 'Large Profile Student',
      semester: 8,
      cgpa: 9.1,
      academicRecords: Array.from({ length: 8 }, (_, i) => ({
        semester: i + 1,
        sgpa: 8 + i * 0.1,
        backlogs: 'None',
      })),
      projects: Array.from({ length: 20 }, (_, i) => ({
        title: `Project ${i + 1}`,
        description: 'x'.repeat(500),
      })),
      internships: Array.from({ length: 5 }, (_, i) => ({
        title: `Internship ${i + 1}`,
      })),
      skills: {
        programming: 'Python, Java, C++',
        technologies: 'React, Node, Docker',
        domains: 'Web, ML, Cloud',
      },
      recentMinutes: Array.from({ length: 10 }, (_, i) => ({
        remarks: `Mentoring note ${i + 1}: `.padEnd(400, 'a'),
      })),
    },
  ],
});

module.exports = {
  completionFromText,
  providerSuccess,
  providerEmpty,
  providerMalformed,
  providerTruncated,
  makeProviderHttpError,
  makeProviderNetworkError,
  providerErrors,
  minimalStudentDataset,
  missingStudentDataset,
  largeStudentDataset,
};
