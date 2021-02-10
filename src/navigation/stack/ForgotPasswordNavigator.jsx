import {createAppContainer}            from 'react-navigation'
import {createStackNavigator}          from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

import UsernameForm       from '@screens/auth/forgot-password/UsernameForm';
import CodeValidationForm from '@screens/auth/forgot-password/CodeValidationForm';
import NewPasswordForm    from '@screens/auth/forgot-password/NewPasswordForm';

const RouteConfigs = {
    UsernameForm: {
        screen: UsernameForm,
    },
    CodeValidationForm: {
        screen: CodeValidationForm,
    },
    NewPasswordForm: {
        screen: NewPasswordForm,
    },
};

const StackNavigatorConfig = {
    initialRouteName : 'UsernameForm',
    headerMode       : 'none',
    navigationOptions: {
        gesturesEnabled: true,
    },
};

export default createAppContainer(createStackNavigator(RouteConfigs, StackNavigatorConfig));
