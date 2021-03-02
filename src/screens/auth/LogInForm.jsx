import React, {Component}                               from 'react';
import {AuthService}                                    from '@services';
import ReeValidate, {ErrorBag}                          from 'ree-validate';
import {connect}                                        from 'react-redux';
import PropTypes                                        from 'prop-types';
import Input                                            from '@components/common/Input';
import logInStyles                                      from '@assets/styles/screens/logInStyles';
import CustomButton                                     from '@components/common/Button';
import {Container, Form, Root}                          from 'native-base';
import {Image, View, ImageBackground, ScrollView, Text} from 'react-native';
import Snackbar                                         from 'react-native-snackbar';

import messaging from '@react-native-firebase/messaging';

const initialState = {
    form: {
        username: '',
        password: '',
    },

    showPassword: false,
    isLoading: false,
    errors: new ErrorBag(),
    visibleForgotPasswordDialog: false,
    recoverPasswordEmail: '',
};

class LogInForm extends Component {
    state = initialState;

    validator = {};

    componentDidMount () {
        this.initialize();
    }

    initialize = () => {
        this.validator = new ReeValidate.Validator({
            username: 'required',
            password: 'required|min:4',
        });

        this.validator.errors = new ErrorBag();
        this.validator.localize('en');

        this.setState({
            form: {
                username: '',
                password: '',
            },
            showPassword: false,
            isLoading: false,
            errors: new ErrorBag(),
            visibleForgotPasswordDialog: false,
            recoverPasswordEmail: '',
        });
    };

    onChangeText = (key, value) => {
        const {errors} = this.validator;
        const {form} = this.state;
        form[key] = value;

        this.validator.validate(key, value)
            .then(() => { this.setState({errors, form}); });
    };

    handleClickShowPassword() {
        this.setState(state => ({showPassword: !state.showPassword}));
    };

    handleSubmit = () => {
        const {form} = this.state;

        this.validator.validateAll(form)
            .then(success => {
                if (success) {
                    this.setState({isLoading: true});
                    this.submit(form);
                }
            });
    };

    submit = form => {
        messaging().getToken().then(token => {
            let payload = Object.assign(form, {
                device_token: token,
            });

            AuthService.login(payload)
                .catch(({error}) => {
                    if (error.error === 'Network Error' || error.error === 'Time out') {
                        Snackbar.show({
                            title: 'Connection failed',
                            duration: Snackbar.LENGTH_INDEFINITE,
                            backgroundColor: 'red',
                            action: {
                                title: 'Retry',
                                color: 'white',
                                onPress: () => this.submit(this.state.form),
                            },
                        });
                    }
                })
                .finally(() => { this.setState({isLoading: false}); });

        });
    };

    render() {
        const {errors, isLoading} = this.state;

        return <Root>
            <Container>
                <ScrollView>
                    <ImageBackground
                        resizeMode={'cover'}
                        imageStyle={{borderBottomRightRadius: 30,}}
                        style={logInStyles.imageBackground}
                        source={require('@assets/images/bg_pattern.png')}
                    >
                        <View style={logInStyles.heading}>
                            <Image
                                source={require('@assets/images/full-logo.png')}
                                style={logInStyles.headingImage}
                                resizeMode='contain'
                            />
                        </View>
                    </ImageBackground>
                    <Form style={logInStyles.form}>
                        <Input
                            label='Username'
                            name='username'
                            returnKeyType='next'
                            onSubmitEditing={() => { this.passwordRef.refs.passwordRefInner.focus(); }}
                            onChangeText={this.onChangeText}
                            blurOnSubmit={false}
                            value={this.state.username}
                            error={errors.first('username')}
                            icon='md-person'
                        />
                        <Input
                            label='Password'
                            name='password'
                            returnKeyType='done'
                            ref={passwordRef => this.passwordRef = passwordRef}
                            refInner='passwordRefInner'
                            onSubmitEditing={this.handleSubmit}
                            onChangeText={this.onChangeText}
                            value={this.state.password}
                            error={errors.first('password')}
                            secureTextEntry
                            icon='md-lock-closed'
                            visibilityToggle
                        />
                        <CustomButton
                            style={logInStyles.loginButton}
                            title='LOGIN'
                            onPress={this.handleSubmit}
                            isLoading={isLoading}
                        />
                        <Text
                            style={logInStyles.signUpTextStyle}
                            onPress={() => this.props.navigation.push('SignUp')}
                        >
                            No account yet?{'\n'}
                            Let's create it!
                        </Text>
                        <Text
                            style={logInStyles.forgotPasswordTextStyle}
                            onPress={() => this.props.navigation.push('ForgotPasswordNavigator')}
                        >
                            Forgot password?{'\n'}
                            No problem, we can help you!
                        </Text>
                    </Form>
                </ScrollView>
            </Container>
        </Root>;
    }
}

LogInForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect(state => ({
    isAuthenticated: state.Auth.isAuthenticated,
}))(LogInForm);
