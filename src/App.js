import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    error: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: "Waiting on transaction success..." });

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });

      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      this.setState({ message: "You have been entered!", players, balance });
    } catch (error) {
      this.setState({ error: error.message, message: "" });
    }
  };

  onClick = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: "Waiting on transaction success..." });

      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });

      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      this.setState({ message: "A winner has been picked!", players, balance });
    } catch (error) {
      this.setState({ error: error.message, message: "" });
    }
  };

  onChange = event => {
    this.setState({ value: event.target.value, error: "", message: "" });
  };

  render() {
    return (
      <div>
        <h2>Lottery</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              placeholder="       > than 0.1 ethereum"
              value={this.state.value}
              onChange={this.onChange}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
        <h1>{this.state.error}</h1>
      </div>
    );
  }
}

export default App;
