import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

interface Account {
	id: number;
	balance: number;
}

interface User {
	id: number;
	username: string;
}

interface Transaction {
	id: number;
	created_at: string;
	value: number;
}

function UserHome() {
	const location = useLocation();
	const navigate = useNavigate();
	const [notification, setNotification] = useState("");
	const [error, setError] = useState(false);
	const [user, setUser] = useState<User>({ id: -1, username: "Loading..." });
	const [account, setAccount] = useState<Account>({ id: -1, balance: -1 });
	const [username, setUsername] = useState("");
	const [valueToTransfer, setValueToTransfer] = useState(0);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

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

			axios
				.get("http://localhost:3333/transactions", {
					headers: { authorization: location.state.token },
				})
				.then((response) => {
					console.log(response);

					setTransactions(response.data);
				})
				.catch((err) => {
					console.log(err);
				});

			transactions.map((transaction) =>
				console.log("Hello", transaction)
			);
		}
	}, []);

	const logout = () => {
		location.state = null;
		console.log(location);
		navigate("/login");
	};

	const createTransaction = (event: React.FormEvent) => {
		event.preventDefault();
		if (valueToTransfer === 0) {
			console.log(
				"As transferências precisam ser maiores que 0 para serem válidas."
			);
			setNotification(
				"As transferências precisam ser maiores que 0 para serem válidas."
			);
			setError(true);
		} else if (username === user.username) {
			console.log(
				"O usuário não pode fazer uma transferência para si mesmo."
			);
			setNotification(
				"O usuário não pode fazer uma transferência para si mesmo."
			);
			setError(true);
		} else if (account.balance < valueToTransfer) {
			console.log(
				"O usuário não pode fazer uma transferência maior que o seu próprio balanço."
			);
			setNotification(
				"O usuário não pode fazer uma transferência maior que o seu próprio balanço."
			);
			setError(true);
		} else {
			axios
				.post(
					"http://localhost:3333/transactions",
					{ username, balance: valueToTransfer },
					{
						headers: { authorization: location.state.token },
					}
				)
				.then((response) => {
					console.log(response.data.savedTransaction);
					let newbalance = { ...account };
					newbalance.balance = account.balance - valueToTransfer;
					setNotification("Transação realizada com sucesso.");
					setAccount(newbalance);
					setTransactions(
						transactions.concat(response.data.savedTransaction)
					);
					setError(false);
				})
				.catch((err) => {
					console.log("Esse usuário não existe.");
					console.log(err);
				});
		}
	};

	if (user.id !== -1)
		return (
			<div className="home">
				<div className="container">
					{!notification.length ? (
						<></>
					) : !error ? (
						<h5 className="success">{notification}</h5>
					) : (
						<h5 className="error">{notification}</h5>
					)}
					<h1 className="title">Olá {user.username}!</h1>
					<h2 className="title2">Balanço Atual: {account.balance}</h2>

					<fieldset className="make_transaction">
						<legend>Realizar Transferência</legend>
						<form onSubmit={createTransaction}>
							<label htmlFor="username">Nome de usuário</label>
							<input
								className="username"
								type="text"
								placeholder="Nome do usuário"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<label htmlFor="balance">
								Valor a ser transferido
							</label>
							<input
								className="balance"
								type="text"
								placeholder="Valor da transação"
								value={valueToTransfer}
								onChange={(e) =>
									setValueToTransfer(parseInt(e.target.value))
								}
							/>
							<button>Realizar Transação</button>
						</form>
					</fieldset>
				</div>
				<div className="container_transactions">
					<h1 className="title">Transferências Realizadas</h1>
					{transactions.length === 0 ? (
						<h1>Nenhuma transação realizada...</h1>
					) : (
						<table>
							<tr>
								<th>Valor transferido</th>
								<th>Criado em</th>
							</tr>
							{transactions.map((transaction) => (
								<tr key={transaction.id}>
									<th>{transaction.value}</th>
									<th>{transaction.created_at}</th>
								</tr>
							))}
						</table>
					)}
					<button onClick={logout}>Sair</button>
				</div>
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
