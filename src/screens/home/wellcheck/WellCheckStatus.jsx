// REACT ==================================================
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ImageBackground, View, Linking} from 'react-native';
import {withNavigation} from 'react-navigation';
import Moment from 'react-moment';

import messaging from '@react-native-firebase/messaging';

// STYLING ================================================
import {
    Body, Container, Content, Card, CardItem, Text, Header, Title, Left, Right, Button as NativeButton, Icon,
    ActionSheet, Root, Picker
} from 'native-base';

import generalStyles from '@assets/styles/generalStyles';
import {colors}      from '@assets/theme';

// COMPONENTS =============================================
import Snackbar from 'react-native-snackbar';
import Button from '@components/common/Button';
import {Loading} from '@components/common/Loading';
import NoInternetScreen from '@components/common/NoInternetScreen';

// SERVICES ===============================================
import {ResetRequestService, SurveySubmissionService} from '@services';

// MISC ===================================================
import _ from 'lodash';
import Utils from '@src/Utils';

const initialState = {
    isLoading: false,

    // Survey submission data (to be retrieve on component mount)
    submission: null,

    // Selected employer for displaying contact information
    selectedEmployer: {},
};

class WellCheckStatus extends Component {
    state = _.cloneDeep(initialState);

    initialize = () => {
        this.setState({initialState}, () => {
            this.setState({selectedEmployer: this.props.user.employers[0]});
        });

        if (!Utils.isOffline() && this.props.isAuthenticated) this.retrieveWellCheck();
    };

    componentDidMount() {
        this.initialize();

        setTimeout(() => {
            this.focusListener     = this.props.navigation.addListener('willFocus', this.initialize);
            this.rootFocusListener = this.props.screenProps.rootNavigation.addListener('willFocus', this.initialize);
        }, 1000);

        this.requestNotificationPermission();
    }
    componentDidUmount() {
        this.focusListener.remove();
        this.rootFocusListener.remove();
    }

    retrieveWellCheck = () => {
        this.setState({isLoading: true}, () => {
            SurveySubmissionService.get()
                .then(r => this.setState({submission: r.data.submission}))
                .finally(() => this.setState({isLoading: false}));
        });
    };

    requestReset = () => {
        if (this.state.isLoading) return;

        this.setState({isLoading: true}, () => {
            ResetRequestService.create()
                .then(() => {
                    Snackbar.show({
                        text           : 'Reset request sent!',
                        duration       : Snackbar.LENGTH_SHORT,
                        backgroundColor: colors.green,
                    });
                })
                .finally(() => this.retrieveWellCheck());
        });
    };

    requestNotificationPermission = async () => {
        const authStatus = await messaging().requestPermission();

        // const enabled =
        //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        // if (enabled) ...
    };

