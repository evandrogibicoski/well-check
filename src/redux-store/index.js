import { applyMiddleware, createStore } from 'redux';
import { RootReducer }                  from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage                     from '@react-native-community/async-storage';
import { composeWithDevTools }          from 'redux-devtools-extension';
import logger                           from 'redux-logger';
import ReduxThunk                       from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, RootReducer)
const enhancer = composeWithDevTools(
    applyMiddleware(
        ReduxThunk,
        logger,
    )
);

export const store = createStore(persistedReducer, enhancer)
export const persistor = persistStore(store)

