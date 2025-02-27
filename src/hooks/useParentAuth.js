import { useState } from "react";
import authApi from "../api/authApi";

const useParentAuth = () => {
	const [parent, setParent] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const loginParent = async (email, loginPassword) => {
		try {
			setLoading(true);
			const data = await authApi.parentLogin(email, loginPassword);
			// Assuming the response returns a "token" field
			setToken(data.token);
			setParent({ token: data.token });
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
	};

	return { parent, token, loginParent, logoutParent, loading, error };
};

export default useParentAuth;
