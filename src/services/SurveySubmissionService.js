import React from 'react';
import Http  from '../Http';

export default {
    // read_survey_submissions
    get: () => Http.get('survey-submissions'),

    // write_survey_submissions
    create: data => Http.post('survey-submissions', data),
};
