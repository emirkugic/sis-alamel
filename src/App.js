import React from "react";
import alamel_logo from "./alamel_logo.png";

function App() {
	const mainColor = "#04abfd";

	// Overall container styling with the main blue color.
	const containerStyle = {
		backgroundColor: mainColor,
		minHeight: "100vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: "20px",
		fontFamily: "'Roboto', sans-serif",
	};

	// Card style for the content with a white background and shadow.
	const cardStyle = {
		backgroundColor: "#fff",
		borderRadius: "10px",
		padding: "30px",
		maxWidth: "800px",
		width: "100%",
		boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
		textAlign: "center",
	};

	// Logo container ensures the logo stands out (since it's the same blue).
	const logoContainerStyle = {
		backgroundColor: "#fff",
		borderRadius: "50%",
		padding: "10px",
		display: "inline-block",
		marginBottom: "20px",
	};

	const logoStyle = {
		width: "120px",
		height: "120px",
	};

	// Heading and text styles for a modern look.
	const headingStyle = {
		fontSize: "2rem",
		marginBottom: "10px",
		color: "#333",
	};

	const subHeadingStyle = {
		fontSize: "1.2rem",
		marginBottom: "20px",
		color: "#555",
	};

	const textStyle = {
		fontSize: "1rem",
		lineHeight: "1.6",
		color: "#444",
		marginBottom: "20px",
	};

	const languageSectionStyle = {
		textAlign: "left",
		marginBottom: "20px",
	};

	return (
		<div style={containerStyle}>
			<div style={cardStyle}>
				<div style={logoContainerStyle}>
					<img src={alamel_logo} alt="Al Amel School Logo" style={logoStyle} />
				</div>
				<h1 style={headingStyle}>
					Welcome to the Student Information System of Al Amel School
				</h1>
				<div>
					<div style={languageSectionStyle}>
						<h3>English</h3>
						<p style={textStyle}>
							Dear Parents, due to current health issues affecting our
							development team, the page will be delayed until further notice.
							We sincerely apologize for the inconvenience and will keep you
							informed as soon as possible.
						</p>
					</div>
					<div style={languageSectionStyle}>
						<h3>Bosnian</h3>
						<p style={textStyle}>
							Dragi roditelji, zbog trenutnih zdravstvenih problema, stranica će
							biti odgođena do daljnjeg. Iskreno se izvinjavamo zbog neugodnosti
							i obavijestit ćemo vas čim bude moguće.
						</p>
					</div>
					<div style={languageSectionStyle}>
						<h3>Arabic</h3>
						<p style={textStyle} dir="rtl">
							أولياء الأمور الأعزاء، نظرًا للمشاكل الصحية الحالية التي تؤثر على
							فريق التطوير لدينا، سيتم تأخير الصفحة حتى إشعار آخر. نعتذر بصدق عن
							الإزعاج وسنبقيكم على اطلاع في أقرب وقت ممكن.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
