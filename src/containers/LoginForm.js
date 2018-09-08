import React, {Component} from 'react';
import * as api from '../api';
import {connect} from 'react-redux';
import {SET_USER} from "../reducers/actions";;

class LoginForm extends Component {
    constructor() {
        super();
        this.attemptLogin = this.attemptLogin.bind(this);
        this.state = {validation: {email: null, password: null}, genMsg: null}
    }

    attemptLogin(e) {
        e.preventDefault();
        api.attemptLogin(this.email.value, this.password.value).then((e) => {
            this.setState({validation: {email: null, password: null}});
            if(e.code === 422) {
                let valid = {};
                if(e.validation.email != null) valid.email = e.validation.email[0];
                if(e.validation.password != null) valid.password = e.validation.password[0];
                this.setState({validation: valid});
            } else if(e.code === 401) {
                this.setState({genMsg: "Invalid username or password."});
            } else if(e.code === 200) {
                api.setApiToken(e.token);
                api.getUser().then((ee) => {
                    this.props.dispatch({type: SET_USER, user: {token: e.token, user: ee.user}});
                    console.log(ee);
                });
            }
            console.log(e);
        });
    }

    render() {
        return (<div>
            <div className={"container mt-5"}>
                <div className={"row"}>
                    <div className={"col-md-4"}> </div>
                    <div className={"col-md-4"}>
                        <h1>Login Required</h1>
                        {this.state.genMsg ? <div className={"alert alert-info mt-3"}>{this.state.genMsg}</div> : ''}
                        <form onSubmit={this.attemptLogin}>
                            <div className={"form-group"}>
                                <label htmlFor={"email"}>Email Address</label>
                                <input className={"form-control" + (this.state.validation.email != null ? " is-invalid" : "")} type={"text"} id={"email"} ref={(e) => this.email = e} />
                                {this.state.validation.email != null ? <small className={"invalid-feedback"}>{this.state.validation.email}</small> : ""}
                            </div>
                            <div className={"form-group"}>
                                <label htmlFor={"password"}>Password</label>
                                <input className={"form-control" + (this.state.validation.password != null ? " is-invalid" : "")} type={"password"} id={"password"} ref={(e) => this.password = e} />
                                {this.state.validation.password != null ? <small className={"invalid-feedback"}>{this.state.validation.password}</small> : ""}
                            </div>
                            <div className={"d-flex justify-content-end"}>
                                <button className={"btn btn-primary"} onClick={this.attemptLogin}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
    }

}

export default connect()(LoginForm);