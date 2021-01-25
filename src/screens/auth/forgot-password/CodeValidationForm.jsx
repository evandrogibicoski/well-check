import React, {Component}      from 'react';
import {withNavigation}        from 'react-navigation';
import {connect}               from 'react-redux';
import ReeValidate, {ErrorBag} from 'ree-validate';
import StepIndicator           from 'react-native-step-indicator';

import {Form, Text, Content, Container, Button, Card, CardItem, Icon} from 'native-base';

import signUpStyles                             from '@assets/styles/screens/signUpStyles';
import Input                                    from '@components/common/Input';
import {stepIndicatorStyles}                    from '@assets/styles/components/stepIndicatorStyles';
import {AuthService}                            from '@services';
import CustomButton                             from '@components/common/Button';
import {Image, ImageBackground, Keyboard, View} from 'react-native';
import generalStyles                            from '@assets/styles/generalStyles';
import logInStyles                              from '@assets/styles/screens/logInStyles';
import {colors}                                 from '@assets/theme';

class CodeValidationForm extends Component {
    validator = {};

    state = {
        token    : '',
        isLoading: false,
        errors   : new ErrorBag(),
    };

    /**
     * sets Validation locale and resets state when components loads
     */
    componentDidMount() {
        this.initialize();
    }

    initialize = () => {
        this.validator = new ReeValidate.Validator({
            token: 'required',
        });

        this.validator.localize('en');

        this.setState({
            token    : '',
            isLoading: false,
            errors   : new ErrorBag(),
        });
    };

    /**
     * handles validation before submitting
     */
    handleSubmit = () => {
        const {token} = this.state;
        const {errors} = this.validator;

        this.validator.validateAll({token})
            .then(success => {
                if (success) {
                    this.submit();
                } else {
                    this.setState({errors});
                }
            });
    };

    submit = () => {
        this.setState({isLoading: true});

        AuthService.checkPasswordResetToken({token: this.state.token})
            .then(r => {
                console.log(r);

                this.props.navigation.push('NewPasswordForm', {token: this.state.token});
            })
            .catch(e => { console.log(e); })
            .finally(() => { this.setState({isLoading: false}); });
    };

    render() {
        const {errors, isLoading} = this.state;

        return <Container>
        <ImageBackground
            resizeMode={'cover'}
            style={generalStyles.container}
            source={require('@assets/images/bg_pattern.png')}
        >
            <Button
                style={generalStyles.backButton}
                onPress={() => this.props.navigation.goBack()}
            >
                <Icon name='arrow-back' style={{color: colors.primary.main}}/>
            </Button>

            <Content padder
                showsVerticalScrollIndicator={false}
            >
                <View style={logInStyles.heading}>
                    <Image
                        source={require('@assets/images/full-logo.png')}
                        style={logInStyles.headingImage}
                        resizeMode='contain'
                    />
                </View>

                <Card>
                    <View style={{marginTop: 10}}>
                        <StepIndicator
                            customStyles={stepIndicatorStyles}
                            currentPosition={1}
                            stepCount={3}
                        />
                    </View>
                    <CardItem bordered>
                        <Form style={signUpStyles.form}>
                            <Input
                                label='Validate'
                                name='token'
                                onChangeText={(name, value) => this.setState({token: value})}
                                blurOnSubmit={false}
                                value={this.state.token}
                                icon='mail'
                                returnKeyType='done'
                                onSubmitEditing={() => {
                                    this.handleSubmit();
                                    Keyboard.dismiss();
                                }}
                                error={errors.first('token')}
                            />
                            <CustomButton
                                title='Send'
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

const mapDispatchToProps = dispatch => ({
    checkPasswordResetToken: (token) => dispatch(AuthService.checkPasswordResetToken(token)),
});

export default connect(null, mapDispatchToProps)(withNavigation(CodeValidationForm));
