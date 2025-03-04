import { useState } from "react";
import gradeApi from "../api/gradeApi";

const useStudentGrades = (token) => {
	const [studentGrades, setStudentGrades] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchStudentGrades = async (studentId) => {
		try {
			setLoading(true);
			setError(null);
			const data = await gradeApi.getStudentGrades(studentId, token);
			setStudentGrades(data);
		} catch (err) {
			setError(err);
			console.error("Error fetching student grades:", err);
		} finally {
			setLoading(false);
		}
	};

	return {
		studentGrades,
		loading,
		error,
		fetchStudentGrades,
	};
};

export default useStudentGrades;
