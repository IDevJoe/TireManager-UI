import * as A from './actions';
import {combineReducers} from 'redux';

function user(state = null, action) {
    switch(action.type) {
        case A.SET_USER:
            return action.user;
        default:
            return state;
    }
}

const app = combineReducers({
    user
});

export default app;