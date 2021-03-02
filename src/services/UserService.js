import Http        from '../Http'
import React       from 'react'
import * as action from '../redux-store/actions'
import _           from 'lodash';

export default {
    all: (pagination = {}) => Http.get('users', {params: pagination}),
    get: (id) => Http.get(`users/${id}`),

    remove: ids => {
        ids = Array.isArray(ids) ? _.join(ids) : ids;
        return Http.delete(`users/${ids}`);
    },

    getAuthenticatedUser           : () => Http.get('profile'),
    create                         : data => Http.post('users', data),
    updateProfile                  : data => Http.put('profile', data),
    updateProfileImage             : data => Http.post('profile/image', data),
    deleteProfile                  : data => Http.delete('profile/own-account', data),
    registerWithDefaultOrganization: data => Http.post('register-with-default-organization', data),

};
// export function all (pagination = {}) {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.get('api/users', {params: pagination})
//                 .then(res => {
//                     return resolve(res.data)
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data})
//                 })
//         })
//     )
// }

// export function get (id) {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.get(`api/users/${id}`)
//                 .then(res => {
//                     return resolve(res.data)
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data})
//                 })
//         })
//     )
// }

// export function authenticatedUser () {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.get('api/profile')
//                 .then(res => {
//                     return resolve(res.data)
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data})
//                 })
//         })
//     )
// }

// export function create (data) {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.post('api/users', data)
//                 .then(res => {
//                     return resolve(res.data)
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data})
//                 })
//         })
//     )
// }

// export function updateProfile(data) {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.put('api/profile', data)
//                 .then(res => {
//                     return resolve(res.data);
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data});
//                 })
//         })
//     )
// }

// export function updateProfileImage(data) {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.post('api/profile/image', data)
//                 .then(res => {
//                     return resolve(res.data);
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data});
//                 })
//         })
//     )
// }

// export function deleteProfile() {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.delete('api/profile/own-account')
//                 .then(res => {
//                     dispatch(action.authLogout())
//                     return resolve();
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data});
//                 })
//         })
//     )
// }

// export function remove (ids) {
//     return dispatch => (
//         new Promise((resolve, reject) => {
//             Http.delete(`api/users/${JSON.stringify(ids)}`)
//                 .then(res => {
//                     return resolve(res.data)
//                 })
//                 .catch(err => {
//                     return reject({error: err.response.data})
//                 })
//         })
//     )
// }
