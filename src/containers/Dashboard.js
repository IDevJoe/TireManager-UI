import React, {Component} from 'react';
import {NavLink, Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {SET_USER} from "../reducers/actions";
import * as api from '../api';
import SearchTire from "./pages/SearchTire";
import ArchivedSearch from "./pages/ArchivedSearch";
import NewTire from "./pages/NewTire";
import CutTemplates from "./pages/CutTemplates";

class Dashboard extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }
    logout(e) {
        e.preventDefault();
        api.setApiToken(null);
        this.props.dispatch({type: SET_USER, user: null});
    }
    render() {
        return <div className={"mt-5 container mb-5"}>
            <h1>TireManager Dashboard</h1>
            <div className={"row mt-5"}>
                <div className={"col-md-3"}>
                    <ul className={"nav nav-pills flex-column"}>
                        <li className={"nav-item"}>
                            <NavLink className={"nav-link"} to={"/"} exact>Search Tire</NavLink>
                        </li>
                        {!api.isOffline() ? <li className={"nav-item"}>
                            <NavLink className={"nav-link"} to={"/tire/archives"}>Search Tire Archives</NavLink>
                        </li> : '' }
                        <li className={"nav-item"}>
                            <NavLink className={"nav-link"} to={"/tire/new"}>New Tire</NavLink>
                        </li>
                    </ul>
                    {!api.isOffline() ? <div><hr />
                    <ul className={"nav nav-pills flex-column"}>
                        <li className={"nav-item"}>
                            <NavLink className={"nav-link"} to={"/cuts/templates"}>Cut Templates</NavLink>
                        </li>
                    </ul></div> : ''}
                    <hr />
                    <small>
                        Logged in as {this.props.user.user.name}.
                        <br />Not you? <a href={"#logout-button"} onClick={this.logout}>Logout</a>
                    </small>
                </div>
                <div className={"col-md-9"}>
                    <Route path={"/"} exact component={SearchTire} />
                    <Route path={"/tire/archives"} exact component={ArchivedSearch} />
                    <Route path={"/tire/new"} exact component={NewTire} />
                    <Route path={"/cuts/templates"} exact component={CutTemplates} />
                </div>
            </div>
        </div>;
    }
}

const mstp = state => {
    return {
        user: state.user
    }
};

export default withRouter(connect(mstp)(Dashboard));