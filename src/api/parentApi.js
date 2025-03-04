import baseApi from "./baseApi";

const parentApi = {
	getChildrenByParentId: async (parentId, token) => {
		const response = await baseApi.get(`Parent/${parentId}/children`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	},
};

export default parentApi;
