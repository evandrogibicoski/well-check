import {createAppContainer}   from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LogInForm               from '@screens/auth/LogInForm';
import SignUp                  from '@screens/auth/SignUp';
import ForgotPasswordNavigator from './ForgotPasswordNavigator';

const RouteConfigs = {
    LogInForm: {
        screen: LogInForm,
    },
    SignUp: {
        screen: SignUp,
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
