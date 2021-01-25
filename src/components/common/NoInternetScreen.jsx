import React, {Component}                       from 'react';
import {Icon, Text, Content}                    from 'native-base';
import NetInfo                                  from '@react-native-community/netinfo';
import {RefreshControl, View, TouchableOpacity} from 'react-native';
import noInternetScreenStyles                   from '@assets/styles/components/noInternetScreenStyles';
import PropTypes                                from 'prop-types';

class NoInternetScreen extends Component {

    state = {
        isRefreshing: false,
        isOffline: false,
        prevIsOffline: false,
    };

    unsubscribe = {};

    componentDidMount() {
        this.unsubscribe = NetInfo.addEventListener(connectionInfo => {
            if (connectionInfo.type === 'none') {
                this.setState({isOffline: true, prevIsOffline: this.state.isOffline})
            } else {
                if (this.state.prevIsOffline) {
                    this.setState({isOffline: false, prevIsOffline: this.state.isOffline}, () => {
                        this.props.retryRequest();
                    })
                } else {
                    this.setState({isOffline: false});
                }
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onRefresh = () => {
        this.setState({isRefreshing: true}, async () => {
            await this.props.retryRequest();
            this.setState({isRefreshing: false});
        });
    };

    render() {
        const {isOffline} = this.state;
        return isOffline
            ? <Content
                refreshControl={
                    <RefreshControl enabled
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.props.retryRequest()}
                >
                    <View style={noInternetScreenStyles.container}>
                        <Icon name={'logo-rss'} style={noInternetScreenStyles.icon}/>
                        <Text style={noInternetScreenStyles.text}>
                            Enable your internet connection and press here
                        </Text>
                    </View>
                </TouchableOpacity>
            </Content>

            : this.props.children
        ;
    }
}

NoInternetScreen.propTypes = {
    retryRequest: PropTypes.func.isRequired,
};

export default NoInternetScreen;
