import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyCNDVM0uKACIpzoESpB3m4gO-f2z7d2WLQ",
  authDomain: "dashboard-devs.firebaseapp.com",
  databaseURL: "https://dashboard-devs.firebaseio.com",
  projectId: "dashboard-devs",
  storageBucket: "dashboard-devs.appspot.com",
  messagingSenderId: "1016004297581"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
