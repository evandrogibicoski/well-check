import * as ActionTypes              from '../action-types'
import Http                          from '../../Http'
import {AuthService}                 from '@services'
import {AsyncStorage}                from 'react-native';
import {applyMiddleware as dispatch} from 'redux'
import DeviceSecureStorage           from '@services/DeviceSecureStorage'

const initialState = {
    isAuthenticated: false,
    user           : null,
};

const Auth = (state = initialState, {type, payload = null}) => {
    switch (type) {
        case ActionTypes.AUTH_LOGIN:
            return authLogin(state, payload);
        case ActionTypes.AUTH_CHECK:
            return checkAuth(state);
        case ActionTypes.AUTH_LOGOUT:
            return logout(state);
        case ActionTypes.AUTH_SET_USER:
            return setUser(state, payload);
        default:
            return state;
    }
};

const authLogin = (state, payload) => {
    // Check if an access token has been returned from server
    if (payload.hasOwnProperty('token')) {
        DeviceSecureStorage.saveKey('access_token', payload.token);
        Http.defaults.headers['Authorization'] = `Bearer ${payload.token}`;
        state = Object.assign({}, state, {
            isAuthenticated: true,
            user: payload.user,
        });
    } else {
        dispatch(AuthService.logout());
    }

    return state;
};

const checkAuth = state => {
    if (state.isAuthenticated) {
        Http.defaults.headers.common.Authorization = `Bearer ${state.access_token}`;
    } else {
        dispatch(AuthService.logout());
    }

    return state;
};

const setUser = (state, payload) => {
    if (state.isAuthenticated) {
        state = Object.assign({}, state, {
            user: payload.user,
        });
    } else {
        dispatch(AuthService.logout());
    }

    return state;
};

const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        DeviceSecureStorage.getKey('access_token')
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => reject(err));
    });
};

const logout = state => {
    DeviceSecureStorage.deleteKey('access_token');
    Http.defaults.headers['Authorization'] = '';
    state = Object.assign({}, state, {
        isAuthenticated: false,
    });
    return state;
};

export default Auth;
