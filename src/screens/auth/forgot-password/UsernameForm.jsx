import React, {Component}      from 'react';
import {withNavigation}        from 'react-navigation';
import ReeValidate, {ErrorBag} from 'ree-validate';
import StepIndicator           from 'react-native-step-indicator';

import {
    Container, Content, Form, Button, Text, Card, CardItem, Left, Icon, Header, Body, Right
} from 'native-base';

import generalStyles                            from '@assets/styles/generalStyles';
import {stepIndicatorStyles}                    from '@assets/styles/components/stepIndicatorStyles';
import logInStyles                              from '@assets/styles/screens/logInStyles';
import {colors}                                 from '@assets/theme';
import CustomButton                             from '@components/common/Button';
import Input                                    from '@components/common/Input';
import {AuthService}                            from '@services';
import {Image, ImageBackground, Keyboard, View} from 'react-native';

class UsernameForm extends Component {
    validator = {};

    state = {
        username : '',
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
            username : '',
            isLoading: false,
            errors   : new ErrorBag(),
        });

        this.validator = new ReeValidate.Validator({
            username: 'required',
        });

        this.validator.localize('en');
    };

    /**
     * handles validation before submitting
     */
    handleSubmit = () => {
        const {username}  = this.state;
        const {errors} = this.validator;

        this.validator.validateAll({username})
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

        const payload = {username: this.state.username};

        AuthService.forgotPassword(payload)
            .then(() => this.props.navigation.navigate('CodeValidationForm', payload))
            .finally(() => this.setState({isLoading: false}));
    };

    /**
     * renders component
     */
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
                            currentPosition={0}
                            stepCount={3}
                        />
                    </View>
                    <CardItem bordered>
                        <Form style={logInStyles.form}>
                            <Input
                                label="Username"
                                onChangeText={(name, value) => this.setState({username: value})}
                                blurOnSubmit={false}
                                value={this.state.username}
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    this.handleSubmit();
                                    Keyboard.dismiss();
                                }}
                                icon="person"
                                error={errors.first('username')}
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

export default withNavigation(UsernameForm);
