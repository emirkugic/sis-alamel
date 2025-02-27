// craco.config.js
module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			webpackConfig.resolve.fallback = {
				...webpackConfig.resolve.fallback,
				http: require.resolve("stream-http"),
				https: require.resolve("https-browserify"),
				url: require.resolve("url/"),
			};
			return webpackConfig;
		},
	},
};
