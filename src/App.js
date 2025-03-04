import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
	useLocation,
} from "react-router-dom";
import {
	LoginPage,
	Homepage,
	InformationPage,
	NotFound,
	AttendancePage,
} from "./pages";
import { Sidebar } from "./components";
import { ParentAuthProvider } from "./contexts/ParentAuthContext";
import RequireAuth from "./components/RequireAuth";
import "./App.css";

const AppContent = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === "/login";

	return (
		<div className="App">
			{!isLoginPage && <Sidebar />}
			<div className={`main-content ${isLoginPage ? "no-margins" : ""}`}>
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
					{/* Public route */}
					<Route path="/login" element={<LoginPage />} />

					<Route
						element={
							<RequireAuth>
								<AppContent />
							</RequireAuth>
						}
					>
						{/* <Route path="/" element={<Homepage />} /> */}
						<Route path="/student/:id" element={<InformationPage />} />
						<Route path="/attendance/:id" element={<AttendancePage />} />
					</Route>

					{/* 404 fallback */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</ParentAuthProvider>
	);
}

export default App;
