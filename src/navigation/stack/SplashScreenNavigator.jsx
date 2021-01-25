import React                  from 'react';
import {createAppContainer}   from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import SplashScreen from '@screens/splash/SplashScreen';
import HomeTabs     from '@navigation/tabs/HomeTabs';

const routes = {
    SplashScreen: {
        screen: SplashScreen,
    },
    HomeTabs: {
        screen: HomeTabs,
    },
};

const config = {
    initialRouteName: 'SplashScreen',
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    },
};

export default createAppContainer(createStackNavigator(routes, config));
