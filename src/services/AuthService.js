import Http            from '../Http';
import * as action     from '../redux-store/actions';
import React           from 'react';
import { AuthService } from './index';
import { store }       from '../redux-store';

export const forgotPassword = data => Http.post('password-resets/forgot-via-username', data);
export const checkResetCode = data => Http.post('password-resets/check-via-username', data);
export const resetPassword  = data => Http.post('password-resets/reset-via-username', data);

export const login = (credentials) => {
    return new Promise((resolve, reject) => {
        Http.post('login', credentials)
            .then(res => {
                if (res.data.hasOwnProperty('token')) {
                    store.dispatch(action.authLogin(res.data));
                    store.dispatch(action.clearFilters());
                } else {
                    store.dispatch(AuthService.logout());
                    return reject();
                }
                return resolve();
            })
            .catch(err => {
                return reject({error: err.response.data});
            });

    });

};

export const logout = () => {
    return new Promise((resolve, reject) => {
        Http.post('logout')
            .then(res => {
                store.dispatch(action.authLogout());
                // dispatch(action.clearFilters());
                return resolve();
            })
            .catch(err => {
                store.dispatch(action.authLogout());
                return reject();
            });
    });
};

export const updatePassword = (credentials) => {
    return new Promise((resolve, reject) => {
        Http.post('password/reset', credentials)
            .then(res => {
                const statusCode = res.data.status;
                if (statusCode === 202) {
                    return reject(res.data);
                }
                return resolve(res);
            })
            .catch(err => {
                return reject(err.response.data);
            });
    });
};

export const register = (credentials) => {
    return new Promise((resolve, reject) => {
        Http.post('register', credentials)
            .then(res => {
                if (res.data.hasOwnProperty('token')) {
                    store.dispatch(action.authLogin(res.data));
                } else {
                    store.dispatch(action.authLogout());
                    return reject();
                }
                return resolve();
            })
            .catch(err => {
                return reject({error: err.response.data});
            });
    });
};
