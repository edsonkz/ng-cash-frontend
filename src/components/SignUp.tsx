import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";

function SignUp() {
	const navigate = useNavigate();
	const [notification, setNotification] = useState("");
	const [error, setError] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const addUser = (event: React.FormEvent) => {
		event.preventDefault();

		axios
			.post("/api/users", { username, password })
			.then(() => {
				console.log("Usuário criado.");
				setUsername("");
				setPassword("");
				setNotification("Usuário criado com sucesso.");
				setError(false);

				setTimeout(() => {
					navigate("/login");
				}, 2000);
			})
			.catch((e) => {
				console.log(e.response.data);
				if (e.response.data.error) {
					setNotification(
						"Erro de validação. A senha precisa ter no mínimo 8 caracteres, 1 caractere numérico e 1 caractere em letra maiúscula."
					);
					setError(true);
				}
				if (e.response.data.erroCode === "23505")
					setNotification(
						"Nome de usuário já existente, tente outro."
					);
				setError(true);
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
				<h2>Crie seu usuário</h2>
				<form className="form_sign_up" onSubmit={addUser}>
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

					<button>Criar</button>
					<Link
						to="/login"
						style={{
							color: "white",
							textAlign: "center",
							justifyContent: "center",
							display: "flex",
						}}
					>
						Clique aqui para fazer o login
					</Link>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
