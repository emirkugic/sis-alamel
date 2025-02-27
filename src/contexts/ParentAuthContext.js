import React, { createContext, useContext } from "react";
import useParentAuth from "../hooks/useParentAuth";

export const ParentAuthContext = createContext();

export const ParentAuthProvider = ({ children }) => {
	const auth = useParentAuth();
	return (
		<ParentAuthContext.Provider value={auth}>
			{children}
		</ParentAuthContext.Provider>
	);
};

// Custom hook for easier context access
export const useParentAuthContext = () => useContext(ParentAuthContext);
