import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LoginPage } from "./pages";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />

				<Route path="*" element={<h1>404 - Not Found</h1>} />
			</Routes>
		</Router>
	);
}

export default App;
