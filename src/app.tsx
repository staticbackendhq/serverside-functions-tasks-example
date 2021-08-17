import React, { ChangeEventHandler } from "react";
import { Auth } from "./auth";
import { Chat } from "./chat";
import { Backend, Payload } from "@staticbackend/js";

interface IState {
	token: string | null;
	username: string;
	messages: Array<IMessage>;
	msg: string;
}

interface IMessage {
	from: string;
	body: string;
}

export class App extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			token: null,
			username: "",
			messages: [],
			msg: ""
		}
	}

	onToken = (token: string, email: string) => {
		this.setState({ token: token, username: email });

		(bkn as Backend).connect(token,
			(tok: string) => {
				console.log("socket connected");

				bkn.send(bkn.types.join, "lobby");
			},
			(pl: Payload) => {
				switch (pl.type) {
					case bkn.types.ok:
						if (pl.data == "lobby") {
							(async () => {
								// get all messages from the channel
								console.log("loading previous message");
								const res = await bkn.list(token, "msgs_774_");
								if (!res.ok) {
									alert("error listing messages from db: \n" + res.content);
									return;
								}

								let { messages } = this.state;;
								res.content.results?.forEach((m) => messages.push(m));
								this.setState({ messages: messages });
							})();
						}
						break;
					case bkn.types.joined:
						let { messages } = this.state;;
						messages.push({
							from: "system",
							body: `${pl.data} joins the channel`
						});
						this.setState({ messages: messages });
						break;
					case bkn.types.chanOut:
						try {
							const msg = JSON.parse(pl.data);
							let { messages } = this.state;
							messages.push(msg);
							this.setState({ messages: messages });
						} catch (ex) {
							console.error(pl);
							alert(ex);
							return;
						}
				};
			}
		);
	}

	handleMsg = (e: any) => {
		this.setState({ msg: e.target.value });
	}

	handleSubmit = (e: any) => {
		if (e.charCode == 13) {
			e.preventDefault();

			const msg: IMessage = {
				from: this.state.username,
				body: this.state.msg
			}
			bkn.send(bkn.types.chanIn, JSON.stringify(msg), "lobby");

			this.setState({ msg: "" });
		}
	}

	renderMsg = (msg: IMessage, index: number) => {
		if (!msg) {
			return null;
		}
		
		return (
			<p key={index}>
				<strong>{msg.from}</strong>:
				&nbsp;&nbsp;
				{msg.body}
			</p>
		)
	}

	render() {
		if (!this.state.token) {
			return (
				<Auth onToken={this.onToken} />
			);
		}

		const msgs = this.state.messages?.map(this.renderMsg);

		return (
			<div>
				<h1>Sample chat: {this.state.username}</h1>
				<div id="messages">{msgs}</div>
				<p>
					<input
						type="text"
						placeholder="enter a new message"
						onChange={this.handleMsg}
						onKeyPress={this.handleSubmit}
						value={this.state.msg}
					/>
				</p>
			</div>
		)
	}
}