    render() {
        const {isLoading, submission, selectedEmployer} = this.state;
        const {user} = this.props;

        return <Root><Container>
            <Header noLeft
                style={{ backgroundColor: '#2ec647' }}
                androidStatusBarColor={'#2ec647'}
            >
                <Body>
                    <Title style={{color: 'white'}}>Well Check Status</Title>
                </Body>
                <Right>
                    <NativeButton transparent
                        disabled={isLoading}
                        onPress={() => {
                            if (submission === null) {
                                return ActionSheet.show({
                                    options          : ['Refresh', 'Back'],
                                    cancelButtonIndex: 1,
                                    title            : 'Actions',
                                }, buttonIndex => {
                                    switch (buttonIndex) {
                                        // Refresh
                                        case 0: return this.retrieveWellCheck();
                                    }
                                });
                            }

                            switch (submission.result) {
                                case 'not_clear':
                                    return ActionSheet.show({
                                        options          : ['Refresh', 'Contact Company', 'Request Reset', 'Back'],
                                        cancelButtonIndex: 3,
                                        title            : 'Actions',
                                    }, buttonIndex => {
                                        switch (buttonIndex) {
                                            // Refresh
                                            case 0: return this.retrieveWellCheck();
                                            // Contact Company
                                            case 1: return this.state.selectedEmployer.id
                                                ? Linking.openURL(this.state.selectedEmployer.contact_website)
                                                : undefined;
                                            // Request Reset
                                            case 2: return this.requestReset();
                                        }
                                    });

                                case 'clear':
                                    return ActionSheet.show({
                                        options          : ['Refresh', 'CHECKIN (Scan Code)', 'New WellCheck', 'Back'],
                                        cancelButtonIndex: 3,
                                        title            : 'Actions',
                                    }, buttonIndex => {
                                        switch (buttonIndex) {
                                            // Refresh
                                            case 0: return this.retrieveWellCheck();
                                            // CHECKIN (Scan Code)
                                            case 1: return this.props.screenProps.rootNavigation.navigate('CheckIn');
                                            // New WellCheck
                                            case 2: return this.props.navigation.navigate('WellCheckSurvey');
                                        }
                                    });
                            }
                        }}
                    >
                        <Icon name='menu' style={{color: 'white'}}/>
                    </NativeButton>
                </Right>
            </Header>

            {isLoading
                ? <Loading/>
                :
                <NoInternetScreen retryRequest={() => this.retrieveWellCheck()}>
                <ImageBackground
                    resizeMode={'cover'}
                    style={generalStyles.container}
                    source={require('@assets/images/bg_pattern.png')}
                >
                <Content padder
                    showsVerticalScrollIndicator
                >
                <Card style={{paddingBottom: 10, width: '100%'}}>
                    {/* CASE 1 - No active latest submission found */}
                    {(submission === null) && <CardItem>
                    <Body style={{alignItems: 'center'}}>

                        <Icon name="shield-checkmark"
                            style={{color: '#dddddd', fontSize: 70, marginBottom: 10}}
                        />
                        {/*<Text style={{textAlign: 'center'}}>
                            Oops... we couldn't find any valid recent well check for you.
                        </Text>*/}
                        {/*<Text style={{textAlign: 'center', marginTop: 15}}>*/}
                        <Text style={{textAlign: 'center'}}>
                            Please fill in a survey for us:
                        </Text>
                        <Button
                            disabled={isLoading}
                            title='Start Well Check'
                            onPress={() => this.props.navigation.navigate('WellCheckSurvey')}
                        />
                    </Body>
                    </CardItem>}

                    {/* CASE 2 - Go To Work */}
                    {(submission != null && submission.result === 'clear') && <CardItem>
                    <Body style={{alignItems: 'center'}}>
                        <Icon name="shield-checkmark-sharp"
                            style={{color: '#2ec647', fontSize: 70}}
                        />
                        <Text style={{color: '#2ec647', fontWeight: 'bold', fontSize: 25, textAlign: 'center'}}>
                            GO TO WORK
                        </Text>
                        <Text style={{textAlign: 'center'}}>
                            as scheduled
                        </Text>

                        <Text style={{fontWeight: 'bold', marginTop: 15}}>
                            {user.first_name} {user.last_name}'s WellCheck
                        </Text>

                        <Moment format="M/D/YYYY h:mm A" element={Text} date={submission.created_at}/>

                        <Button
                            isLoading={isLoading}
                            title='Workplace Check-In'
                            onPress={() => this.props.screenProps.rootNavigation.navigate('CheckIn')}
                        />
                    </Body>
                    </CardItem>}

                    {/* CASE 3 - Stay Home */}
                    {(submission != null && submission.result === 'not_clear') && <CardItem>
                    <Body style={{alignItems: 'center'}}>
                        <Icon name="warning-sharp"
                            style={{color: '#ff1616', fontSize: 70}}
                        />
                        <Text style={{color: '#ff1616', fontWeight: 'bold', fontSize: 25, textAlign: 'center'}}>
                            STAY HOME
                        </Text>
                        <Text style={{textAlign: 'center'}}>
                            as scheduled
                        </Text>

                        <Text style={{marginTop: 20}}>
                            Please be safe and healthy.
                        </Text>
                        <Text style={{marginBottom: 12}}>
                            Monitor your symptoms.
                        </Text>

                        {!!submission.reset_requests.length && <>
                            <Text>
                                <Text style={{color: 'red', fontWeight: 'bold'}}>! </Text>
                                You requested a survey reset at:
                            </Text>

                            <Moment format="M/D/YYYY h:mm A" element={Text}
                                date={submission.reset_requests[0].created_at}
                            />
                        </>}

                        {/* NOTE this below dropdown can be used if multiple organizations are desired */}
                        {/*<Text style={{textAlign: 'left', alignSelf: 'stretch', marginLeft: 35}}>
                            Company Contact:
                        </Text>
                        <Picker note
                            mode="dropdown"
                            style={{width: 300}}
                            selectedValue={selectedEmployer.id}
                            onValueChange={value => this.setState({
                                selectedEmployer: _.find(user.employers, {id: value})
                            })}
                        >
                            {user.employers.map(employer => <Picker.Item key={employer.id}
                                label={employer.name}
                                value={employer.id}
                            />)}
                        </Picker>*/}

                        {/*<Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                            Contact for {selectedEmployer.name}:
                        </Text>*/}

                        {!!(selectedEmployer.id && selectedEmployer.representative) && <>
                            <Text style={{fontWeight: 'bold', textAlign: 'center', marginTop: 12}}>
                                COVID Officer Contact:
                            </Text>

                            <Text style={{color: '#2288c0', fontWeight: 'bold'}}>
                                {selectedEmployer.representative.first_name} {selectedEmployer.representative.last_name}
                            </Text>

                            {selectedEmployer.representative.phone &&
                            <Text style={{color: '#2288c0', fontWeight: 'bold', marginTop: 15}}
                                onPress={() => Linking.openURL(`tel:${selectedEmployer.representative.phone}`)}
                            >
                                <Icon
                                    type="Feather" name="phone"
                                    style={{fontSize: 17, color: '#2288c0'}}
                                />
                                &nbsp;&nbsp;{Utils.formatPhoneNumber(selectedEmployer.representative.phone)}
                            </Text>}

                            {selectedEmployer.representative.email &&
                            <Text style={{color: '#2288c0', fontWeight: 'bold', marginTop: 15}}
                                onPress={() => Linking.openURL(`mailto:${selectedEmployer.representative.email}`)}
                            >
                                <Icon
                                    type="Feather" name="mail"
                                    style={{fontSize: 17, color: '#2288c0'}}
                                />
                                &nbsp;&nbsp;{selectedEmployer.representative.email}
                            </Text>}
                        </>}

                        {selectedEmployer.contact_website &&
                        <Text style={{color: '#2288c0', fontWeight: 'bold', marginTop: 15}}
                            onPress={() => Linking.openURL(selectedEmployer.contact_website)}
                        >
                            <Icon
                                type="Feather" name="external-link"
                                style={{fontSize: 17, color: '#2288c0'}}
                            />
                            {/*&nbsp;&nbsp;Tap here for more info*/}
                            &nbsp;&nbsp;Company COVID Policy
                        </Text>}

                        <Text style={{fontWeight: 'bold', marginTop: 15}}>
                            {user.first_name} {user.last_name}'s WellCheck
                        </Text>

                        <Moment format="M/D/YYYY h:mm A" element={Text} date={submission.created_at}/>

                        <View style={generalStyles.buttonsContainerView}>
                            <View style={generalStyles.leftButton}>
                                <Button
                                    bordered
                                    isLoading={isLoading}
                                    title={<Icon style={{color: colors.green}} name="reload"/>}
                                    onPress={this.retrieveWellCheck}
                                />
                            </View>
                            <View style={{...generalStyles.rightButton, flexGrow: 3.5}}>
                                <Button
                                    isLoading={isLoading}
                                    title="Request Reset"
                                    onPress={this.requestReset}
                                />
                            </View>
                        </View>
                    </Body>
                    </CardItem>}
                </Card>
                </Content>
                </ImageBackground>
                </NoInternetScreen>
            }
        </Container></Root>;
    }
};

export default connect(state => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,
}))(withNavigation(WellCheckStatus));
