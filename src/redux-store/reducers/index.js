import {combineReducers}       from 'redux'
import Auth                    from './Auth'
import persistStore            from './persistStore'
import Toolbar                 from './Toolbar';

export const RootReducer = combineReducers({Toolbar, Auth, persistStore});


