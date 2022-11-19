import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";

function SignUp() {
	const navigate = useNavigate();
	const [notification, setNotification] = useState("");
	const [token, setToken] = useState("");
	const [error, setError] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const loginUser = (event: React.FormEvent) => {
		event.preventDefault();
		axios
			.post("http://localhost:3333/login", { username, password })
			.then((response) => {
				console.log(response.data.jwt);
				setToken(response.data.jwt);
				navigate("/home", {
					state: {
						token: response.data.jwt,
						user: response.data.user,
					},
				});
			})
			.catch((err) => {
				console.log(err);
				if (err.response.data.error) {
					setNotification(
						"Erro de validação. Usuário e/ou senha incorretos."
					);
					setError(true);
				}
			});
	};

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
				<form className="form_sign_up" onSubmit={loginUser}>
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
