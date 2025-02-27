import React, { useState, useContext } from "react";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../../../components/ui/TextInput/TextInput";
import PrimaryButton from "../../../../components/ui/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../../components/ui/SecondaryButton/SecondaryButton";
import "./LoginForm.css";

import { logo } from "../../../../assets/";

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [keepLoggedIn, setKeepLoggedIn] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (e) => {
		console.log("Login button clicked");
		window.location.href = "/students";
	};

	const handleCancel = () => {
		setEmail("");
		setPassword("");
		setKeepLoggedIn(false);
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
				{/* <div className="checkbox-container">
					<input
						type="checkbox"
						id="keep-logged-in"
						checked={keepLoggedIn}
						onChange={(e) => setKeepLoggedIn(e.target.checked)}
					/>
					<label htmlFor="keep-logged-in">Keep me logged in</label>
				</div> */}
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
