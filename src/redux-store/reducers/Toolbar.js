import * as ActionTypes from '../action-types';

const initialState = {
    toolbarTitle : ''
};

const Toolbar = (state= initialState,{type,payload = null}) => {
    switch(type){
        case ActionTypes.TOOLBAR_SET_TITLE:
            return toolbarSetTitle(state,payload);
        default:
            return state;
    }
};

const toolbarSetTitle = (state,payload) => {
    state = Object.assign({}, state, {
        toolbarTitle: payload
    });
    return state;

};

export default Toolbar;
