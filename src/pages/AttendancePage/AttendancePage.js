import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useParentAuthContext } from "../../contexts/ParentAuthContext";
import "./AttendancePage.css";

const AttendancePage = () => {
	const { id } = useParams();
	const { token } = useParentAuthContext();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [studentData, setStudentData] = useState(null);
	const [attendanceData, setAttendanceData] = useState([]);
	const [activeView, setActiveView] = useState("calendar"); // calendar, classes, summary
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	// Mock fetching student attendance data
	useEffect(() => {
		const fetchAttendanceData = async () => {
			try {
				setLoading(true);
				// In a real app, you would fetch actual data from your API
				// const response = await fetch(`/api/students/${id}/attendance?month=${selectedMonth}&year=${selectedYear}`, {
				//   headers: { Authorization: `Bearer ${token}` }
				// });
				// const data = await response.json();

				// For now, we'll use mock data
				const mockStudent = {
					id: id,
					firstName: "Alex",
					lastName: "Smith",
					grade: "10",
					homeroom: "10B",
					totalAbsences: 5,
					totalLates: 8,
					attendanceRate: 92.5,
				};

				// Generate mock attendance data for the selected month
				const daysInMonth = new Date(
					selectedYear,
					selectedMonth + 1,
					0
				).getDate();
				const mockAttendance = [];

				for (let day = 1; day <= daysInMonth; day++) {
					const date = new Date(selectedYear, selectedMonth, day);
					const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

					// Skip weekends
					if (dayOfWeek === 0 || dayOfWeek === 6) continue;

					// Determine number of classes based on day (Friday has 5, others have 7)
					const numClasses = dayOfWeek === 5 ? 5 : 7;

					const classes = [];
					for (let i = 1; i <= numClasses; i++) {
						// Generate random attendance status
						// P = Present, A = Absent, L = Late, E = Excused
						const statuses = ["P", "P", "P", "P", "P", "P", "L", "L", "A", "E"];
						const randomStatus =
							statuses[Math.floor(Math.random() * statuses.length)];

						classes.push({
							period: i,
							subject: getSubjectForPeriod(i, dayOfWeek),
							status: randomStatus,
							time: getTimeForPeriod(i),
							teacher: getTeacherForSubject(getSubjectForPeriod(i, dayOfWeek)),
						});
					}

					mockAttendance.push({
						date: date,
						dayOfWeek: dayOfWeek,
						classes: classes,
					});
				}

				setStudentData(mockStudent);
				setAttendanceData(mockAttendance);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		if (token && id) {
			fetchAttendanceData();
		}
	}, [id, token, selectedMonth, selectedYear]);

	// Helper function to get subject name based on period and day
	const getSubjectForPeriod = (period, dayOfWeek) => {
		const subjects = {
			1: ["Mathematics", "English", "Mathematics", "Science", "English"],
			2: ["English", "History", "Physical Education", "Mathematics", "History"],
			3: ["Science", "Mathematics", "English", "History", "Science"],
			4: ["History", "Science", "Science", "English", "Mathematics"],
			5: [
				"Physical Education",
				"Art",
				"History",
				"Physical Education",
				"Physical Education",
			],
			6: ["Art", "Physical Education", "Art", "Art", null],
			7: [
				"Computer Science",
				"Computer Science",
				"Computer Science",
				"Computer Science",
				null,
			],
		};

		// Adjust dayOfWeek (0 = Sunday) to use as index (0 = Monday for our array)
		const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

		// Return subject based on period and day
		return subjects[period][adjustedDay];
	};

	// Helper function to get time for each period
	const getTimeForPeriod = (period) => {
		const times = {
			1: "8:00 - 8:50",
			2: "9:00 - 9:50",
			3: "10:00 - 10:50",
			4: "11:00 - 11:50",
			5: "12:30 - 1:20",
			6: "1:30 - 2:20",
			7: "2:30 - 3:20",
		};
		return times[period];
	};

	// Helper function to assign teachers to subjects
	const getTeacherForSubject = (subject) => {
		if (!subject) return null;

		const teachers = {
			Mathematics: "Dr. Johnson",
			English: "Ms. Williams",
			Science: "Mr. Brown",
			History: "Mrs. Davis",
			"Physical Education": "Coach Miller",
			Art: "Ms. Wilson",
			"Computer Science": "Mr. Taylor",
		};
		return teachers[subject];
	};

	// Format date for display
	const formatDate = (date) => {
		const options = { weekday: "short", month: "short", day: "numeric" };
		return date.toLocaleDateString(undefined, options);
	};

	// Get month name
	const getMonthName = (month) => {
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		return monthNames[month];
	};

	// Calculate attendance statistics
	const calculateAttendanceStats = () => {
		if (!attendanceData.length)
			return { present: 0, absent: 0, late: 0, excused: 0 };

		let present = 0,
			absent = 0,
			late = 0,
			excused = 0,
			total = 0;

		attendanceData.forEach((day) => {
			day.classes.forEach((cls) => {
				total++;
				if (cls.status === "P") present++;
				else if (cls.status === "A") absent++;
				else if (cls.status === "L") late++;
				else if (cls.status === "E") excused++;
			});
		});

		return {
			present,
			absent,
			late,
			excused,
			total,
			presentPercentage: ((present / total) * 100).toFixed(1),
			absentPercentage: ((absent / total) * 100).toFixed(1),
			latePercentage: ((late / total) * 100).toFixed(1),
			excusedPercentage: ((excused / total) * 100).toFixed(1),
		};
	};

	// Calculate subject-specific attendance
	const calculateSubjectAttendance = () => {
		if (!attendanceData.length) return [];

		const subjects = {};

		attendanceData.forEach((day) => {
			day.classes.forEach((cls) => {
				if (!cls.subject) return;

				if (!subjects[cls.subject]) {
					subjects[cls.subject] = {
						name: cls.subject,
						teacher: cls.teacher,
						present: 0,
						absent: 0,
						late: 0,
						excused: 0,
						total: 0,
					};
				}

				subjects[cls.subject].total++;
				if (cls.status === "P") subjects[cls.subject].present++;
				else if (cls.status === "A") subjects[cls.subject].absent++;
				else if (cls.status === "L") subjects[cls.subject].late++;
				else if (cls.status === "E") subjects[cls.subject].excused++;
			});
		});

		return Object.values(subjects).map((subject) => ({
			...subject,
			attendanceRate: (
				((subject.present + subject.excused) / subject.total) *
				100
			).toFixed(1),
		}));
	};

	// Handle month navigation
	const navigateMonth = (direction) => {
		let newMonth = selectedMonth + direction;
		let newYear = selectedYear;

		if (newMonth < 0) {
			newMonth = 11;
			newYear--;
		} else if (newMonth > 11) {
			newMonth = 0;
			newYear++;
		}

		setSelectedMonth(newMonth);
		setSelectedYear(newYear);
	};

	// Get status color class
	const getStatusClass = (status) => {
		switch (status) {
			case "P":
				return "status-present";
			case "A":
				return "status-absent";
			case "L":
				return "status-late";
			case "E":
				return "status-excused";
			default:
				return "";
		}
	};

	// Get status label
	const getStatusLabel = (status) => {
		switch (status) {
			case "P":
				return "Present";
			case "A":
				return "Absent";
			case "L":
				return "Late";
			case "E":
				return "Excused";
			default:
				return status;
		}
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p>Loading attendance data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="error-container">
				<p>Error loading attendance data: {error}</p>
			</div>
		);
	}

	if (!studentData) {
		return (
			<div className="error-container">
				<p>No student data found.</p>
			</div>
		);
	}

	// Calculate stats once
	const stats = calculateAttendanceStats();
	const subjectStats = calculateSubjectAttendance();

	return (
		<div className="attendance-page">
			<header className="student-header">
				<div className="header-content">
					<div className="student-info">
						<h1>
							{studentData.firstName} {studentData.lastName}'s Attendance
						</h1>
						<div className="student-details">
							<div className="detail-item">
								<span className="detail-label">Student ID:</span>
								<span className="detail-value">{studentData.id}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">Grade:</span>
								<span className="detail-value">{studentData.grade}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">Homeroom:</span>
								<span className="detail-value">{studentData.homeroom}</span>
							</div>
						</div>
					</div>

					<div className="attendance-overview">
						<div className="overview-stat">
							<div className="stat-value">{stats.presentPercentage}%</div>
							<div className="stat-label">Attendance Rate</div>
						</div>
						<div className="overview-stat">
							<div className="stat-value">{stats.absent}</div>
							<div className="stat-label">Absences</div>
						</div>
						<div className="overview-stat">
							<div className="stat-value">{stats.late}</div>
							<div className="stat-label">Late Arrivals</div>
						</div>
					</div>
				</div>

				<div className="nav-tabs">
					<button
						className={`tab-button ${
							activeView === "calendar" ? "active" : ""
						}`}
						onClick={() => setActiveView("calendar")}
					>
						Calendar View
					</button>
					<button
						className={`tab-button ${activeView === "classes" ? "active" : ""}`}
						onClick={() => setActiveView("classes")}
					>
						Classes View
					</button>
					<button
						className={`tab-button ${activeView === "summary" ? "active" : ""}`}
						onClick={() => setActiveView("summary")}
					>
						Summary
					</button>
				</div>
			</header>

			<div className="attendance-content">
				{activeView === "calendar" && (
					<div className="calendar-view">
						<div className="month-selector">
							<button className="month-nav" onClick={() => navigateMonth(-1)}>
								&lt;
							</button>
							<h2>
								{getMonthName(selectedMonth)} {selectedYear}
							</h2>
							<button className="month-nav" onClick={() => navigateMonth(1)}>
								&gt;
							</button>
						</div>

						<div className="attendance-legend">
							<div className="legend-item">
								<span className="legend-color status-present"></span>
								<span>Present</span>
							</div>
							<div className="legend-item">
								<span className="legend-color status-absent"></span>
								<span>Absent</span>
							</div>
							<div className="legend-item">
								<span className="legend-color status-late"></span>
								<span>Late</span>
							</div>
							<div className="legend-item">
								<span className="legend-color status-excused"></span>
								<span>Excused</span>
							</div>
						</div>

						<div className="days-container">
							{attendanceData.map((day, index) => (
								<div className="day-card" key={index}>
									<div className="day-header">
										<h3>{formatDate(day.date)}</h3>
									</div>
									<div className="periods-list">
										{day.classes.map((cls, i) => (
											<div className="period-item" key={i}>
												<div className="period-info">
													<span className="period-number">P{cls.period}</span>
													<span className="period-subject">{cls.subject}</span>
												</div>
												<div
													className={`period-status ${getStatusClass(
														cls.status
													)}`}
												>
													{cls.status}
												</div>
											</div>
										))}
									</div>
								</div>
							))}

							{attendanceData.length === 0 && (
								<div className="no-data-message">
									No attendance data available for this month.
								</div>
							)}
						</div>
					</div>
				)}

				{activeView === "classes" && (
					<div className="classes-view">
						<div className="month-selector">
							<button className="month-nav" onClick={() => navigateMonth(-1)}>
								&lt;
							</button>
							<h2>
								{getMonthName(selectedMonth)} {selectedYear}
							</h2>
							<button className="month-nav" onClick={() => navigateMonth(1)}>
								&gt;
							</button>
						</div>

						<div className="subjects-container">
							{subjectStats.map((subject, index) => (
								<div className="subject-card" key={index}>
									<div className="subject-header">
										<h3>{subject.name}</h3>
										<div className="subject-teacher">
											Teacher: {subject.teacher}
										</div>
									</div>
									<div className="subject-stats">
										<div className="attendance-bar">
											<div
												className="attendance-progress status-present"
												style={{
													width: `${(subject.present / subject.total) * 100}%`,
												}}
											></div>
											<div
												className="attendance-progress status-excused"
												style={{
													width: `${(subject.excused / subject.total) * 100}%`,
												}}
											></div>
											<div
												className="attendance-progress status-late"
												style={{
													width: `${(subject.late / subject.total) * 100}%`,
												}}
											></div>
											<div
												className="attendance-progress status-absent"
												style={{
													width: `${(subject.absent / subject.total) * 100}%`,
												}}
											></div>
										</div>
										<div className="attendance-percentage">
											{subject.attendanceRate}% Attendance
										</div>
									</div>
									<div className="subject-details">
										<div className="detail-row">
											<span>Present:</span>
											<span>
												{subject.present} (
												{((subject.present / subject.total) * 100).toFixed(1)}%)
											</span>
										</div>
										<div className="detail-row">
											<span>Excused:</span>
											<span>
												{subject.excused} (
												{((subject.excused / subject.total) * 100).toFixed(1)}%)
											</span>
										</div>
										<div className="detail-row">
											<span>Late:</span>
											<span>
												{subject.late} (
												{((subject.late / subject.total) * 100).toFixed(1)}%)
											</span>
										</div>
										<div className="detail-row">
											<span>Absent:</span>
											<span>
												{subject.absent} (
												{((subject.absent / subject.total) * 100).toFixed(1)}%)
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeView === "summary" && (
					<div className="summary-view">
						<div className="month-selector">
							<button className="month-nav" onClick={() => navigateMonth(-1)}>
								&lt;
							</button>
							<h2>
								{getMonthName(selectedMonth)} {selectedYear}
							</h2>
							<button className="month-nav" onClick={() => navigateMonth(1)}>
								&gt;
							</button>
						</div>

						<div className="summary-container">
							<div className="summary-card overall-summary">
								<h3>Monthly Attendance Summary</h3>

								<div className="summary-chart">
									<div className="chart-bar">
										<div
											className="chart-segment status-present"
											style={{ width: `${stats.presentPercentage}%` }}
											title={`Present: ${stats.present} (${stats.presentPercentage}%)`}
										></div>
										<div
											className="chart-segment status-excused"
											style={{ width: `${stats.excusedPercentage}%` }}
											title={`Excused: ${stats.excused} (${stats.excusedPercentage}%)`}
										></div>
										<div
											className="chart-segment status-late"
											style={{ width: `${stats.latePercentage}%` }}
											title={`Late: ${stats.late} (${stats.latePercentage}%)`}
										></div>
										<div
											className="chart-segment status-absent"
											style={{ width: `${stats.absentPercentage}%` }}
											title={`Absent: ${stats.absent} (${stats.absentPercentage}%)`}
										></div>
									</div>
									<div className="chart-legend">
										<div className="legend-item">
											<span className="legend-color status-present"></span>
											<span>Present ({stats.presentPercentage}%)</span>
										</div>
										<div className="legend-item">
											<span className="legend-color status-excused"></span>
											<span>Excused ({stats.excusedPercentage}%)</span>
										</div>
										<div className="legend-item">
											<span className="legend-color status-late"></span>
											<span>Late ({stats.latePercentage}%)</span>
										</div>
										<div className="legend-item">
											<span className="legend-color status-absent"></span>
											<span>Absent ({stats.absentPercentage}%)</span>
										</div>
									</div>
								</div>

								<div className="summary-stats">
									<div className="stats-column">
										<div className="stat-item">
											<span className="stat-label">Total Classes:</span>
											<span className="stat-value">{stats.total}</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">Classes Attended:</span>
											<span className="stat-value">
												{stats.present} ({stats.presentPercentage}%)
											</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">Excused Absences:</span>
											<span className="stat-value">
												{stats.excused} ({stats.excusedPercentage}%)
											</span>
										</div>
									</div>
									<div className="stats-column">
										<div className="stat-item">
											<span className="stat-label">Late Arrivals:</span>
											<span className="stat-value">
												{stats.late} ({stats.latePercentage}%)
											</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">Unexcused Absences:</span>
											<span className="stat-value">
												{stats.absent} ({stats.absentPercentage}%)
											</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">Overall Attendance:</span>
											<span className="stat-value">
												{(
													parseFloat(stats.presentPercentage) +
													parseFloat(stats.excusedPercentage)
												).toFixed(1)}
												%
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="summary-card">
								<h3>Attendance by Day of Week</h3>
								<div className="day-stats">
									{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
										(day, index) => {
											// Calculate day-specific stats
											const dayStats = attendanceData
												.filter((d) => d.dayOfWeek === index + 1)
												.reduce(
													(acc, d) => {
														d.classes.forEach((cls) => {
															acc.total++;
															if (cls.status === "P") acc.present++;
															else if (cls.status === "L") acc.late++;
															else if (cls.status === "A") acc.absent++;
															else if (cls.status === "E") acc.excused++;
														});
														return acc;
													},
													{
														present: 0,
														absent: 0,
														late: 0,
														excused: 0,
														total: 0,
													}
												);

											const attendanceRate = dayStats.total
												? (
														((dayStats.present + dayStats.excused) /
															dayStats.total) *
														100
												  ).toFixed(1)
												: "0.0";

											return (
												<div className="day-stat-item" key={index}>
													<div className="day-name">{day}</div>
													<div className="day-attendance-bar">
														<div
															className="day-progress"
															style={{
																width: `${attendanceRate}%`,
																backgroundColor:
																	parseFloat(attendanceRate) >= 90
																		? "var(--passing-color)"
																		: parseFloat(attendanceRate) >= 80
																		? "#FFC107"
																		: "var(--failing-color)",
															}}
														></div>
													</div>
													<div className="day-percentage">
														{attendanceRate}%
													</div>
												</div>
											);
										}
									)}
								</div>
							</div>
						</div>

						<div className="absence-details">
							<h3>Recent Absences & Tardies</h3>
							<table className="absences-table">
								<thead>
									<tr>
										<th>Date</th>
										<th>Period</th>
										<th>Class</th>
										<th>Status</th>
										<th>Teacher</th>
									</tr>
								</thead>
								<tbody>
									{attendanceData
										.flatMap((day) =>
											day.classes
												.filter(
													(cls) =>
														cls.status === "A" ||
														cls.status === "L" ||
														cls.status === "E"
												)
												.map((cls, i) => (
													<tr key={`${day.date}-${i}`}>
														<td>{formatDate(day.date)}</td>
														<td>Period {cls.period}</td>
														<td>{cls.subject}</td>
														<td>
															<span
																className={`status-pill ${getStatusClass(
																	cls.status
																)}`}
															>
																{getStatusLabel(cls.status)}
															</span>
														</td>
														<td>{cls.teacher}</td>
													</tr>
												))
										)
										.slice(0, 10)}{" "}
									{/* Show only most recent 10 */}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AttendancePage;
