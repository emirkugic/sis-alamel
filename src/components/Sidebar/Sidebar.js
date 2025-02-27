import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
	faBars,
	faTimes,
	faChartLine,
	faSignOutAlt,
	faHouse,
	faPeopleGroup,
	faBookOpen,
	faCalendarAlt,
	faBook,
	faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarButton from "../ui/SidebarButton/SidebarButton";
import "./Sidebar.css";

const DesktopSidebar = () => {
	const location = useLocation();
	const [activeItem, setActiveItem] = useState("");
	const [myCourses, setMyCourses] = useState([]);
	const [myDepartments, setMyDepartments] = useState([]);
	const [loadingCourses, setLoadingCourses] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Build menu items conditionally
	const menuItems = useMemo(() => {
		const items = [];
		// Only include the Dashboard button if we're in mobile view.
		if (isMobile) {
			items.push({
				title: "Dashboard",
				icon: faHouse,
				route: "/",
			});
		}
		// Common items
		items.push(
			{
				title: "Grades",
				icon: faBook,
				route: myCourses,
			},
			{
				title: "Lectures",
				icon: faBookOpen,
				route: myDepartments,
			},
			{
				title: "Weekly Report",
				icon: faChartLine,
				route: "/logs",
			}
		);

		// Additional admin-only items

		return items;
	}, [isMobile]);

	useEffect(() => {
		const activeMenuItem = menuItems.find((item) =>
			Array.isArray(item.route)
				? item.route.some((sub) => sub.path === location.pathname)
				: item.route === location.pathname
		);

		if (activeMenuItem) {
			setActiveItem(activeMenuItem.title);
		}
	}, [location.pathname, menuItems]);

	const handleButtonClick = (title, route) => {
		setActiveItem(title);
		if (window.innerWidth <= 768) {
			setIsSidebarOpen(false);
		}
	};

	const handleLogout = () => {};

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	return (
		<>
			<div className="topbar">
				<FontAwesomeIcon
					icon={isSidebarOpen ? faTimes : faBars}
					className="hamburger-icon"
					onClick={toggleSidebar}
				/>
				<span className="topbar-title">Dashboard</span>
			</div>
			<div className={`desktop-sidebar ${isSidebarOpen ? "open" : ""}`}>
				<div className="sidebar-menu">
					{menuItems.map((item) => (
						<SidebarButton
							key={item.title}
							title={item.title}
							icon={item.icon}
							route={item.route}
							isActive={activeItem === item.title}
							onClick={() => handleButtonClick(item.title, item.route)}
						/>
					))}
				</div>
				<div className="logout-container">
					<SidebarButton
						title="Logout"
						icon={faSignOutAlt}
						route="/login"
						isActive={false}
						onClick={handleLogout}
					/>
				</div>
			</div>
		</>
	);
};

export default DesktopSidebar;
