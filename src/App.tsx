import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<SignUp />} />
				<Route path="/login" element={<SignIn />} />
			</Routes>
		</Router>
	);
}

export default App;
