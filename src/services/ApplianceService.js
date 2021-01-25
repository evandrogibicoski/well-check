import Http from '../Http'
import React from 'react';


export function all(pagination = {}) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.get('appliances', {params: pagination})
                .then(res => {
                    return resolve(res.data);
                })
                .catch(err => {
                    return reject({error: err.response.data});
                })
        })
    )
}

export function get(id) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.get(`appliances/${id}`)
                .then(res => {
                    return resolve(res.data);
                })
                .catch(err => {
                    return reject({error: err.response.data});
                })
        })
    )
}
