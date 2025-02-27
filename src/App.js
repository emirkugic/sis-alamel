import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
} from "react-router-dom";
import { LoginPage, Homepage } from "./pages";
import { Sidebar } from "./components";

const Layout = () => {
	return (
		<div className="app-layout">
			<Sidebar />
			<div className="content">
				<Outlet />
			</div>
		</div>
	);
};

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />

				<Route element={<Layout />}>
					<Route path="/" element={<Homepage />} />
					{/* <Route path="/grades" element={<GradesPage />} /> */}
				</Route>

				<Route path="*" element={<h1>404 - Not Found</h1>} />
			</Routes>
		</Router>
	);
}

export default App;
