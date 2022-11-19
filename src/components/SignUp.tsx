import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css";

function SignUp() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const addUser = (event: React.FormEvent) => {
		event.preventDefault();

		axios
			.post("http://localhost:3333/users", { username, password })
			.then(() => {
				console.log("Usuário criado.");
			})
			.catch((e) => {
				console.log(e);
			});
	};

	return (
		<div className="main">
			<div className="signup">
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
				</form>
			</div>
		</div>
	);
}

export default SignUp;
