import React, { useState, useEffect } from "react";
import "./InformationPage.css";

// Example mock data – replace with API/hook data in production
const mockData = {
	selectedChild: {
		childId: "child1",
		firstName: "Alice",
		lastName: "Doe",
	},
	subjects: [
		{
			subjectName: "Mathematics",
			assessments: [
				{ title: "Exam 1", pointsPossible: 30, grade: 25, type: "Exam" },
				{
					title: "Homework Week 1",
					pointsPossible: 5,
					grade: 5,
					type: "Homework",
				},
				{
					title: "Homework Week 2",
					pointsPossible: 5,
					grade: 4,
					type: "Homework",
				},
				{ title: "Final", pointsPossible: 50, grade: 45, type: "Final" },
			],
		},
		{
			subjectName: "English",
			assessments: [
				{ title: "Essay", pointsPossible: 40, grade: 35, type: "Essay" },
				{ title: "Exam", pointsPossible: 60, grade: 50, type: "Exam" },
			],
		},
		{
			subjectName: "Biology",
			assessments: [
				{ title: "Quiz", pointsPossible: 10, grade: 8, type: "Quiz" },
				{ title: "Lab Report", pointsPossible: 20, grade: 18, type: "Lab" },
				{ title: "Homework", pointsPossible: 5, grade: 4, type: "Homework" },
				{ title: "Homework", pointsPossible: 5, grade: 5, type: "Homework" },
			],
		},
	],
};

const InformationPage = () => {
	const [data, setData] = useState(null);
	// Track which subjects are expanded (by subject name)
	const [expanded, setExpanded] = useState({});

	useEffect(() => {
		// Simulate an API call delay
		setTimeout(() => {
			setData(mockData);
		}, 500);
	}, []);

	if (!data) {
		return <div className="info-page">Loading...</div>;
	}

	// Helper: Calculate totals & average for a subject
	const calculateSubjectStats = (assessments) => {
		let totalEarned = 0;
		let totalPossible = 0;
		assessments.forEach((a) => {
			totalEarned += a.grade !== undefined ? a.grade : 0;
			totalPossible += a.pointsPossible;
		});
		const avg = totalPossible
			? ((totalEarned / totalPossible) * 100).toFixed(1)
			: "-";
		return { totalEarned, totalPossible, average: avg + "%" };
	};

	const toggleExpand = (subjectName) => {
		setExpanded((prev) => ({ ...prev, [subjectName]: !prev[subjectName] }));
	};

	const { selectedChild, subjects } = data;

	return (
		<div className="info-page">
			<h1 className="page-title">
				Grades for {selectedChild.firstName} {selectedChild.lastName}
			</h1>
			<div className="subjects-container">
				{subjects.map((subject, index) => {
					const { totalEarned, totalPossible, average } = calculateSubjectStats(
						subject.assessments
					);
					const isExpanded = expanded[subject.subjectName] || false;

					return (
						<div key={index} className="subject-card">
							<div
								className="card-header"
								style={{ backgroundColor: "#04abfd" }}
							>
								<div className="header-content">
									<h2 className="card-title">{subject.subjectName}</h2>
									<div className="summary">
										<span>{subject.assessments.length} Assessments</span>
										<span>Avg: {average}</span>
									</div>
								</div>
								<button
									className="toggle-button"
									onClick={() => toggleExpand(subject.subjectName)}
								>
									{isExpanded ? "Hide Details" : "View Details"}
								</button>
							</div>
							{isExpanded && (
								<div className="card-body">
									{subject.assessments.map((a, idx) => (
										<div key={idx} className="assessment-row">
											<div className="assessment-title">{a.title}</div>
											<div className="assessment-grade">
												{a.grade !== undefined ? a.grade : "-"} /{" "}
												{a.pointsPossible}
											</div>
										</div>
									))}
									<div className="subject-total">
										<strong>Total: </strong>
										{totalEarned} / {totalPossible}
									</div>
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
