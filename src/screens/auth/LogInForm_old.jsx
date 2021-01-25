import React, {Component}                         from 'react';
import {AuthService}                              from '@services';
import ReeValidate, {ErrorBag}                    from 'ree-validate';
import {connect}                                  from 'react-redux';
import PropTypes                                  from 'prop-types';
import Input                                      from '@components/common/Input';
import logInStyles                                from '@assets/styles/screens/logInStyles';
import CustomButton                               from '@components/common/Button';
import {Container, Content, Form, Card, CardItem} from 'native-base';
import {Image, View, ImageBackground, Text}       from 'react-native';
import generalStyles                              from '@assets/styles/generalStyles';
import Snackbar                                   from 'react-native-snackbar';

const initialState = {
    form: {
        email: '',
        password: ''
    },
    showPassword: false,
    isLoading: false,
    errors: new ErrorBag(),
    visibleForgotPasswordDialog: false,
    recoverPasswordEmail: ''
};

class LogInForm extends Component {
    state = initialState;

    validator = {};

    componentWillMount() {
        this.initialize()
    }

    initialize = () => {
        this.validator = new ReeValidate.Validator({
            email: 'required',
            password: 'required|min:6'
        });
        this.validator.errors = new ErrorBag();

        this.setState({
            form: {
                email: '',
                password: ''
            },
            showPassword: false,
            isLoading: false,
            errors: new ErrorBag(),
            visibleForgotPasswordDialog: false,
            recoverPasswordEmail: ''
        })
    };

    onChangeText = (key, value) => {
        const {errors} = this.validator;
        const {form} = this.state;
        form[key] = value;

        this.validator.validate(key, value)
            .then(() => {
                this.setState({errors, form})
            })
    };

    handleClickShowPassword() {
        this.setState(state => ({showPassword: !state.showPassword}))
    };

    handleSubmit = () => {
        const {form} = this.state;
        this.validator.validateAll(form)
            .then(success => {
                if (success) {
                    this.setState({
                        isLoading: true
                    });
                    this.submit(form)
                }
            })
    };

    submit = (form) => {
        this.props.dispatch(AuthService.login(form))
            .catch(({error}) => {
                if (error.error === 'Network Error' || error.error === 'Time out') {
                    Snackbar.show({
                        title: 'Connection failed',
                        duration: Snackbar.LENGTH_INDEFINITE,
                        backgroundColor: 'red',
                        action: {
                            title: 'Retry',
                            color: 'white',
                            onPress: () => this.submit(this.state.form)
                        }
                    });
                }
                this.setState({
                    isLoading: false
                })
            })
    };

    render() {
        const {errors, isLoading} = this.state;
        return (
            <Container>
                <ImageBackground
                    resizeMode={'cover'} // or cover
                    style={generalStyles.container} // must be passed from the parent, the number may vary depending upon your screen size
                    source={require('../../assets/images/food-background-image.jpg')}
                >
                    <Content
                        showsVerticalScrollIndicator={false}
                        padder
                    >
                        <View style={logInStyles.heading}>
                            <Image
                                source={require('../../assets/images/full-logo.png')}
                                style={logInStyles.headingImage}
                                resizeMode='contain'
                            />
                        </View>
                        <Card>
                            <CardItem bordered>
                                <Form style={logInStyles.form}>
                                    <Input
                                        label='Username'
                                        name='email'
                                        returnKeyType='next'
                                        onSubmitEditing={() => {
                                            this.passwordRef.refs.passwordRefInner.focus()
                                        }}
                                        onChangeText={this.onChangeText}
                                        blurOnSubmit={false}
                                        value={this.state.email}
                                        error={errors.first('email')}
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
                                    />
                                    <Text
                                        style={logInStyles.forgotPasswordTextStyle}
                                        onPress={() =>
                                            this.props.navigation.push('ForgotPasswordNavigator')
                                        }
                                    >
                                        Forgot password?
                                    </Text>
                                    <CustomButton
                                        title='Login'
                                        onPress={this.handleSubmit}
                                        isLoading={isLoading}/>
                                </Form>
                            </CardItem>
                        </Card>
                    </Content>
                </ImageBackground>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.Auth.isAuthenticated,
});

LogInForm.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(LogInForm)
