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
            UserService.registerWithDefaultOrganization(form)
                .then(() => {
                    Snackbar.show({
                        title: 'Your account has been created!',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: colors.green
                    });
                })
                .finally(() => {
                    this.setState({isSubmitButtonLoading: false});
                    this.props.navigation.push('LogInForm');
                });
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
                                        DISCLAIMER, PRIVACY POLICY
                                        Last updated November 17th 2020

                                        WellCheck LLC respects the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application (the "Application"). Please read this Privacy Policy carefully. IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, PLEASE DO NOT ACCESS THE APPLICATION.

                                        We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Application after the date such revised Privacy Policy is posted.

                                        This Privacy Policy does not apply to the third-party online/mobile store from which you install the Application or make payments, including any in-game virtual items, which may also collect and use data about you. We are not responsible for any of the data collected by any such third party.

                                        COLLECTION OF YOUR INFORMATION
                                        We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content and materials you use, and includes:

                                        Personal Data
                                        Demographic and other personally identifiable information (such as your name and email address) that you voluntarily give to us when choosing to participate in various activities related to the Application, such as chat, posting messages in comment sections or in our forums, liking posts, sending feedback, and responding to surveys. If you choose to share data about yourself via your profile, online chat, or other interactive areas of the Application, please be advised that all data you disclose in these areas is public and your data will be accessible to anyone who accesses the Application.

                                        Derivative Data
                                        Information our servers automatically collect when you access the Application, such as your native actions that are integral to the Application, including liking, re-blogging, or replying to a post, as well as other interactions with the Application and other users via server log files.

                                        Financial Data
                                        Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Application. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, Stripe, and you are encouraged to review their privacy policy and contact them directly for responses to your questions.

                                        Facebook Permissions
                                        The Application may by default access your Facebook basic account information, including your name, email, gender, birthday, current city, and profile picture URL, as well as other information that you choose to make public. We may also request access to other permissions related to your account, such as friends, checkins, and likes, and you may choose to grant or deny us access to each individual permission. For more information regarding Facebook permissions, refer to the Facebook Permissions Reference page.

                                        Data from Social Networks
                                        User information from social networking sites, such as Facebook, Twitter, Instagram, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks. This information may also include the contact information of anyone you invite to use and/or join the Application.

                                        Geo-Location Information
                                        We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using the Application, to provide location-based services. If you wish to change our access or permissions, you may do so in your device's settings.

                                        Mobile Device Access
                                        We may request access or permission to certain features from your mobile device. If you wish to change our access or permissions, you may do so in your device's settings.

                                        We request camera access for QR code scanning as to facilitate workplace check-in.
                                        We request voice recording access for text-to-speech functionality.
                                        Mobile Device Data
                                        Device information such as your mobile device ID number, model, and manufacturer, version of your operating system, phone number, country, location, and any other data you choose to provide.

                                        Push Notifications
                                        We may request to send you push notifications regarding your account or the Application. If you wish to opt-out from receiving these types of communications, you may turn them off in your device's settings.

                                        Third-Party Data
                                        Information from third parties, such as personal information or network friends, if you connect your account to the third party and grant the Application permission to access this information.

                                        Data From Contests, Giveaways, and Surveys
                                        Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.

                                        USE OF YOUR INFORMATION
                                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:

                                        Administer sweepstakes, promotions, and contests.
                                        Assist law enforcement and respond to subpoena.
                                        Compile anonymous statistical data and analysis for use internally or with third parties.
                                        Create and manage your account.
                                        Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Application to you.
                                        Email you regarding your account or order.
                                        Enable user-to-user communications.
                                        Fulfill and manage purchases, orders, payments, and other transactions related to the Application.
                                        Generate a personal profile about you to make future visits to the Application more personalized.
                                        Increase the efficiency and operation of the Application.
                                        Monitor and analyze usage and trends to improve your experience with the Application.
                                        Notify you of updates to the Application.
                                        Offer new products, services, mobile applications, and/or recommendations to you.
                                        Perform other business activities as needed.
                                        Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.
                                        Process payments and refunds.
                                        Request feedback and contact you about your use of the Application.
                                        Resolve disputes and troubleshoot problems.
                                        Respond to product and customer service requests.
                                        Send you a newsletter.
                                        Solicit support for the Application.
                                        DISCLOSURE OF YOUR INFORMATION
                                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:

                                        By Law or to Protect Rights
                                        If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.

                                        Third-Party Service Providers
                                        We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.

                                        Marketing Communications
                                        With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.

                                        Interactions with Other Users
                                        If you interact with other users of the Application, those users may see your name, profile photo, and descriptions of your activity, including sending invitations to other users, chatting with other users, liking posts, following blogs.

                                        Online Postings
                                        When you post comments, contributions or other content to the Applications, your posts may be viewed by all users and may be publicly distributed outside the Application in perpetuity

                                        Third-Party Advertisers
                                        We may use third-party advertising companies to serve ads when you visit the Application. These companies may use information about your visits to the Application and other websites that are contained in web cookies in order to provide advertisements about goods and services of interest to you.

                                        Affiliates
                                        We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.

                                        Business Partners
                                        We may share your information with our business partners to offer you certain products, services or promotions.

                                        Offer Wall
                                        The Application may display a third-party-hosted "offer wall". Such an offer wall allows third-party advertisers to offer virtual currency, gifts, or other items to users in return for acceptance and completion of an advertisement offer. Such an offer wall may appear in the Application and be displayed to you based on certain data, such as your geographic area or demographic information. When you click on an offer wall, you will leave the Application. A unique identifier, such as your user ID, will be shared with the offer wall provider in order to prevent fraud and properly credit your account.

                                        Social Media Contacts
                                        If you connect to the Application through a social network, your contacts on the social network will see your name, profile photo, and descriptions of your activity.

                                        Other Third Parties
                                        We may share your information with advertisers and investors for the purpose of conducting general business analysis. We may also share your information with such third parties for marketing purposes, as permitted by law.

                                        Sale or Bankruptcy
                                        If we reorganize or sell all or a portion of our assets, undergo a merger, or are acquired by another entity, we may transfer your information to the successor entity. If we go out of business or enter bankruptcy, your information would be an asset transferred or acquired by a third party. You acknowledge that such transfers may occur and that the transferee may decline honor commitments we made in this Privacy Policy.

                                        We are not responsible for the actions of third parties with whom you share personal or sensitive data, and we have no authority to manage or control third-party solicitations. If you no longer wish to receive correspondence, emails or other communications from third parties, you are responsible for contacting the third party directly.

                                        TRACKING TECHNOLOGIES
                                        Cookies and Web Beacons
                                        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Application to help customize the Application and improve your experience. When you access the Application, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Application. You may not decline web beacons. However, they can be rendered ineffective by declining all cookies or by modifying your web browser's settings to notify you each time a cookie is tendered, permitting you to accept or decline cookies on an individual basis.

                                        Internet-Based Advertising
                                        Additionally, we may use third-party software to serve ads on the Application, implement email marketing campaigns, and manage other interactive marketing initiatives. This third-party software may use cookies or similar tracking technology to help manage and optimize your online experience with us. For more information about opting-out of interest-based ads, visit the Network Advertising Initiative Opt-Out Tool or Digital Advertising Alliance Opt-Out Tool.

                                        Website Analytics
                                        We may also partner with selected third-party vendors, such as Google Analytics to allow tracking technologies and remarketing services on the Application through the use of first party cookies and third-party cookies, to, among other things, analyze and track users' use of the Application, determine the popularity of certain content, and better understand online activity. By accessing the Application, you consent to the collection and use of your information by these third-party vendors. You are encouraged to review their privacy policy and contact them directly for responses to your questions. We do not transfer personal information to these third-party vendors.

                                        You should be aware that getting a new computer, installing a new browser, upgrading an existing browser, or erasing or otherwise altering your browser's cookies files may also clear certain opt-out cookies, plug-ins, or settings.

                                        THIRD-PARTY WEBSITES
                                        The Application may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Application, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information. We are not responsible for the content or privacy and security practices and policies of any third parties, including other sites, services or applications that may be linked to or from the Application.

                                        SECURITY OF YOUR INFORMATION
                                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.

                                        POLICY FOR CHILDREN
                                        We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.

                                        CONTROLS FOR DO-NOT-TRACK FEATURES
                                        Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy.

                                        OPTIONS REGARDING YOUR INFORMATION
                                        Account Information
                                        You may at any time review or change the information in your account or terminate your account by:

                                        Logging into your account settings and updating your account
                                        Contacting us using the contact information provided below
                                        Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.

                                        Emails and Communications
                                        If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:

                                        Noting your preferences at the time you register your account with the Application
                                        Logging into your account settings and updating your preferences.
                                        Contacting us using the contact information provided below.
                                        If you no longer wish to receive correspondence, emails, or other communications from third parties, you are responsible for contacting the third party directly.
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
