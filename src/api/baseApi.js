import axios from "axios";

const baseApi = axios.create({
	baseURL: "https://al-amel-api.onrender.com/api/",
	headers: {
		"Content-Type": "application/json",
	},
});

export default baseApi;
