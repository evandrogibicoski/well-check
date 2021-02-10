import {createAppContainer}   from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LogInForm               from '@screens/auth/LogInForm';
import ForgotPasswordNavigator from './ForgotPasswordNavigator';

const RouteConfigs = {
    LogInForm: {
        screen: LogInForm,
    },
    ForgotPasswordNavigator: {
        screen: ForgotPasswordNavigator,
    },
};

const StackNavigatorConfig = {
    initialRouteName : 'LogInForm',
    headerMode       : 'none',
    navigationOptions: {
        gesturesEnabled: true,
    },
};

export default createAppContainer(createStackNavigator(RouteConfigs, StackNavigatorConfig));
