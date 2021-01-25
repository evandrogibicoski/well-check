import React from 'react';
import Http  from '../Http';

export default {
    get: () => Http.get('surveys'),
};
