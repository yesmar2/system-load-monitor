import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { connect } from "react-redux";
import { reducer } from "./reducer";
import App from "./App";
import initSocket from "./initSocket";
import "./index.css";

const store = createStore(reducer);

// Init socket connection to redux store
const socket = initSocket(store.dispatch);

const Container = connect(s => ({ model: s, socket }))(App);

// Render react app
ReactDOM.render(<Container store={store} />, document.getElementById("root"));
