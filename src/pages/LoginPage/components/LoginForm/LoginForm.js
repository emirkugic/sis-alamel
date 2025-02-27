import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../../../components/ui/TextInput/TextInput";
import PrimaryButton from "../../../../components/ui/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../../components/ui/SecondaryButton/SecondaryButton";
import "./LoginForm.css";

import { logo } from "../../../../assets/";
import { useParentAuthContext } from "../../../../contexts/ParentAuthContext";

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const { loginParent } = useParentAuthContext();

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage("");
		try {
			await loginParent(email, password);
			navigate("/students");
		} catch (err) {
			console.error("Login failed:", err);
			setErrorMessage(
				"Login failed. Please check your credentials and try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setEmail("");
		setPassword("");
		setErrorMessage("");
	};

	return (
		<div className="login-container">
			{isLoading && <div className="loading-bar"></div>}
			<img src={logo} alt="Logo" className="logo" />
			{errorMessage && <p className="notification">{errorMessage}</p>}
			<form className="login-form" onSubmit={handleLogin}>
				<TextInput
					label="Email"
					icon={faUser}
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
				/>
				<TextInput
					label="Password"
					icon={faLock}
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
				/>
				<div className="button-group">
					<PrimaryButton title="Login" disabled={isLoading} />
					<SecondaryButton
						title="Cancel"
						onClick={handleCancel}
						disabled={isLoading}
					/>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
