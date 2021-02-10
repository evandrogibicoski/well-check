import React, {Component}      from 'react';
import {withNavigation}        from 'react-navigation';
import ReeValidate, {ErrorBag} from 'ree-validate';
import StepIndicator           from 'react-native-step-indicator';

import {
    Form, Text, Content, Container, Button, Card, CardItem, Icon
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

class CodeValidationForm extends Component {
    validator = {};

    state = {
        code     : '',
        isLoading: false,
        errors   : new ErrorBag(),
        username : this.props.navigation.getParam('username', ''),
    };

    /**
     * sets Validation locale and resets state when components loads
     */
    componentDidMount() {
        this.initialize();
    }

    initialize = () => {
        this.validator = new ReeValidate.Validator({
            code: 'required',
        });

        this.validator.localize('en');

        this.setState({
            code     : '',
            isLoading: false,
            errors   : new ErrorBag(),
            username : this.props.navigation.getParam('username', ''),
        });
    };

    /**
     * handles validation before submitting
     */
    handleSubmit = () => {
        const {code} = this.state;
        const {errors} = this.validator;

        this.validator.validateAll({code})
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

        const payload = {
            username: this.state.username,
            code    : this.state.code,
        };

        AuthService.checkResetCode(payload)
            .then(() => this.props.navigation.push('NewPasswordForm', payload))
            .finally(() => this.setState({isLoading: false}));
    };

    render() {
        const {errors, isLoading} = this.state;

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
                            currentPosition={1}
                            stepCount={3}
                        />
                    </View>
                    <CardItem bordered>
                        <Form style={signUpStyles.form}>
                            <Input
                                label="Validation Code"
                                name="code"
                                onChangeText={(name, value) => this.setState({code: value})}
                                blurOnSubmit={false}
                                value={this.state.code}
                                icon="code"
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    this.handleSubmit();
                                    Keyboard.dismiss();
                                }}
                                error={errors.first('code')}
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

export default withNavigation(CodeValidationForm);
