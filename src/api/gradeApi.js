import baseApi from "./baseApi";

const gradeApi = {
	getStudentGrades: async (studentId, token) => {
		const response = await baseApi.get(
			`AssessmentGrade/student/${studentId}/grades`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	},
};

export default gradeApi;
