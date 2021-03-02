import React from 'react';
import Http  from '../Http';

export default {
    get: platform => Http.get(`surveys/${platform}`),
};
