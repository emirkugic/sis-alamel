import { useState } from "react";
import authApi from "../api/authApi";

const useParentAuth = () => {
	// Initialize token from localStorage (if exists)
	const [token, setToken] = useState(
		() => localStorage.getItem("parentToken") || null
	);
	const [parent, setParent] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const loginParent = async (email, loginPassword) => {
		try {
			setLoading(true);
			const data = await authApi.parentLogin(email, loginPassword);
			setToken(data.token);
			setParent({ token: data.token });
			localStorage.setItem("parentToken", data.token);
			return data;
		} catch (err) {
			setError(err);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logoutParent = () => {
		setParent(null);
		setToken(null);
		setError(null);
		localStorage.removeItem("parentToken");
	};

	return { parent, token, loginParent, logoutParent, loading, error };
};

export default useParentAuth;
