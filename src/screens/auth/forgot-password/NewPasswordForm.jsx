import React, {Component}                                from 'react';
import {withNavigation, StackActions, NavigationActions} from 'react-navigation';
import ReeValidate, {ErrorBag}                           from 'ree-validate';
import StepIndicator                                     from 'react-native-step-indicator';

import {
    Form, Text, Container, Content, Button, Card, CardItem, Icon
} from 'native-base';

import generalStyles                            from '@assets/styles/generalStyles';
import {stepIndicatorStyles}                    from '@assets/styles/components/stepIndicatorStyles';
import logInStyles                              from '@assets/styles/screens/logInStyles';
import signUpStyles                             from '@assets/styles/screens/signUpStyles';
import {colors}                                 from '@assets/theme';
import CustomButton                             from '@components/common/Button';
import Input                                    from '@components/common/Input';
import {AuthService}                            from '@services';
import {Image, ImageBackground, Keyboard, View} from 'react-native';

class NewPasswordForm extends Component {
    validator = {};

    state = {
        password             : '',
        password_confirmation: '',
        isLoading            : false,
        errors               : new ErrorBag(),
        confirmError         : null,
        username             : this.props.navigation.getParam('username', ''),
        code                 : this.props.navigation.getParam('code', ''),
    };

    componentDidMount() {
        this.initialize();
    }

    initialize = () => {
        this.validator = new ReeValidate.Validator({
            password: 'required',
        });

        this.validator.localize('en');

        this.setState({
            password             : '',
            password_confirmation: '',
            isLoading            : false,
            errors               : new ErrorBag(),
            confirmError         : null,
            username             : this.props.navigation.getParam('username', ''),
            code                 : this.props.navigation.getParam('code', ''),
        });
    };

    onChangeText = (key, value) => {
        const {errors} = this.validator;

        if (key === 'password' || key === 'password_confirmation') {
            this.validatePasswordConfirmation(value);
            if (key === 'password_confirmation') {
                this.setState({[key]: value});
            } else if (key === 'password') {
                this.validator.validate(key, value)
                    .then(() => { this.setState({[key]: value, errors}); });
            }
        }
    };

    validatePasswordConfirmation = value => {
        if (this.state.password !== value) {
            this.setState({confirmError: 'Fields do not match.'});
        } else {
            this.setState({confirmError: null});
        }
    };

    handleSubmit = () => {
        this.validator.validateAll({
            password             : this.state.password,
            password_confirmation: this.state.password_confirmation,
        })
            .then(success => {
                if (success && !this.state.confirmError && this.state.password_confirmation === this.state.password) {
                    this.submit();
                } else {
                    if (this.state.confirmError && this.state.confirmError.length) {
                        this.setState({confirmError: 'Fields do not match.'});
                    } else {
                        this.setState({confirmError: 'Field Password Confirmation is required.'});
                    }

                    this.setState({errors});
                }
            });
    };

    submit = () => {
        this.setState({isLoading: true});

        const payload = {
            password             : this.state.password,
            password_confirmation: this.state.password_confirmation,
            username             : this.state.username,
            code                 : this.state.code,
        };

        AuthService.resetPassword(payload)
            .then(() => this.props.navigation.navigate('LogInForm'))
            .finally(() => this.setState({isLoading: false}));
    };

    render() {
        const {errors, confirmError, isLoading} = this.state;

        return <Container>
        <ImageBackground
            resizeMode="cover"
            style={generalStyles.container}
            source={require('@assets/images/bg_pattern.png')}
        >
            <Content padder
                showsVerticalScrollIndicator={false}
            >
                <Button
                    iconLeft
                    style={generalStyles.backButton}
                    onPress={() => this.props.navigation.dismiss()}
                >
                    <Icon name="arrow-back" style={{color: colors.primary.main, marginLeft: 10}}/>
                </Button>

                <View style={logInStyles.heading}>
                    <Image
                        source={require('@assets/images/full-logo.png')}
                        style={logInStyles.headingImage}
                        resizeMode="contain"
                    />
                </View>

                <Card>
                    <View style={{marginTop: 10}}>
                        <StepIndicator
                            customStyles={stepIndicatorStyles}
                            currentPosition={2}
                            stepCount={3}
                        />
                    </View>

                    <CardItem bordered>
                        <Form style={signUpStyles.form}>
                            <Input
                                label="New password"
                                secureTextEntry
                                name="password"
                                returnKeyType="next"
                                ref={passwordRef => this.passwordRef = passwordRef}
                                refInner="passwordRefInner"
                                onSubmitEditing={() => {
                                    this.passwordConfirmationRef.refs.passwordConfirmationRefInner.focus();
                                }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.password}
                                icon="md-lock-closed"
                                error={errors.first('password')}
                                visibilityToggle
                            />
                            <Input
                                label="Confirm new password"
                                secureTextEntry
                                name="password_confirmation"
                                returnKeyType="done"
                                ref={passwordConfirmationRef => this.passwordConfirmationRef = passwordConfirmationRef}
                                refInner="passwordConfirmationRefInner"
                                onSubmitEditing={() => {
                                    this.handleSubmit();
                                    Keyboard.dismiss();
                                }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.password_confirmation}
                                icon="md-lock-closed"
                                error={confirmError}
                                visibilityToggle
                            />
                            <CustomButton
                                title="Send"
                                onPress={this.handleSubmit}
                                isLoading={isLoading}
                            />
                        </Form>
                    </CardItem>
                </Card>
            </Content>
        </ImageBackground>
        </Container>;
    }
}

export default withNavigation(NewPasswordForm);
