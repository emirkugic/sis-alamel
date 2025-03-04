import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import useStudentGrades from "../../hooks/useStudentGrades";
import { useParentAuthContext } from "../../contexts/ParentAuthContext";

import "./InformationPage.css";

const InformationPage = () => {
	const { id } = useParams();
	const { token } = useParentAuthContext();
	const { studentGrades, loading, error, fetchStudentGrades } =
		useStudentGrades(token);

	const [expandedSubjects, setExpandedSubjects] = useState([]);

	const getCurrentSemester = () => {
		const currentMonth = new Date().getMonth() + 1;
		return currentMonth >= 9 && currentMonth <= 12 ? "first" : "second";
	};

	const [activeSemester, setActiveSemester] = useState(getCurrentSemester());
	const [hasFirstSemesterData, setHasFirstSemesterData] = useState(false);

	useEffect(() => {
		if (token && id) {
			fetchStudentGrades(id);
		}
	}, [id, token]);

	useEffect(() => {
		if (studentGrades) {
			const currentYear = new Date().getFullYear();
			const newYearsDate = new Date(`${currentYear}-01-01`);

			const hasFirst = studentGrades.subjects?.some((subject) =>
				subject.assessments?.some(
					(assessment) => new Date(assessment.assessmentDate) < newYearsDate
				)
			);
			setHasFirstSemesterData(hasFirst);
		}
	}, [studentGrades]);

	const toggleSubject = (subjectId) => {
		if (expandedSubjects.includes(subjectId)) {
			setExpandedSubjects(expandedSubjects.filter((id) => id !== subjectId));
		} else {
			setExpandedSubjects([...expandedSubjects, subjectId]);
		}
	};

	const calculatePercentage = (score, total) => {
		if (!total || total <= 0) return "0";
		const percentage = (score / total) * 100;
		return Number.isInteger(percentage)
			? percentage.toString()
			: percentage.toFixed(1);
	};

	const isPassing = (percentage) => {
		return parseFloat(percentage) >= 55;
	};

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const filterAssessmentsBySemester = (assessments, semester) => {
		const currentYear = new Date().getFullYear();
		const newYearsDate = new Date(`${currentYear}-01-01`);

		if (semester === "first") {
			return assessments.filter(
				(a) => new Date(a.assessmentDate) < newYearsDate
			);
		} else {
			return assessments.filter(
				(a) => new Date(a.assessmentDate) >= newYearsDate
			);
		}
	};

	const getCategoryCounts = (subject, semester) => {
		const filtered = filterAssessmentsBySemester(
			subject.assessments || [],
			semester
		);
		const categories = {};
		filtered.forEach((assessment) => {
			const cat = assessment.type || "Unknown";
			if (!categories[cat]) categories[cat] = 0;
			categories[cat]++;
		});
		return categories;
	};

	// Calculate total points obtained and total points possible
	const calculateTotalPoints = (assessments) => {
		let totalObtained = 0;
		let totalPossible = 0;

		assessments.forEach((assessment) => {
			const score = parseFloat(assessment.grade) || 0;
			const total = parseFloat(assessment.points) || 0;
			totalObtained += score;
			totalPossible += total;
		});

		return { totalObtained, totalPossible };
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p>Loading student data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="loading-container">
				<p>Error loading student data: {error.message}</p>
			</div>
		);
	}

	if (!studentGrades) {
		return (
			<div className="loading-container">
				<p>No data found.</p>
			</div>
		);
	}

	const { student, subjects } = studentGrades;
	return (
		<div className="information-page">
			<header className="student-header">
				<div className="header-content">
					<div className="student-info">
						<h1>
							{student.firstName} {student.lastName}
						</h1>
						{/* Example "student-details" - remove or adapt since no "grade/homeroom" in new route */}
						<div className="student-details">
							<div className="detail-item">
								<span className="detail-label">Student ID:</span>
								<span className="detail-value">{student.id}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">Department:</span>
								<span className="detail-value">{student.departmentId}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="nav-tabs">
					<button
						className={`tab-button ${
							activeSemester === "first" ? "active" : ""
						} ${!hasFirstSemesterData ? "disabled" : ""}`}
						onClick={() => hasFirstSemesterData && setActiveSemester("first")}
						disabled={!hasFirstSemesterData}
					>
						First Semester
						{!hasFirstSemesterData && (
							<span className="coming-soon-badge">No Data</span>
						)}
					</button>
					<button
						className={`tab-button ${
							activeSemester === "second" ? "active" : ""
						}`}
						onClick={() => setActiveSemester("second")}
					>
						Second Semester
					</button>
				</div>
			</header>

			<div className="subjects-container">
				{subjects.map((subject) => {
					const semesterAssessments = filterAssessmentsBySemester(
						subject.assessments || [],
						activeSemester
					);
					if (semesterAssessments.length === 0) return null;

					let sumPercent = 0;
					semesterAssessments.forEach((a) => {
						const score = parseFloat(a.grade) || 0;
						const total = parseFloat(a.points) || 0;
						if (total > 0) {
							sumPercent += (score / total) * 100;
						}
					});
					const semesterAverage = semesterAssessments.length
						? Math.round(sumPercent / semesterAssessments.length).toString()
						: "0";

					// Calculate total points for this subject
					const { totalObtained, totalPossible } =
						calculateTotalPoints(semesterAssessments);

					return (
						<div className="subject-card" key={subject.subjectId}>
							<div
								className="subject-header"
								onClick={() => toggleSubject(subject.subjectId)}
							>
								<div className="subject-info">
									<h3>{subject.subjectName}</h3>
									{/* <p>{subject.description}</p> */}
								</div>
								<div className="subject-grade">
									<div
										className={`grade-display ${
											isPassing(semesterAverage) ? "passing" : "failing"
										}`}
									>
										<span className="percentage-text">{semesterAverage}%</span>
									</div>
									<div className="grade-details">
										<div className="assessment-count">
											{semesterAssessments.length}{" "}
											{semesterAssessments.length === 1
												? "assessment"
												: "assessments"}
										</div>
										<div className="total-points">
											{Number.isInteger(totalObtained)
												? Math.floor(totalObtained)
												: totalObtained.toFixed(1)}
											/
											{Number.isInteger(totalPossible)
												? Math.floor(totalPossible)
												: totalPossible.toFixed(1)}{" "}
										</div>
									</div>
									<span className="expand-icon">
										{expandedSubjects.includes(subject.subjectId) ? "▼" : "▶"}
									</span>
								</div>
							</div>

							{expandedSubjects.includes(subject.subjectId) && (
								<div className="assessments-container">
									<div className="assessment-filters">
										<div className="filter-section">
											<span className="filter-title">Types:</span>
											{Object.entries(
												getCategoryCounts(subject, activeSemester)
											).map(([type, count]) => (
												<span key={type} className="category-tag">
													{type} ({count})
												</span>
											))}
										</div>
									</div>
									<table className="assessments-table">
										<thead>
											<tr>
												<th>Date</th>
												<th>Title</th>
												<th>Type</th>
												<th>Score</th>
												<th>Percentage</th>
											</tr>
										</thead>
										<tbody>
											{[...semesterAssessments]
												.sort(
													(a, b) =>
														new Date(b.assessmentDate) -
														new Date(a.assessmentDate)
												)
												.map((assessment) => {
													const score = parseFloat(assessment.grade) || 0;
													const total = parseFloat(assessment.points) || 0;
													const percentage = calculatePercentage(score, total);

													return (
														<tr key={assessment.assessmentId}>
															<td>{formatDate(assessment.assessmentDate)}</td>
															<td>{assessment.title}</td>
															<td>
																<span className="category-pill">
																	{assessment.type || "N/A"}
																</span>
															</td>
															<td>
																{score}/{total}
															</td>
															<td>
																<div className="percentage-cell">
																	<div className="percentage-value">
																		{percentage}%
																	</div>
																	<div
																		className={`percentage-bar ${
																			isPassing(percentage)
																				? "passing"
																				: "failing"
																		}`}
																		style={{
																			width: `${(score / total) * 100}%`,
																		}}
																	></div>
																</div>
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default InformationPage;
