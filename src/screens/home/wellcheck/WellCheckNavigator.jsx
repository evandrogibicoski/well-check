import React                  from 'react';
import {createAppContainer}   from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WellCheckSurvey from './WellCheckSurvey';
import WellCheckStatus from './WellCheckStatus';

const routes = {
    WellCheckStatus: {
        screen: screenProps => <WellCheckStatus {...screenProps} />,
    },
    WellCheckSurvey: {
        screen: WellCheckSurvey,
    },
};

const config = {
    initialRouteName: 'WellCheckStatus',
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    },
};

export default createAppContainer(createStackNavigator(routes, config));
