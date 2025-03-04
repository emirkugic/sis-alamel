import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuthContext } from "../../contexts/ParentAuthContext";
import parentApi from "../../api/parentApi";

const TempHP = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { token, parentId } = useParentAuthContext();

	useEffect(() => {
		const redirectToChildPage = async () => {
			try {
				if (!token || !parentId) {
					setLoading(false);
					return;
				}

				// Fetch the parent's children
				const children = await parentApi.getChildrenByParentId(parentId, token);

				// If there are children, redirect to the first child's grades page
				if (children && children.length > 0) {
					navigate(`/student/${children[0].id}`);
				} else {
					// If no children, just stop loading
					setLoading(false);
				}
			} catch (error) {
				console.error("Error fetching children:", error);
				setLoading(false);
			}
		};

		redirectToChildPage();
	}, [token, parentId, navigate]);

	// Display a simple loading message while the redirection is happening
	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						width: "50px",
						height: "50px",
						border: "5px solid #e6f7ff",
						borderTop: "5px solid #04abfd",
						borderRadius: "50%",
						animation: "spin 1s linear infinite",
						marginBottom: "20px",
					}}
				/>
				<p>Loading your dashboard...</p>
				<style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
			</div>
		);
	}

	// Only shown if there's no redirection (e.g., no children or error)
	return (
		<div style={{ padding: "20px", textAlign: "center" }}>
			<h1>Welcome to the Parent Portal</h1>
			<p>Please use the sidebar menu to navigate</p>
		</div>
	);
};

export default TempHP;
