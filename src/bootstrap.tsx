import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { Backend } from "@staticbackend/js";

bkn = new Backend("6113e61abe103dba0d35b754", "dev");

ReactDOM.render(
	<App  />,
	document.getElementById("app")
)