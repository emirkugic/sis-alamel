import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import authApi from "../api/authApi";

const useParentAuth = () => {
	const [token, setToken] = useState(
		() => localStorage.getItem("parentToken") || null
	);
	const [parent, setParent] = useState(null);
	const [parentId, setParentId] = useState(
		() => localStorage.getItem("parentId") || null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const loginParent = async (email, loginPassword) => {
		try {
			setLoading(true);
			const data = await authApi.parentLogin(email, loginPassword);

			setToken(data.token);
			localStorage.setItem("parentToken", data.token);

			const decoded = jwtDecode(data.token);
			const userId = decoded.unique_name;
			setParentId(userId);
			localStorage.setItem("parentId", userId);

			setParent({ token: data.token, id: userId });

			// Return auth data for immediate use after login
			return {
				token: data.token,
				parentId: userId,
			};
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
		setParentId(null);
		setError(null);
		localStorage.removeItem("parentToken");
		localStorage.removeItem("parentId");
	};

	return { parent, token, parentId, loginParent, logoutParent, loading, error };
};

export default useParentAuth;
