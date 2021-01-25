import React                           from 'react';
import {createAppContainer}            from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {Icon}                          from 'native-base';

import {colors, fonts} from '@assets/theme';
import logInTabsStyles from '@assets/styles/screens/logInTabsStyles';

import Account            from '@screens/home/account/Account';
import WellCheckNavigator from '@screens/home/wellcheck/WellCheckNavigator';
import CheckIn            from '@screens/home/check-in/CheckIn';

const routes = {
    WellCheckNavigator: {
        screen           : ({navigation}) => <WellCheckNavigator screenProps={{rootNavigation: navigation}}/>,
        navigationOptions: {
            title     : 'WellCheck',
            tabBarIcon: ({tintColor}) => (
                <Icon name="shield-checkmark"
                    style={[
                        logInTabsStyles.icon,
                        {color: tintColor}
                    ]}>
                </Icon>
            )
        }
    },
    CheckIn: {
        screen           : CheckIn,
        navigationOptions: {
            title     : 'Check-In',
            tabBarIcon: ({tintColor}) => (
                <Icon name="qr-code"
                    style={[
                        logInTabsStyles.icon,
                        {color: tintColor}
                    ]}>
                </Icon>
            )
        }
    },
    Account: {
        screen           : Account,
        navigationOptions: {
            title     : 'Account',
            tabBarIcon: ({tintColor}) => (
                <Icon name="person"
                    style={[
                        logInTabsStyles.icon,
                        {color: tintColor}
                    ]}>
                </Icon>
            )
        }
    },
};

const config = {
    swipeEnabled        : false,
    animationEnabled    : true,
    tabBarPosition      : 'bottom',
    lazy                : true,
    optimizationsEnabled: true,
    tabBarOptions       : {
        pressColor       : colors.mediumGrey,
        upperCaseLabel   : false,
        showLabel        : true,
        showIcon         : true,
        activeTintColor  : colors.secondary.main,
        inactiveTintColor: colors.darkGrey,
        renderIndicator  : () => null,
        labelStyle       : {
            fontFamily    : fonts.base,
            fontSize      : 10,
            margin        : 0,
            padding       : 0,
            justifyContent: 'center',
            textAlign     : 'center',
        },
        style: {
            backgroundColor: colors.white,
            borderTopWidth : 0,
            paddingBottom  : 0,
            margin         : 0,
        },
    },
};

export default createAppContainer(createMaterialTopTabNavigator(routes, config));
