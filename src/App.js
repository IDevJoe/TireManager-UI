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

class App extends Component {

    constructor() {
        super();
        this.state = {serverProbed: false};
    }

    componentDidMount() {
        api.probeServer().then((e) => {
            console.log("Server probed. Running Lumen version: " + e.lumen);
            this.setState({ serverProbed: true });
        });
    }

    render() {
        if(!this.state.serverProbed) {
            return (
                <div>
                    <div className="d-flex justify-content-center">
                        <img src={spinner} width={"50px"} height={"50px"} alt={"Probing server..."} />
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
                { this.props.user == null ? <LoginForm /> : ''}
            </div>
        );
    }
}

const mstp = state => {
    return {
        user: state.user
    }
};

export default connect(mstp)(App);
