import React                     from 'react';
import {LogBox, StatusBar, View} from 'react-native';
import {connect}                 from 'react-redux';
import {SafeAreaView}            from 'react-native';
import Icon                      from '../native-base-theme/components/Icon';
import LogInForm                 from '@screens/auth/LogInForm';
// import HomeTabs                  from '@navigation/tabs/HomeTabs';
import SplashScreenNavigator     from './navigation/stack/SplashScreenNavigator';
import LogIn                     from '@screens/auth/LogIn';

class App extends React.Component {
    state = {
        isLoading: true,
    };

    componentDidMount() {
        StatusBar.setHidden(true);
        LogBox.ignoreAllLogs(true);
        // TEMPORARY CODE
    }

    render() {
        const {isAuthenticated} = this.props;

        return <View style={{flex: 1}}>
            {isAuthenticated
                ? <SplashScreenNavigator/>
                : <LogIn/>
            }
        </View>;
    }
}

export default connect(state => ({
    isAuthenticated: state.Auth.isAuthenticated,
}))(App);
