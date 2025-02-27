import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
} from "react-router-dom";
import { LoginPage, Homepage } from "./pages";
import { Sidebar } from "./components";
import { ParentAuthProvider } from "./contexts/ParentAuthContext";
import RequireAuth from "./components/RequireAuth";

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
		<ParentAuthProvider>
			<Router>
				<Routes>
					{/* Public route for login */}
					<Route path="/login" element={<LoginPage />} />

					{/* All other routes are protected */}
					<Route
						element={
							<RequireAuth>
								<Layout />
							</RequireAuth>
						}
					>
						<Route path="/" element={<Homepage />} />
					</Route>

					{/* Fallback 404 */}
					<Route path="*" element={<h1>404 - Not Found</h1>} />
				</Routes>
			</Router>
		</ParentAuthProvider>
	);
}

export default App;
