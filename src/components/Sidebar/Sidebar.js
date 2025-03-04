import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
	faBars,
	faTimes,
	faSignOutAlt,
	faHouse,
	faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarButton from "../ui/SidebarButton/SidebarButton";
import "./Sidebar.css";
import { useParentAuthContext } from "../../contexts/ParentAuthContext";
import parentApi from "../../api/parentApi";

const DesktopSidebar = () => {
	const location = useLocation();
	const { token, parentId, logoutParent } = useParentAuthContext();

	const [activeItem, setActiveItem] = useState("");
	const [myChildren, setMyChildren] = useState([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const fetchChildren = async () => {
			if (!parentId || !token) return;
			try {
				const children = await parentApi.getChildrenByParentId(parentId, token);
				const childLinks = children.map((child) => ({
					title: `${child.firstName} ${child.lastName}`,
					path: `/student/${child.id}`,
				}));
				setMyChildren(childLinks);
			} catch (err) {
				console.error("Error fetching children:", err);
			}
		};
		fetchChildren();
	}, [parentId, token]);

	// Build the menu items
	const menuItems = useMemo(() => {
		const items = [];
		if (isMobile) {
			items.push({
				title: "Dashboard",
				icon: faHouse,
				route: "/",
			});
		}
		items.push({
			title: "Grades",
			icon: faPeopleGroup,
			route: myChildren,
		});
		return items;
	}, [isMobile, myChildren]);

	// Track which item is active
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
		// If route is an array, do nothing special unless you have a single sub-route
	};

	const handleLogout = () => {
		logoutParent();
		window.location.href = "/login";
	};

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
