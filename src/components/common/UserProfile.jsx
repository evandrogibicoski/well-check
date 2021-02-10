//====================REACT=================
import React, {Component} from 'react';
import {
    View, ImageBackground, TouchableNativeFeedback, Image,
    Text, TouchableHighlight, Platform,
    Keyboard, ScrollView, Alert, Dimensions
} from 'react-native';

//===================STYLING=================
import {Container, Content, Form, Card, CardItem, CheckBox, ListItem} from 'native-base';
import signUpStyles                                                   from '@assets/styles/screens/signUpStyles';
import generalStyles                                                  from '@assets/styles/generalStyles';
import {colors}                                                       from '@assets/theme';

//=========================COMPONENTS=======================
import Button                                             from '@components/common/Button';
import Input                                              from '@components/common/Input';
import {Loading}                                          from './Loading';
import PhotoUpload                                        from 'react-native-photo-upload';
import Snackbar                                           from 'react-native-snackbar';
import Dialog, {DialogContent, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import NoInternetScreen                                   from './NoInternetScreen';

//==========================REQUESTS========================
import * as AuthService from '@services/AuthService';
import {UserService}    from '@services';
import * as action      from '@store/actions';
import {connect}        from 'react-redux';


//==========================UTILITIES========================
import ReeValidate, {ErrorBag} from 'ree-validate';
import platform                from '../../../native-base-theme/variables/platform';
import Utils                   from '@src/Utils';
import en                      from 'ree-validate/dist/locale/en';

//==========================CONSTANTS========================
import cloneDeep from 'lodash/cloneDeep';
import {store}   from '@store';

const initialState = {
    //Integers
    screenWidth: Dimensions.get('screen').width * 0.95,
    screenHeight: Dimensions.get('screen').height * 0.9,

    //Booleans
    isLoading                   : false,
    isSubmitButtonLoading       : false,
    isLogoutButtonLoading       : false,
    hasVisibleTermsAndConditions: false,

    //Objects
    form: {
        username             : '',
        first_name           : '',
        last_name            : '',
        email                : '',
        phone                : '',
        password             : '',
        password_confirmation: '',
        image                : null,
        hasUserAgreement     : false,
    },
    errors: new ErrorBag(),
    passwordConfirmError: null,
};

class UserProfile extends Component {
    state = cloneDeep(initialState);
    dictionary = {
        en: {
            ...en,
            attributes: {
                last_name       : 'Last Name',
                first_name      : 'First Name',
                password_confirmation: 'Password Confirmation',
            },
        },
    };
    validator = new ReeValidate.Validator({
        username        : 'required|min:3|alpha_num',
        last_name       : 'required|min:3|alpha_num',
        first_name      : 'required|min:3|alpha_num',
        email           : 'email',
        phone           : 'required',
        password        : !this.props.isAuthenticated ? 'required|min:6' : 'min:6',
        hasUserAgreement: !this.props.isAuthenticated ? 'required:true' : '',
    });

    /**
     *  Function for initial setup
     */
    initialize = () => {
        this.validator.errors = new ErrorBag();
        this.setState({initialState});
        //Listeners
        Dimensions.addEventListener('change', () => this.checkScreenDimensions());
        //Validator
        this.validator.localize('en', this.dictionary.en);

        const {isAuthenticated} = this.props;
        //Initial checks
        if (!Utils.isOffline() && isAuthenticated) {
            this.getProfileInfo();
        }
    };

    componentDidMount() {
        this.initialize();
    }

    /**
     * removes event listeners when component unmounts
     */
    componentWillUnmount() {
        Dimensions.removeEventListener('change', () => this.checkScreenDimensions());
    }

    //=================================CHECKS=================================
    checkScreenDimensions = () => {
        this.setState({
            screenWidth: Dimensions.get('screen').width * 0.95,
            screenHeight: Dimensions.get('screen').height * 0.9,
        });
    };

    deleteUserProfileConfirmation = () => {
        Alert.alert(
            'Confirm',
            'Delete account?',
            [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: this.deleteUserProfile},
            ]
        );
    };

    //==========================HANDLES FOR DATA CHANGE/ EVENTS=========================
    onChangeText = (key, value) => {
        const {errors} = this.validator;
        const {form} = this.state;

        form[key] = value;

        if (key === 'password' || key === 'password_confirmation') {
            this.validatePasswordConfirmation(form['password_confirmation']);
            if (key === 'password_confirmation') return;
        }

        this.validator.validate(key, value)
            .then(() => { this.setState({errors, form}); });
    };

    onPhotoUpload = (response) => {
        let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        if (base64regex.test(response)) {
            const {form} = this.state;
            form.image = {
                title: Math.random().toString(36).substring(2, 15),
                file: 'data:image/jpeg;base64,' + response,
            };
            this.setState({form});
            this.saveProfilePhoto();
        }
    };

    //==============================VALIDATION=======================================
    validatePasswordConfirmation = (value) => {
        const {form} = this.state;

        if (this.state.form.password !== value) {
            this.setState({passwordConfirmError: 'Passwords are not matching.', form});
        } else {
            this.setState({passwordConfirmError: null, form});
        }
    };

    handleSubmit = event => {
        event.preventDefault();

        const {form}   = this.state;
        const {errors} = this.validator;

        this.validator.validateAll(form)
            .then(success => {
                if (
                    success &&
                    !this.state.passwordConfirmError &&
                    this.state.form.password_confirmation === this.state.form.password
                ) {
                    this.setState({isSubmitButtonLoading: true});
                    this.submit(form);
                } else {
                    let errMsg = '';
                    if (this.state.passwordConfirmError && this.state.passwordConfirmError.length) {
                        errMsg = 'Fields do not match.';
                    } else if (this.state.form.password_confirmation === '') {
                        errMsg = 'Field Password Confirmation is required.';
                    }

                    this.setState({errors, passwordConfirmError: errMsg});
                }
            });
    };

    //============================REQUESTS============================
    getProfileInfo = () => {
        this.setState({isLoading: true}, () => {
            UserService.getAuthenticatedUser()
                .then(response => {
                    store.dispatch(action.authSetUser(response.data));
                    this.setFormData(response.data.user);
                })
                .finally(() => { this.setState({isLoading: false}); });
        })
    };
    /**
     * Logout the user from the current session
     */
    logout = () => {
        this.setState({isLogoutButtonLoading: true}, () => {
            AuthService.logout();
        });
    };


    deleteUserProfile = () => {
        return UserService.deleteProfile()
            .then(() => { this.props.removeUserData(); })
            .catch(e => { console.log(e); });
    };

    saveProfilePhoto = () => {
        const {form} = this.state;
        //CASE 1: User is authenticated => UPDATE request
        if (this.props.isAuthenticated) {
            UserService.updateProfileImage(form.image)
                .then((response) => {
                    store.dispatch(action.authSetUser(response.data));

                    Snackbar.show({
                        title          : 'Your profile image has been updated!',
                        duration       : Snackbar.LENGTH_SHORT,
                        backgroundColor: colors.green
                    });
                })
                .catch(error => {
                    console.log(error.response);
                    this.setState(cloneDeep(initialState));
                })
               .finally(() => { this.setState({isSubmitButtonLoading: false}); });
        }
    };

    submit = form => {
        //CASE 1: User is authenticated => UPDATE request
        if (this.props.isAuthenticated) {
            UserService.updateProfile(form)
                .then(r => {
                    this.setFormData(r.data.user);
                    store.dispatch(action.authSetUser(r.data));

                    Snackbar.show({
                        title: 'Your profile has been updated!',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: colors.green,
                    });
                })
                .catch(() => { this.setState(cloneDeep(initialState)); })
                .finally(() => { this.setState({isSubmitButtonLoading: false}); });
        }
        //CASE 2: User is not authenticated => CREATE request
        else {
            UserService.register(form)
                .then(() => {
                    Snackbar.show({
                        title: 'Your account has been created!',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: colors.green
                    });
                })
                .finally(() => { this.setState({isSubmitButtonLoading: false}); });
        }
    };

    //===========================UTILITIES==================================
    setFormData = data => {
        const form = {
            id                   : data.id,
            username             : data.username,
            first_name           : data.first_name,
            last_name            : data.last_name,
            email                : data.email,
            phone                : data.phone,
            image                : data.image_url ? data.image_url : null,
            password             : '',
            password_confirmation: '',
        };
        this.setState({form});
    };

    render() {
        const {isAuthenticated} = this.props;
        const {errors, isLoading, passwordConfirmError, isSubmitButtonLoading, isLogoutButtonLoading} = this.state;

        return <Container>
        {isLoading
            ? <Loading/>
            :
            <NoInternetScreen retryRequest={() => this.getProfileInfo()}>
            <ImageBackground
                resizeMode={'cover'}
                style={generalStyles.container}
                source={require('@assets/images/bg_pattern.png')}
            >
                <Content
                    showsVerticalScrollIndicator={false}
                    padder
                >
                    <View style={signUpStyles.heading}>{Platform.OS === 'android'
                        ?
                        <TouchableNativeFeedback
                            style={signUpStyles.imageContainer}
                            background={TouchableNativeFeedback.Ripple(platform.brandPrimary, false)}
                        >
                            {/*TODO Replace react-native-photo-upload with react-native-image-picker*/}
                            <PhotoUpload onPhotoSelect={avatar => { this.onPhotoUpload(avatar); }}>
                                <Image
                                    source={
                                        this.state.form.image
                                            ? {uri: this.state.form.image}
                                            : require('@assets/images/default-user.png')
                                    }
                                    style={signUpStyles.headingImage}
                                >
                                </Image>
                            </PhotoUpload>
                        </TouchableNativeFeedback>

                        :
                        <TouchableHighlight
                            style={signUpStyles.imageContainer}
                            background={TouchableNativeFeedback.Ripple(platform.brandPrimary, false)}
                        >
                            <PhotoUpload onPhotoSelect={avatar => { this.onPhotoUpload(avatar); }}>
                                <Image
                                    source={
                                        this.state.form.image
                                            ? {uri: this.state.form.image}
                                            : require('@assets/images/default-user.png')
                                    }
                                    style={signUpStyles.headingImage}
                                >
                                </Image>
                            </PhotoUpload>
                        </TouchableHighlight>
                    }</View>

                    <Card>
                    <CardItem>
                        <Form style={signUpStyles.form}>
                            <Input
                                label='Username'
                                name='username'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.firstNameRef.refs.firstNameRefInner.focus(); }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.username}
                                icon='person'
                                error={errors.first('username')}
                            />
                            <Input
                                label='First Name'
                                name='first_name'
                                returnKeyType='next'
                                ref={firstNameRef => this.firstNameRef = firstNameRef}
                                refInner='firstNameRefInner'
                                onSubmitEditing={() => { this.lastNameRef.refs.lastNameRefInner.focus(); }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.first_name}
                                icon='person'
                                error={errors.first('first_name')}
                            />
                            <Input
                                label='Last Name'
                                name='last_name'
                                returnKeyType='next'
                                ref={lastNameRef => this.lastNameRef = lastNameRef}
                                refInner='lastNameRefInner'
                                onSubmitEditing={() => { this.emailRef.refs.emailRefInner.focus(); }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.last_name}
                                icon='person'
                                error={errors.first('last_name')}
                            />
                            <Input
                                label='Email'
                                name='email'
                                returnKeyType='next'
                                ref={emailRef => this.emailRef = emailRef}
                                refInner='emailRefInner'
                                onSubmitEditing={() => { this.phoneRef.refs.phoneRefInner.focus(); }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.email}
                                icon='mail'
                                error={errors.first('email')}
                            />
                            <Input
                                label='Phone'
                                name='phone'
                                returnKeyType='next'
                                ref={phoneRef => this.phoneRef = phoneRef}
                                refInner='phoneRefInner'
                                onSubmitEditing={() => { this.passwordRef.refs.passwordRefInner.focus(); }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.phone}
                                icon='phone-portrait'
                                error={errors.first('phone')}
                            />
                            <Input
                                label={isAuthenticated ? 'New password' : 'Password'}
                                secureTextEntry
                                name='password'
                                returnKeyType='next'
                                ref={passwordRef => this.passwordRef = passwordRef}
                                refInner='passwordRefInner'
                                onSubmitEditing={() => {
                                    this.passwordConfirmationRef.refs.passwordConfirmationRefInner.focus();
                                }}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.password}
                                icon='md-lock-closed'
                                error={errors.first('password')}
                                visibilityToggle
                            />
                            <Input
                                label={isAuthenticated ? 'Confirm new password' : 'Password confirmation'}
                                secureTextEntry
                                name='password_confirmation'
                                returnKeyType='done'
                                ref={passwordConfirmationRef => this.passwordConfirmationRef = passwordConfirmationRef}
                                refInner='passwordConfirmationRefInner'
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={this.onChangeText}
                                blurOnSubmit={false}
                                value={this.state.form.password_confirmation}
                                icon='md-lock-closed'
                                error={passwordConfirmError}
                                visibilityToggle
                            />

                            {!isAuthenticated && <>
                                <ListItem style={signUpStyles.listItem}>
                                    <CheckBox
                                        checked={this.state.form.hasUserAgreement}
                                        onPress={() => {
                                            this.onChangeText('hasUserAgreement', !this.state.form.hasUserAgreement);
                                        }}
                                        color={colors.primary.main}
                                        error={errors.first('hasUserAgreement')}
                                    />
                                    <Text
                                        style={signUpStyles.listItemText}
                                        onPress={() => { this.setState({hasVisibleTermsAndConditions: true}); }}
                                    >
                                        {'Terms and conditions'}
                                    </Text>
                                </ListItem>

                                {errors.has('hasUserAgreement') &&
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#b2000d',
                                        marginTop: 2,
                                    }}>
                                        {errors.first('hasUserAgreement')}
                                    </Text>
                                }
                            </>}


                            <Button
                                title={isAuthenticated
                                    ? 'Update'
                                    : 'Sign Up'
                                }
                                onPress={this.handleSubmit}
                                isLoading={isSubmitButtonLoading}
                            />

                            {isAuthenticated && <View style={generalStyles.buttonsContainerView}>
                                <View style={generalStyles.leftButton}>
                                    <Button
                                        title='Delete'
                                        onPress={this.deleteUserProfileConfirmation}
                                        isLoading={isLoading}
                                    />
                                </View>
                                <View style={{
                                    ...generalStyles.rightButton,
                                    flexGrow: Dimensions.get('window').width <= 320 ? 1.5 : 1
                                }}>
                                    <Button
                                        title='Log Out'
                                        onPress={this.logout}
                                        isLoading={isLogoutButtonLoading}
                                    />
                                </View>
                            </View>}
                        </Form>
                    </CardItem>
                    </Card>

                    <Dialog
                        visible={this.state.hasVisibleTermsAndConditions}
                        dialogTitle={
                            <DialogTitle
                                title={'Terms and Conditions'}
                                style={{backgroundColor: colors.primary.main}}
                                textStyle={{color: colors.white}}
                            />
                        }
                        width={this.state.screenWidth}
                        height={this.state.screenHeight}
                        onTouchOutside={() => this.setState({hasVisibleTermsAndConditions: false})}
                    >
                        <DialogContent>
                            <View style={signUpStyles.dialogContentView}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text>
                                        {'Terms and conditions text goes here'}
                                    </Text>

                                    <DialogButton
                                        onPress={() => this.setState({hasVisibleTermsAndConditions: false})}
                                        style={signUpStyles.dialogButton}
                                        text='Close'
                                    />
                                </ScrollView>
                            </View>
                        </DialogContent>
                    </Dialog>
                </Content>
            </ImageBackground>
            </NoInternetScreen>
        }
        </Container>;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.Auth.isAuthenticated,
});
const mapDispatchToProps = dispatch => ({
    removeUserData: () => dispatch(action.authLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
