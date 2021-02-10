import * as ActionTypes from '../action-types';

export function authLogin(payload) {
    return {type: ActionTypes.AUTH_LOGIN, payload};
};

export function authLogout() {
    return {type: ActionTypes.AUTH_LOGOUT};
};

export function authCheck() {
    return {type: ActionTypes.AUTH_CHECK};
};

export function authSetUser(payload) {
    return {type: ActionTypes.AUTH_SET_USER, payload};
};

export function toolbarSetTitle(payload) {
    return {type: ActionTypes.TOOLBAR_SET_TITLE, payload};
};

export const showError = (show, message) => {
    return {
        type        : ActionTypes.SHOW_ERROR,
        showError   : show,
        errorMessage: message,
    };
};

export const hideError = () => {
    return {type: ActionTypes.HIDE_ERROR};
};

export const addFilters = (filters) => {
    return {type: ActionTypes.ADD_FILTERS, payload: filters};
};

export const clearFilters = () => {
    return {type: ActionTypes.CLEAR_FILTERS};
};
