import axios                                                            from 'axios'
import {store}                                                          from './redux-store'
import * as actions                                                     from './redux-store/actions'
import React                                                            from 'react';
import {AuthService}                                                    from './services'
import Snackbar                                                         from 'react-native-snackbar';
import SecureStorage, {ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE} from 'react-native-secure-storage'
import DeviceSecureStorage                                              from './services/DeviceSecureStorage'
import _                                                                from 'lodash';
import * as action                                                      from './redux-store/actions';

const axiosInstance = axios.create();
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common.Accept = 'application/json';
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

axiosInstance.defaults.baseURL = __DEV__
    ? 'http://wellcheck.onlineapps.io/api/'
    : 'https://dashboard.wellcheck.app/api/';
axiosInstance.defaults.headers = {
    'Access-Control-Allow-Credentials': true,
    'X-Requested-With'                : 'XMLHttpRequest',
    'Accept'                          : 'application/json',
};

axiosInstance.interceptors.request.use(config => {
    return DeviceSecureStorage.getKey('access_token')
        .then(tokenResponse => {
            if (tokenResponse) config.headers.Authorization = `Bearer ${tokenResponse}`;

            return config;
        }).
        catch(error => { return config; });
}, error => {
    return Promise.reject(error);
});

axios.interceptors.request.use(
    request => {
        if (_.has(request, 'params.page')) {
            request.params = {
                ...request.params,
                page: request.params.page + 1
            };
        }

        return request;
    },
    error => error
);

axiosInstance.interceptors.response.use(
    response => {
        console.log('Interceptor error' + response.data);
        if (_.isString(response.data)) {
            store.dispatch(AuthService.logout());
        }
        return response
    },
    error => {
        const originalRequest = error.config;
        if (error && error.response) {
            if (error.response.status === 401) {
                store.dispatch(action.authLogout())
            } else if ((error.response.status === 401) && !originalRequest._retry) { //TODO:IMPLEMENT REFRESH TOKEN
                store.dispatch(action.authLogout())
                // originalRequest._retry = true;
                // return AuthService.getToken()
                //     .then(token => {
                //         const authTokenResponse = path(['data', 'response'], token)
                //         axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + authTokenResponse;
                //         originalRequest.headers['Authorization'] = 'Bearer ' + authTokenResponse;
                //         return axiosInstance(originalRequest);
                //     })
                //     .catch(err => err)
            } else if (error.response.status === 408) {
                error.response = {data: 'Time out'};
                return Promise.reject(error);
            } else {
                Snackbar.show({
                    title: error.response.data.message,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    action: {
                        title: 'CLOSE',
                        color: 'white',
                    }
                });
            }
        } else if (error.message && error.message === 'Network Error') {
            error.response = {data: 'Network Error'};
            return Promise.reject(error);

        }  else {
            error.data = {};
            Snackbar.show({
                title: 'General error',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                action: {
                    title: 'CLOSE',
                    color: 'white',
                }
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
