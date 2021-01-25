import {createAppContainer}            from 'react-navigation'
import {createStackNavigator}          from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

import EmailForm          from '@screens/auth/forgot-password/EmailForm';
import CodeValidationForm from '@screens/auth/forgot-password/CodeValidationForm';
import NewPasswordForm    from '@screens/auth/forgot-password/NewPasswordForm';

const RouteConfigs = {
    EmailForm: {
        screen: EmailForm,
    },
    CodeValidationForm: {
        screen: CodeValidationForm,
    },
    NewPasswordForm: {
        screen: NewPasswordForm,
    },
};

const StackNavigatorConfig = {
    initialRouteName : 'EmailForm',
    headerMode       : 'none',
    navigationOptions: {
        gesturesEnabled: true,
    },
};

export default createAppContainer(createStackNavigator(RouteConfigs, StackNavigatorConfig));
