import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useParentAuthContext } from "../contexts/ParentAuthContext";

const RequireAuth = ({ children }) => {
	const { token } = useParentAuthContext();
	const location = useLocation();

	if (!token) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

export default RequireAuth;
