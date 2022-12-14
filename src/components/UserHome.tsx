import React, { useState, useEffect, DataHTMLAttributes } from "react";
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
	transactions_id?: number;
	transactions_created_at?: string;
	transactions_value?: number;
	u_username?: string;
	type: string;
}

function UserHome() {
	const location = useLocation();
	const navigate = useNavigate();
	const [notification, setNotification] = useState("");
	const [error, setError] = useState(false);
	const [user, setUser] = useState<User>({ id: -1, username: "Loading..." });
	const [account, setAccount] = useState<Account>({ id: -1, balance: -1 });
	const [username, setUsername] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [valueToTransfer, setValueToTransfer] = useState("");
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [transactionsFiltered, setTransactionsFiltered] = useState<
		Transaction[]
	>([]);

	useEffect(() => {
		console.log(location.state);
		if (location.state === null) {
			navigate("/login");
		} else {
			axios
				.get("/api/balance", {
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
				.get("/api/transactions", {
					headers: { authorization: location.state.token },
				})
				.then((response) => {
					console.log(response);

					setTransactions(response.data);
					setTransactionsFiltered(response.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

	const reloadTransactions = () => {
		axios
			.get("/api/transactions", {
				headers: { authorization: location.state.token },
			})
			.then((response) => {
				console.log(response);

				setTransactions(response.data);
				setTransactionsFiltered(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const filterCashIn = () => {
		const filtered = transactions.filter(
			(transaction) => transaction.type === "cashIn"
		);
		setTransactionsFiltered(filtered);
	};

	const filterDate = () => {
		console.log("Data", dateFilter);
		console.log(
			"Data2",
			transactions[0].transactions_created_at?.split("T")[0]
		);
		const filtered = transactions.filter(
			(transaction) =>
				transaction.transactions_created_at?.split("T")[0] ===
				dateFilter
		);
		setTransactionsFiltered(filtered);
	};

	const filterCashOut = () => {
		const filtered = transactions.filter(
			(transaction) => transaction.type === "cashOut"
		);
		setTransactionsFiltered(filtered);
	};

	const logout = () => {
		location.state = null;
		console.log(location);
		navigate("/login");
	};

	const createTransaction = (event: React.FormEvent) => {
		event.preventDefault();
		if (parseInt(valueToTransfer) === 0 || valueToTransfer.length < 1) {
			console.log(
				"As transfer??ncias precisam ser maiores que 0 para serem v??lidas."
			);
			setNotification(
				"As transfer??ncias precisam ser maiores que 0 para serem v??lidas."
			);
			setError(true);
		} else if (username === user.username) {
			console.log(
				"O usu??rio n??o pode fazer uma transfer??ncia para si mesmo."
			);
			setNotification(
				"O usu??rio n??o pode fazer uma transfer??ncia para si mesmo."
			);
			setError(true);
		} else if (account.balance < parseInt(valueToTransfer)) {
			console.log(
				"O usu??rio n??o pode fazer uma transfer??ncia maior que o seu pr??prio balan??o."
			);
			setNotification(
				"O usu??rio n??o pode fazer uma transfer??ncia maior que o seu pr??prio balan??o."
			);
			setError(true);
		} else {
			axios
				.post(
					"/api/transactions",
					{ username, balance: valueToTransfer },
					{
						headers: { authorization: location.state.token },
					}
				)
				.then((response) => {
					console.log(response.data.savedTransaction);
					let newbalance = { ...account };
					newbalance.balance =
						account.balance - parseInt(valueToTransfer);
					setNotification("Transa????o realizada com sucesso.");
					setAccount(newbalance);
					console.log(response.data.savedTransaction);
					setTransactions(
						transactions.concat(response.data.savedTransaction)
					);
					setTransactionsFiltered(
						transactions.concat(response.data.savedTransaction)
					);
					setError(false);
				})
				.catch((err) => {
					console.log("Esse usu??rio n??o existe.");
					setError(true);
					setNotification(
						"Esse usu??rio n??o existe ou o valor do balan??o n??o ?? um n??mero."
					);
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
					<h1 className="title">Ol?? {user.username}!</h1>
					<h2 className="title2">Balan??o Atual: {account.balance}</h2>

					<fieldset className="make_transaction">
						<legend>Realizar Transfer??ncia</legend>
						<form onSubmit={createTransaction}>
							<label htmlFor="username">Nome de usu??rio</label>
							<input
								className="username"
								type="text"
								placeholder="Nome do usu??rio"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<label htmlFor="balance">
								Valor a ser transferido
							</label>
							<input
								className="balance"
								type="text"
								placeholder="Valor da transa????o"
								value={valueToTransfer}
								onChange={(e) =>
									setValueToTransfer(e.target.value)
								}
							/>
							<button>Realizar Transa????o</button>
						</form>
					</fieldset>
				</div>
				<div className="container_transactions">
					<h1 className="title">Transfer??ncias Realizadas</h1>
					<div className="filterButtons">
						<button className="filterB" onClick={filterCashIn}>
							cashIn
						</button>
						<button className="filterB" onClick={filterCashOut}>
							cashOut
						</button>
						<button
							className="filterB"
							onClick={reloadTransactions}
						>
							Todos
						</button>
						<input
							type="date"
							className="filterDate"
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
						/>
						<button className="filterB" onClick={filterDate}>
							Filtrar Data
						</button>
					</div>
					{transactionsFiltered.length === 0 ? (
						<h1>Nenhuma transa????o realizada...</h1>
					) : (
						<div>
							<table>
								<tbody>
									<tr>
										<th>Usu??rio participante</th>
										<th>Tipo de Opera????o</th>
										<th>Valor transferido</th>
										<th>Data</th>
									</tr>
									{transactionsFiltered.map((transaction) => (
										<tr key={transaction.transactions_id}>
											<th>{transaction.u_username}</th>
											<th>{transaction.type}</th>
											<th>
												{transaction.transactions_value}
											</th>
											<th>
												{
													transaction.transactions_created_at
												}
											</th>
										</tr>
									))}
								</tbody>
							</table>
						</div>
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
