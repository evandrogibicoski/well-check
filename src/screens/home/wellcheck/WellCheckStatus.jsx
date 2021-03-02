// REACT ==================================================
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Linking, Platform, ScrollView} from 'react-native';
import {withNavigation} from 'react-navigation';
import Moment from 'react-moment';
import {Grid, Col} from 'react-native-easy-grid';

import messaging from '@react-native-firebase/messaging';

// STYLING ================================================
import {
    Body, Container, Card, CardItem, Text, Header, Title, Left, Right, Button as NativeButton, Icon,
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
import {CheckInService, ResetRequestService, SurveySubmissionService} from '@services';

// MISC ===================================================
import _                     from 'lodash';
import Utils                 from '@src/Utils';
import wellCheckStatusStyles from '../../../assets/styles/screens/wellCheckStatusStyles';

const initialState = {
    isLoading: false,

    // Survey submission data (to be retrieve on component mount)
    submission: null,

    // Selected employer for displaying contact information
    selectedEmployer: {},

    // Check-in data (to be retrieve on component mount)
    checkIn: null,
};

class WellCheckStatus extends Component {
    state = _.cloneDeep(initialState);

    initialize = () => {
        this.setState({initialState}, () => {
            this.setState({selectedEmployer: this.props.user.employers[0]});
        });

        if (!Utils.isOffline() && this.props.isAuthenticated) {
            this.retrieveWellCheck();
            this.retrieveCheckIn();
        }
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

    retrieveCheckIn = () => {
        CheckInService.get()
            .then(r => this.setState({checkIn: r.data.check_in}))
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
            {isLoading
                ? <Loading/>
                :
                <NoInternetScreen retryRequest={() => this.retrieveWellCheck()}>
                {/*contentContainerStyle={{flexGrow: 1}}*/}
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    {/* CASE 1 - No active latest submission found */}
                    {(submission === null) && <>
                        <Card style={[wellCheckStatusStyles.statusCard, wellCheckStatusStyles.defaultStatusCard]}>
                            <Grid>
                                <Col size={40}>
                                    <Body style={{alignItems: 'center'}}>
                                        <Icon type="MaterialCommunityIcons" name="shield-off-outline"
                                            style={{color: '#dddddd', fontSize: 100, marginBottom: 10}}
                                        />
                                    </Body>
                                </Col>

                                <Col size={60} style={{paddingTop: 20, paddingRight: 40}}>
                                    <Body style={{alignItems: 'center'}}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#dddddd',
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                        }}>
                                            It looks like you haven't completed any recent surveys.
                                        </Text>
                                    </Body>
                                </Col>
                            </Grid>
                        </Card>

                        <Body style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center'}}>
                                Please fill in a survey for us:
                            </Text>

                            <Grid style={{alignItems: 'center', maxHeight: 100}}>
                                <Col size={10}></Col>
                                <Col size={65}>
                                    <Button
                                        disabled={isLoading}
                                        title='Start Well Check'
                                        onPress={() => this.props.navigation.navigate('WellCheckSurvey')}
                                    />
                                </Col>
                                <Col size={15} style={{paddingLeft: 10}}>
                                    <Button
                                        bordered
                                        isLoading={isLoading}
                                        title={<Icon style={{color: colors.secondary.main}} name="menu"/>}
                                        onPress={() => {
                                            return ActionSheet.show({
                                                options: ['Refresh', 'Back'],
                                                cancelButtonIndex: 1,
                                                title: 'Actions',
                                            }, buttonIndex => {
                                                switch (buttonIndex) {
                                                    // Refresh
                                                    case 0: return this.retrieveWellCheck();
                                                }
                                            });
                                        }}
                                    />
                                </Col>
                                <Col size={10}></Col>
                            </Grid>
                        </Body>
                    </>}

                    {/* CASE 2 - Go To Work */}
                    {(submission != null && submission.result === 'clear') && <>
                        <Card style={[wellCheckStatusStyles.statusCard, wellCheckStatusStyles.clearStatusCard]}>
                            <Grid>
                                <Col size={40}>
                                    <Body style={{alignItems: 'center'}}>
                                        <Icon name="shield-checkmark"
                                            style={{color: 'white', fontSize: 100, marginBottom: 10}}
                                        />
                                    </Body>
                                </Col>

                                <Col size={60} style={{paddingTop: 20, paddingRight: 40}}>
                                    <Body style={{alignItems: 'center'}}>
                                        <View
                                            style={{
                                                backgroundColor: 'white',
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                        <Text
                                            style={{
                                                color: colors.secondary.main,
                                                fontWeight: 'bold',
                                                fontSize: 30,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {this.state.checkIn ? 'CHECKED-IN' : 'GO TO WORK'}
                                        </Text>
                                        </View>
                                        {!this.state.checkIn && <Text
                                            style={{
                                                textAlign: 'center',
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                marginTop: 5,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            as scheduled
                                        </Text>}
                                    </Body>
                                </Col>
                            </Grid>
                        </Card>

                        <Body style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>
                                {user.first_name} {user.last_name}'s WellCheck
                            </Text>

                            <Moment format="M/D/YYYY h:mm A" element={Text} date={submission.created_at}/>

                            <Grid style={{alignItems: 'center', maxHeight: 100}}>
                                <Col size={10}></Col>
                                <Col size={65}>
                                    <Button
                                        isLoading={isLoading}
                                        title='Workplace Check-In'
                                        onPress={() => this.props.screenProps.rootNavigation.navigate('CheckIn')}
                                    />
                                </Col>
                                <Col size={15} style={{paddingLeft: 10}}>
                                    <Button
                                        bordered
                                        isLoading={isLoading}
                                        title={<Icon style={{color: colors.secondary.main}} name="menu"/>}
                                        onPress={() => {
                                            return ActionSheet.show({
                                                options: ['Refresh', 'CHECKIN (Scan Code)', 'New WellCheck', 'Back'],
                                                cancelButtonIndex: 3,
                                                title: 'Actions',
                                            }, buttonIndex => {
                                                switch (buttonIndex) {
                                                    // Refresh
                                                    case 0:
                                                        return this.retrieveWellCheck();
                                                    // CHECKIN (Scan Code)
                                                    case 1:
                                                        return this.props.screenProps.rootNavigation.navigate('CheckIn');
                                                    // New WellCheck
                                                    case 2:
                                                        return this.props.navigation.navigate('WellCheckSurvey');
                                                }
                                            });
                                        }}
                                    />
                                </Col>
                                <Col size={10}></Col>
                            </Grid>
                        </Body>
                    </>}

                    {/* CASE 3 - Stay Home */}
                    {(submission != null && submission.result === 'not_clear') && <>
                        <Card style={[wellCheckStatusStyles.statusCard, wellCheckStatusStyles.notClearStatusCard]}>
                            <Grid>
                                <Col size={40}>
                                    <Body style={{alignItems: 'center', paddingTop: 25}}>
                                        <Icon name="warning-sharp"
                                            style={{color: 'white', fontSize: 100, marginBottom: 10}}
                                        />
                                    </Body>
                                </Col>

                                <Col size={60} style={{paddingRight: 40}}>
                                    <Body style={{alignItems: 'center'}}>
                                        <View
                                            style={{
                                                backgroundColor: 'white',
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                        <Text
                                            style={{
                                                color: colors.red,
                                                fontWeight: 'bold',
                                                fontSize: 30,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {Utils.hasPermissionTo('read_demo_survey') ? 'WE\'RE SORRY' :'STAY HOME'}
                                        </Text>
                                        </View>
                                        {!this.state.checkIn && <Text
                                            style={{
                                                textAlign: 'center',
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                marginTop: 5,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {Utils.hasPermissionTo('read_demo_survey')
                                                ? 'we\'re working on improving your workplace'
                                                : 'as scheduled by the organization'
                                            }
                                        </Text>}

                                        {!Utils.hasPermissionTo('read_demo_survey') &&
                                            <Text
                                                style={{
                                                    marginTop: 30,
                                                    textTransform: 'uppercase',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Please be safe and healthy.
                                                Monitor your symptoms.
                                            </Text>
                                        }
                                    </Body>
                                </Col>
                            </Grid>
                        </Card>

                        <Body style={{flex: 1, justifyContent: 'center'}}>
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
                                    {Platform.OS === 'ios' ? 'Supervisor Contact:' : 'COVID Officer Contact:'}
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
                                &nbsp;&nbsp;{Platform.OS === 'ios' ? 'Company Policy' : 'Company COVID Policy'}
                            </Text>}

                            <Text style={{fontWeight: 'bold', marginTop: 15}}>
                                {user.first_name} {user.last_name}'s WellCheck
                            </Text>

                            <Moment format="M/D/YYYY h:mm A" element={Text} date={submission.created_at}/>

                            <Grid style={{alignItems: 'center', maxHeight: 100}}>
                                <Col size={10}></Col>
                                <Col size={65}>
                                    <Button
                                        isLoading={isLoading}
                                        title="Request Reset"
                                        onPress={this.requestReset}
                                    />
                                </Col>
                                <Col size={15} style={{paddingLeft: 10}}>
                                    <Button
                                        bordered
                                        isLoading={isLoading}
                                        title={<Icon style={{color: colors.secondary.main}} name="menu"/>}
                                        onPress={() => {
                                            return ActionSheet.show({
                                                options: ['Refresh', 'Contact Company', 'Request Reset', 'Back'],
                                                cancelButtonIndex: 3,
                                                title: 'Actions',
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
                                        }}
                                    />
                                </Col>
                                <Col size={10}></Col>
                            </Grid>
                        </Body>
                    </>}
                </ScrollView>
                </NoInternetScreen>
            }
        </Container></Root>;
    }
};

export default connect(state => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,
}))(withNavigation(WellCheckStatus));
