import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
	return (
		<div className="not-found-container">
			<div className="not-found-content">
				<h1 className="error-code">404</h1>
				<div className="divider"></div>
				<div className="error-details">
					<h2>Page Not Found</h2>
					<p>The page you are looking for doesn't exist or has been moved.</p>

					<div className="suggestions">
						<h3>You might want to:</h3>
						<ul>
							<li>Check the URL for typing errors</li>
							<li>Return to the homepage</li>
							<li>Contact support if you believe this is an error</li>
						</ul>
					</div>

					{/* <div className="action-buttons">
						<Link to="/" className="primary-button">
							Go to Homepage
						</Link>
					</div> */}
				</div>
			</div>

			<div className="illustration">
				<svg
					width="200"
					height="200"
					viewBox="0 0 200 200"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="100" cy="100" r="80" fill="#E6F7FF" />
					<path
						d="M65 95C65 90.5817 68.5817 87 73 87H127C131.418 87 135 90.5817 135 95V140C135 144.418 131.418 148 127 148H73C68.5817 148 65 144.418 65 140V95Z"
						fill="#04ABFD"
					/>
					<path
						d="M60 70L90 87.5L120 70L150 87.5V60C150 55.5817 146.418 52 142 52H68C63.5817 52 60 55.5817 60 60V70Z"
						fill="#0388CA"
					/>
					<rect x="85" y="112" width="30" height="6" rx="3" fill="white" />
					<circle cx="80" cy="100" r="5" fill="white" />
					<circle cx="120" cy="100" r="5" fill="white" />
				</svg>
			</div>
		</div>
	);
};

export default NotFound;
