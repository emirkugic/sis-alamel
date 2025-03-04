import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
	return (
		<div className="homepage">
			<div className="hero-section">
				<div className="hero-content">
					<h1>Welcome to Student Information Portal</h1>
					<p>
						Access your student's academic performance, attendance, and more
					</p>
					<div className="hero-buttons">
						<Link to="/dashboard" className="button primary-button">
							Go to Dashboard
						</Link>
						<button className="button secondary-button">Learn More</button>
					</div>
				</div>
			</div>

			<div className="features-section">
				<h2>What You Can Do</h2>
				<div className="features-grid">
					<div className="feature-card">
						<div className="feature-icon">📊</div>
						<h3>Track Academic Progress</h3>
						<p>
							View grades, assessments, and track progress throughout the
							semester
						</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">📅</div>
						<h3>View Attendance</h3>
						<p>
							Monitor attendance records and receive notifications about
							absences
						</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">✉️</div>
						<h3>Communicate</h3>
						<p>
							Message teachers and staff directly through our secure platform
						</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">📝</div>
						<h3>Upcoming Assignments</h3>
						<p>Stay informed about upcoming tests, projects, and homework</p>
					</div>
				</div>
			</div>

			<div className="quick-access-section">
				<h2>Quick Access</h2>
				<div className="quick-access-cards">
					<Link to="/grades" className="quick-card">
						<h3>Grades Overview</h3>
						<p>View current grades and assessments</p>
					</Link>
					<Link to="/calendar" className="quick-card">
						<h3>School Calendar</h3>
						<p>Important dates and events</p>
					</Link>
					<Link to="/attendance" className="quick-card">
						<h3>Attendance Records</h3>
						<p>View attendance history</p>
					</Link>
				</div>
			</div>

			<div className="announcements-section">
				<h2>Recent Announcements</h2>
				<div className="announcement-list">
					<div className="announcement-card">
						<div className="announcement-header">
							<h3>Spring Break Schedule</h3>
							<span className="announcement-date">March 1, 2025</span>
						</div>
						<p>
							Spring break will be from March 24-28. All classes will resume on
							March 31st.
						</p>
					</div>
					<div className="announcement-card">
						<div className="announcement-header">
							<h3>Parent-Teacher Conferences</h3>
							<span className="announcement-date">February 15, 2025</span>
						</div>
						<p>
							Parent-teacher conferences will be held on March 15-16. Sign up
							through the parent portal.
						</p>
					</div>
				</div>
			</div>

			<div className="help-section">
				<div className="help-content">
					<h2>Need Help?</h2>
					<p>
						Our support team is here to assist you with any questions or issues
						you may have.
					</p>
					<button className="button primary-button">Contact Support</button>
				</div>
				<div className="faq-preview">
					<h3>Frequently Asked Questions</h3>
					<div className="faq-item">
						<h4>How do I update my contact information?</h4>
						<p>
							You can update your contact information in your profile settings.
						</p>
					</div>
					<div className="faq-item">
						<h4>How can I see past semester records?</h4>
						<p>
							Go to the grades section and use the semester selector to view
							previous records.
						</p>
					</div>
					<Link to="/faq" className="text-link">
						See all FAQs
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Homepage;
