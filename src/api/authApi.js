import baseApi from "./baseApi";

const authApi = {
	parentLogin: async (email, loginPassword) => {
		const response = await baseApi.post("Auth/parent/login", {
			email,
			loginPassword,
		});
		return response.data;
	},
};

export default authApi;
