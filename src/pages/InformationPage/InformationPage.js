import React, { useState, useEffect } from "react";
import "./InformationPage.css";
import studentData from "./data.json";

const InformationPage = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [expandedSubjects, setExpandedSubjects] = useState([]);

	// Determine current semester based on date
	const getCurrentSemester = () => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed

		// First semester: September to December (months 9-12)
		// Second semester: January to August (months 1-8)
		return currentMonth >= 9 && currentMonth <= 12 ? "first" : "second";
	};

	const [activeSemester, setActiveSemester] = useState(getCurrentSemester());
	const [hasFirstSemesterData, setHasFirstSemesterData] = useState(false);

	// Simulate fetching data
	useEffect(() => {
		// In a real application, this would be a fetch call to your API
		setTimeout(() => {
			setData(studentData);

			// Check if there's data for the first semester
			// In a real app, you would check if there are assessments with dates before January 1st
			const currentYear = new Date().getFullYear();
			const newYearsDate = new Date(`${currentYear}-01-01`);

			// Check if any subject has assessments before New Year's
			const firstSemesterData = studentData.subjects.some((subject) =>
				subject.assessments.some(
					(assessment) => new Date(assessment.date) < newYearsDate
				)
			);

			setHasFirstSemesterData(firstSemesterData);
			setLoading(false);
		}, 500);
	}, []);

	// Toggle function to expand/collapse a subject's assessments
	const toggleSubject = (subjectId) => {
		if (expandedSubjects.includes(subjectId)) {
			setExpandedSubjects(expandedSubjects.filter((id) => id !== subjectId));
		} else {
			setExpandedSubjects([...expandedSubjects, subjectId]);
		}
	};

	// Helper function to calculate the percentage score for an assessment
	const calculatePercentage = (score, total) => {
		return ((score / total) * 100).toFixed(1);
	};

	// Helper function to determine if an assessment or subject is passing
	const isPassing = (percentage) => {
		return percentage >= 55;
	};

	// Helper function to format date
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	// Filter assessments by semester
	const filterAssessmentsBySemester = (assessments, semester) => {
		const currentYear = new Date().getFullYear();
		const newYearsDate = new Date(`${currentYear}-01-01`);

		if (semester === "first") {
			return assessments.filter(
				(assessment) => new Date(assessment.date) < newYearsDate
			);
		} else {
			return assessments.filter(
				(assessment) => new Date(assessment.date) >= newYearsDate
			);
		}
	};

	// Get category counts for a subject
	const getCategoryCounts = (subject, semester) => {
		const filteredAssessments = filterAssessmentsBySemester(
			subject.assessments,
			semester
		);
		const categories = {};

		filteredAssessments.forEach((assessment) => {
			if (!categories[assessment.category]) {
				categories[assessment.category] = 0;
			}
			categories[assessment.category]++;
		});

		return categories;
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p>Loading student data...</p>
			</div>
		);
	}

	return (
		<div className="information-page">
			<header className="student-header">
				<div className="header-content">
					<div className="student-info">
						<h1>{data.student.name}'s Academic Progress</h1>
						<div className="student-details">
							<div className="detail-item">
								<span className="detail-label">Grade:</span>
								<span className="detail-value">{data.student.grade}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">ID:</span>
								<span className="detail-value">{data.student.studentId}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">Homeroom:</span>
								<span className="detail-value">{data.student.homeroom}</span>
							</div>
						</div>
						<div className="term-info">
							<span>
								{data.student.academicYear} • {data.student.term}
							</span>
							<span className="update-info">
								Last updated: {formatDate(data.student.lastUpdated)}
							</span>
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
				{data.subjects.map((subject) => {
					// Filter assessments by active semester
					const semesterAssessments = filterAssessmentsBySemester(
						subject.assessments,
						activeSemester
					);

					// If no assessments for this semester, skip this subject
					if (semesterAssessments.length === 0) return null;

					// Calculate semester average for this subject
					const semesterTotalPercentage = semesterAssessments.reduce(
						(sum, assessment) => {
							return sum + (assessment.score / assessment.total) * 100;
						},
						0
					);

					const semesterAverage = (
						semesterTotalPercentage / semesterAssessments.length
					).toFixed(1);

					return (
						<div className="subject-card" key={subject.id}>
							<div
								className="subject-header"
								onClick={() => toggleSubject(subject.id)}
							>
								<div className="subject-info">
									<h3>{subject.name}</h3>
									<p>Teacher: {subject.teacher}</p>
								</div>

								<div className="subject-grade">
									<div
										className={`grade-display ${
											isPassing(semesterAverage) ? "passing" : "failing"
										}`}
									>
										{semesterAverage}%
									</div>
									<div className="assessment-count">
										{semesterAssessments.length}{" "}
										{semesterAssessments.length === 1
											? "assessment"
											: "assessments"}
									</div>
									<span className="expand-icon">
										{expandedSubjects.includes(subject.id) ? "▼" : "▶"}
									</span>
								</div>
							</div>

							{expandedSubjects.includes(subject.id) && (
								<div className="assessments-container">
									<div className="assessment-filters">
										<div className="filter-section">
											<span className="filter-title">Categories:</span>
											{Object.entries(
												getCategoryCounts(subject, activeSemester)
											).map(([category, count]) => (
												<span key={category} className="category-tag">
													{category} ({count})
												</span>
											))}
										</div>
									</div>
									<table className="assessments-table">
										<thead>
											<tr>
												<th>Date</th>
												<th>Assessment</th>
												<th>Category</th>
												<th>Score</th>
												<th>Percentage</th>
											</tr>
										</thead>
										<tbody>
											{semesterAssessments
												.sort((a, b) => new Date(b.date) - new Date(a.date))
												.map((assessment) => {
													const percentage = calculatePercentage(
														assessment.score,
														assessment.total
													);
													return (
														<tr key={assessment.id}>
															<td>{formatDate(assessment.date)}</td>
															<td>{assessment.name}</td>
															<td>
																<span className="category-pill">
																	{assessment.category}
																</span>
															</td>
															<td>
																{assessment.score}/{assessment.total}
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
																			width: `${
																				(assessment.score / assessment.total) *
																				100
																			}%`,
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
