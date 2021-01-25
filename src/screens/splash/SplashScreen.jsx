import React, {Component}                  from 'react';
import {connect}                           from 'react-redux';
import {Dimensions, ImageBackground, View} from 'react-native';
import {ScaledSheet}                       from 'react-native-size-matters';

import {Card, Container, Content, Text} from 'native-base';

import generalStyles from '@assets/styles/generalStyles';

import Button from '@components/common/Button';

import _ from 'lodash';

const initialState = {
    screenWidth: Dimensions.get('screen').width * 0.95,
    screenHeight: Dimensions.get('screen').height * 0.9,
};

class SplashScreen extends Component {
    state = _.cloneDeep(initialState);

    initialize = () => {
        this.setState({initialState});

        Dimensions.addEventListener('change', () => this.setState({
            screenWidth : Dimensions.get('screen').width * 0.95,
            screenHeight: Dimensions.get('screen').height * 0.9,
        }));
    };

    render() {
        const employer     = this.props.user.employers[0];
        const splashScreen = employer ? employer.splash_screen : null;
        const splashText   = employer ? employer.splash_text : null;

        const styles = ScaledSheet.create({
            view: {
                marginTop: this.state.screenHeight * (splashText ? 0.67 : 0.81),
                height: 500,
            },
            splashTextCard: {
                position: 'absolute',
                top: 70,
                backgroundColor: '#111',
                marginRight: 10,
                paddingVertical: 7,
                paddingHorizontal: 15,
                width: this.state.screenWidth,
            }
        });

        return <Container>
        <ImageBackground
            resizeMode={'cover'}
            style={generalStyles.container}
            source={require('@assets/images/bg_pattern.png')}
        >
            <ImageBackground
                resizeMode={'cover'}
                style={generalStyles.container}
                source={splashScreen ? {uri: splashScreen.path} : {}}
            >
            <Content
                padder
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.view}>
                    <Button
                        title={employer ? `Continue with ${employer.name}` : 'Continue'}
                        onPress={() => this.props.navigation.navigate('HomeTabs')}
                    />
                    {splashText && <Card style={styles.splashTextCard}>
                        <Text style={{color: 'white'}}>{splashText}</Text>
                    </Card>}
                </View>
            </Content>
            </ImageBackground>
        </ImageBackground>
        </Container>;
    }
}

export default connect(state => ({
    user: state.Auth.user,
}))(SplashScreen);
