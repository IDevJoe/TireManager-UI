import React, {Component} from 'react';

class LoginForm extends Component {
    constructor() {
        super();
        this.attemptLogin = this.attemptLogin.bind(this);
    }

    attemptLogin() {

    }

    render() {
        return (<div>
            <div className={"container mt-5"}>
                <div className={"row"}>
                    <div className={"col-md-4"}> </div>
                    <div className={"col-md-4"}>
                        <h1>Login Required</h1>
                        <div className={"form-group"}>
                            <label htmlFor={"email"}>Email Address</label>
                            <input className={"form-control"} type={"text"} id={"email"} ref={(e) => this.email = e} />
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor={"password"}>Password</label>
                            <input className={"form-control"} type={"password"} id={"password"} ref={(e) => this.password = e} />
                        </div>
                        <div className={"d-flex justify-content-end"}>
                            <button className={"btn btn-primary"} onClick={this.attemptLogin}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }

}

export default LoginForm;