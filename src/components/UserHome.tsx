import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface Account {
	id: number;
	balance: number;
}

interface User {
	id: number;
	username: string;
}

function UserHome() {
	const location = useLocation();
	const navigate = useNavigate();
	const [user, setUser] = useState<User>({ id: -1, username: "Loading..." });
	const [account, setAccount] = useState<Account>({ id: -1, balance: -1 });
	const [token, setToken] = useState("");

	useEffect(() => {
		console.log(location.state);
		if (location.state === null) {
			navigate("/login");
		} else {
			axios
				.get("http://localhost:3333/balance", {
					headers: { authorization: location.state.token },
				})
				.then((response) => {
					console.log(response);
					setUser(location.state.user);
					setAccount(response.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

	if (user.id !== -1)
		return (
			<div>
				<h1>Hello {user.username}!</h1>
				<h2>balanço: {account.balance}</h2>
			</div>
		);
	else
		return (
			<div>
				<h1>Carregando Dados...</h1>
			</div>
		);
}

export default UserHome;
