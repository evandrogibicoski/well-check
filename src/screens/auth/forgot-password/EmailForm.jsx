import React, {Component}      from 'react';
import {withNavigation}        from 'react-navigation';
import { connect }             from 'react-redux';
import ReeValidate, {ErrorBag} from 'ree-validate';
import Input                   from '@components/common/Input';

import {
    Container, Content, Form, Button, Text, Card, CardItem, Left, Icon, Header, Body, Right
} from 'native-base';

import logInStyles                              from '@assets/styles/screens/logInStyles';
import StepIndicator                            from 'react-native-step-indicator';
import {stepIndicatorStyles}                    from '@assets/styles/components/stepIndicatorStyles';
import {AuthService}                            from '@services';
import CustomButton                             from '@components/common/Button';
import {Image, ImageBackground, Keyboard, View} from 'react-native';
import generalStyles                            from '@assets/styles/generalStyles';
import {colors}                                 from '@assets/theme';

class EmailForm extends Component {
    validator = {};

    state = {
        email    : '',
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
        this.setState({
            email    : '',
            isLoading: false,
            errors   : new ErrorBag(),
        });

        this.validator = new ReeValidate.Validator({
            email: 'required|email',
        });

        this.validator.localize('en');
    };

    /**
     * handles validation before submitting
     */
    handleSubmit = () => {
        const {email} = this.state;
        const {errors} = this.validator;

        this.validator.validateAll({email})
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

        AuthService.createPasswordResetToken({email: this.state.email})
            .then(() => {
                this.initialize();
                this.props.navigation.navigate('CodeValidationForm');
            })
            .catch(e => console.log(e.response))
            .finally(() => { this.setState({isLoading: false}); });
    };

    /**
     * renders component
     */
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
                onPress={() => this.props.navigation.dismiss()}
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
                            currentPosition={0}
                            stepCount={3}
                        />
                    </View>
                    <CardItem bordered>
                        <Form style={logInStyles.form}>
                            <Input
                                label='Email'
                                onChangeText={(name, value) => this.setState({email: value})}
                                blurOnSubmit={false}
                                value={this.state.email}
                                returnKeyType='done'
                                onSubmitEditing={() => {
                                    this.handleSubmit();
                                    Keyboard.dismiss();
                                }}
                                icon='mail'
                                error={errors.first('email')}
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
    createPasswordResetToken: (credentials) => dispatch(AuthService.createPasswordResetToken(credentials)),
});

export default connect(null, mapDispatchToProps)(withNavigation(EmailForm));
