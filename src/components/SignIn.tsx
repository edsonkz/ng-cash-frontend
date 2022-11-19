import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css";

function SignUp() {
	const [notification, setNotification] = useState("");
	const [error, setError] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="main">
			<div className="signup">
				{!notification.length ? (
					<></>
				) : !error ? (
					<h5 className="success">{notification}</h5>
				) : (
					<h5 className="error">{notification}</h5>
				)}
				<h2>Entrar</h2>
				<form className="form_sign_up">
					<input
						type="text"
						className="username_input"
						placeholder="Nome de Usuário"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					></input>
					<input
						type="password"
						className="password_input"
						placeholder="Senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					></input>

					<button>Entrar</button>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
