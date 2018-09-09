import React, { Component } from 'react';
// eslint-disable-next-line
import $ from 'jquery';
// eslint-disable-next-line
import popper from 'popper.js';
// eslint-disable-next-line
import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {connect} from 'react-redux';
import LoginForm from './containers/LoginForm'
import * as api from './api';
import spinner from './loadingicons/Gear-1s-200px.gif';
import {SET_USER} from "./reducers/actions";
import Dashboard from "./containers/Dashboard";
import {withRouter} from 'react-router-dom';

class App extends Component {

    constructor() {
        super();
        this.state = {serverProbed: false};
    }

    componentDidMount() {
        api.probeServer().then((e) => {
            console.log("Server probed. Running Lumen version: " + e.lumen);
            let ptoken = api.findToken();
            if(ptoken == null) {
                console.log("No potential token from a previous session.");
                this.setState({serverProbed: true});
            }
            else {
                console.log("Found a potential token. Attempting.");
                api.setApiToken(ptoken);
                api.getUser().then((e) => {
                    if(e.code !== 200) {
                        console.log("Attempt failed. Falling back to login.");
                        api.setApiToken(null);
                        window.localStorage.removeItem("token");
                        this.setState({ serverProbed: true });
                    }
                    else {
                        console.log("Attempt success. User: ", e.user);
                        this.props.dispatch({type: SET_USER, user: {token: ptoken, user: e.user}});
                        this.setState({serverProbed: true});
                    }
                });
            }
        });
    }

    render() {
        if(!this.state.serverProbed) {
            return (
                <div>
                    <div className="d-flex justify-content-center">
                        <img src={spinner} width={"50px"} height={"50px"} alt={"Probing server..."} />
                    </div>
                    <div className="d-flex justify-content-center">
                        Probing server.. Please wait...
                    </div>
                </div>
            )
        }
        return (
            <div>
                { this.props.user == null ? <LoginForm /> : <Dashboard />}
            </div>
        );
    }
}

const mstp = state => {
    return {
        user: state.user
    }
};

export default withRouter(connect(mstp)(App));
