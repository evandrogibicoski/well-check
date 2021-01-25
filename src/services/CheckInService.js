import React from 'react';
import Http  from '../Http';

export default {
    // read_check_in
    get: () => Http.get('check-ins'),

    // write_check_in
    create: data => Http.post('check-ins', data),
};
