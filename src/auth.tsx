import React from "react";
import { Backend } from "@staticbackend/js";

interface IState {
	email: string;
	password: string;
}

interface IProps {
	onToken: (token: string, email: string) => void;
}

export class Auth extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			email: "",
			password: ""
		}
	}

	handleChanges = (field: string, e: TextEvent) => {
		let s = this.state;
		s[field] = e.target?.value;
		this.setState(s);
	}

	handleLogin = async () => {
		const { email, password } = this.state;
		const res = await bkn.login(email, password);
		if (!res.ok) {
			alert(res.content);
			return;
		}
		this.props.onToken(res.content, email);
	}

	handleRegister = async () => {
		const { email, password } = this.state;
		const res = await bkn.register(email, password);
		if (!res.ok) {
			alert(res.content);
			return;
		}
		this.props.onToken(res.content, email);
	}
	render() {
		return (
			<div>
				<h1>Login or register</h1>
				<p>
					<label>Your email</label>
					<br />
					<input
						type="email"
						onChange={this.handleChanges.bind(this, "email")}
						value={this.state.email}
					/>
				</p>
				<p>
					<label>Your password</label>
					<br />
					<input
						type="password"
						onChange={this.handleChanges.bind(this, "password")}
						value={this.state.password}
					/>
				</p>
				<p>
					<button onClick={this.handleLogin}>Login</button>
					&nbsp;&nbsp;&nbsp;
					<button onClick={this.handleRegister}>Register</button>
				</p>
			</div>
		)
	}
}