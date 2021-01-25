import 'react-native-gesture-handler';
import React           from 'react'
import App             from './src/App';
import {StyleProvider} from 'native-base';
import getTheme        from './native-base-theme/components';
import platform        from './native-base-theme/variables/platform'
import {PersistGate}   from 'redux-persist/lib/integration/react';
import {Alert}         from 'react-native';

import messaging from '@react-native-firebase/messaging';

// redux
import {Provider}         from 'react-redux'
import {store, persistor} from './src/redux-store'
import {AppRegistry}      from 'react-native';
import {name as appName}  from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the BG!', remoteMessage);
});

const HeadlessCheck = ({isHeadless}) => {
    // App has been launched in the background by iOS, ignore
    if (isHeadless) return null;

    messaging().onMessage(async remoteMessage => {
        console.log('Message handled in the FG!', remoteMessage);
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <StyleProvider style={getTheme(platform)}>
                <App/>
            </StyleProvider>
        </PersistGate>
    </Provider>;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
