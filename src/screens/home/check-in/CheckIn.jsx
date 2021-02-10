import React, {Component}                   from 'react';
import {Container, Content, Icon, Button}   from 'native-base';
import {Text, View, Dimensions, StyleSheet} from 'react-native';
import Moment from 'react-moment';

import {colors}                     from '@assets/theme';
import QRCodeScanner                from 'react-native-qrcode-scanner';
import Snackbar                     from 'react-native-snackbar';
import UserAvatar                   from 'react-native-user-avatar';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import {connect}                    from 'react-redux';
import {withNavigation}             from 'react-navigation';
import _                            from 'lodash';
import Utils                        from '@src/Utils';
import LinearGradient               from 'react-native-linear-gradient';

import {CheckInService, SurveySubmissionService} from '@services';

const initialState = {
    // Integers
    screenWidth : Dimensions.get('screen').width * 0.9,
    screenHeight: Dimensions.get('screen').height * 0.9,

    // Booleans
    scan: false,
    ScanResult: false,

    // Objects
    result: null,

    // Check-in data (to be retrieve on component mount)
    checkIn: null,
}

class CheckIn extends Component {
    state = _.cloneDeep(initialState);

    initialize = () => {
        this.setState({initialState});

        if (!Utils.isOffline() && this.props.isAuthenticated) this.retrieveCheckIn();
    };

    componentDidMount() {
        this.initialize();

        setTimeout(() => {
            this.focusListener = this.props.navigation.addListener('willFocus', this.initialize);
        }, 1000);

        // Listeners
        Dimensions.addEventListener('change', () => this.checkScreenDimensions());
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', () => this.checkScreenDimensions());
    }

    retrieveCheckIn = () => {
        this.setState({isLoading: true}, () => {
            CheckInService.get()
                .then(r => this.setState({checkIn: r.data.check_in}))
                .finally(() => this.setState({isLoading: false}));
        });
    };

    checkScreenDimensions = () => {
        this.setState({
            screenWidth : Dimensions.get('screen').width * 0.9,
            screenHeight: Dimensions.get('screen').height * 0.9,
        });
    };

    retrieveWellCheck = () => {
        return SurveySubmissionService.get();
    };

    onSuccess = e => {
        this.setState({
            result    : e.data,
            scan      : false,
            ScanResult: true,
        });

        let data = {};
        if (_.toInteger(e.data)) {
            data = {organization_id: _.toInteger(e.data)};
        }

        CheckInService.create(data)
            .then(r => {
                this.setState({checkIn: r.data.check_in});

                Snackbar.show({
                    text           : 'QR Code scanned!',
                    duration       : Snackbar.LENGTH_LONG,
                    backgroundColor: colors.green,
                });
            });
    };

    activateQR = () => {
        this.retrieveWellCheck()
            .then(r => {
                if (!r.data.submission) {
                    return Snackbar.show({
                        title          : 'Please fill in a WellCheck first!',
                        duration       : Snackbar.LENGTH_LONG,
                        backgroundColor: 'red',
                    });
                } else if (r.data.submission.result === 'not_clear') {
                    return Snackbar.show({
                        title          : 'You are not allowed to check-in at this time!',
                        duration       : Snackbar.LENGTH_LONG,
                        backgroundColor: 'red',
                    });
                }

                this.setState({scan: true});
            });
    };

    scanAgain = () => {
        this.setState({
            scan      : true,
            ScanResult: false,
        });
    };

    render() {
        const {scan} = this.state;

        return <Container style={styles.containerStyle}>
        <LinearGradient
            colors={[colors.primary.dark, colors.primary.main, colors.white]}
            style={styles.gradient}
        >
            <Content padder
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.centerItemsViewStyle}>
                    <Text style={styles.textTitle}>My QR Check In!</Text>

                    {!scan && <View style={styles.centerItemsViewStyle}>
                        <UserAvatar
                            size={moderateScale(90, 0.3)}
                            bgColor="#000"
                            name={this.props.user.first_name + ' ' + this.props.user.last_name}
                            src={this.props.user.image_url}
                        />
                        <Text style={styles.userNameStyle}>
                            {this.props.user.first_name} {this.props.user.last_name}
                        </Text>

                        <View style={styles.cardView}>
                            <View style={styles.heading}>
                                <Icon name="qr-code-outline" style={{fontSize: moderateScale(150, 0.3)}}/>
                            </View>
                        </View>

                        {this.state.checkIn
                            ? <>
                                <Text style={styles.onsiteText}>
                                    <Icon name="checkmark" style={{color: 'white', fontSize: 23}}/> You are on-site
                                </Text>
                                <Moment format="M/D/YYYY h:mm A" element={Text}
                                    date={this.state.checkIn.created_at}
                                />
                            </>
                            : <Button iconLeft onPress={this.activateQR} style={styles.buttonTouchable}>
                                <Icon name="camera-outline"/>
                                <Text style={styles.buttonTextStyle}>Scan QR Code!</Text>
                            </Button>
                        }
                    </View>}

                    {/* Could be useful, do not delete.*/}

                    {/*{ScanResult &&*/}
                    {/*<Fragment>*/}
                    {/*    <Text style={styles.textTitle1}>QR Code has been scanned!</Text>*/}
                    {/*    <View style={ScanResult ? styles.scanCardView : styles.cardView}>*/}
                    {/*        <Text>Type : {result.type}</Text>*/}
                    {/*        <Text>Result : {result.data}</Text>*/}
                    {/*        <Text numberOfLines={1}>RawData: {result.rawData}</Text>*/}
                    {/*        <TouchableOpacity onPress={this.scanAgain} style={styles.buttonTouchable}>*/}
                    {/*            <Text style={styles.buttonTextStyle}>Scan QR Code again!</Text>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </View>*/}
                    {/*</Fragment>*/}
                    {/*}*/}

                    {scan &&
                    <QRCodeScanner
                        reactivate
                        showMarker
                        cameraStyle={styles.cameraStyle}
                        ref={node => { this.scanner = node; }}
                        onRead={this.onSuccess}
                        topContent={<Text style={styles.centerText}> Scan the QR Code: </Text>}
                        bottomContent={
                            <View>
                                <Button style={styles.buttonTouchable}
                                    onPress={() => this.setState({scan: false})}
                                >
                                    <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                                </Button>
                            </View>
                        }
                    />}
                </View>
            </Content>
        </LinearGradient>
        </Container>;
    }
}

const styles = ScaledSheet.create({
    containerStyle: {
        backgroundColor: colors.primary.main,
    },
    gradient: {
        flex: 1,
    },
    centerItemsViewStyle: {
        justifyContent: 'center',
        alignItems    : 'center',
        alignSelf     : 'center',
    },
    scrollViewStyle: {
        flex          : 1,
        flexDirection : 'row',
        alignItems    : 'center',
        justifyContent: 'center',
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize  : '22@ms0.3',
        textAlign : 'center',
        padding   : '20@ms0.3',
        color     : 'white',
    },
    cardView: {
        width            : initialState.screenWidth / 1.5,
        height           : initialState.screenHeight / 3,
        alignSelf        : 'center',
        justifyContent   : 'center',
        alignItems       : 'center',
        borderWidth      : 1,
        borderRadius     : 5,
        borderColor      : '#ddd',
        borderBottomWidth: 0,
        shadowColor      : '#000',
        shadowOffset     : {width: 0, height: 2},
        shadowOpacity    : 0.8,
        shadowRadius     : 2,
        elevation        : 4,
        marginTop        : '10@ms0.3',
        backgroundColor  : 'white',
    },
    scanCardView: {
        width            : initialState.screenWidth / 1.5,
        height           : initialState.screenHeight / 2,
        alignSelf        : 'center',
        justifyContent   : 'center',
        alignItems       : 'center',
        borderWidth      : '10@ms0.3',
        borderRadius     : '2@ms0.3',
        borderColor      : '#ddd',
        borderBottomWidth: 0,
        shadowColor      : '#000',
        shadowOffset     : {width: 0, height: 2},
        shadowOpacity    : 0.8,
        shadowRadius     : '2@ms0.3',
        elevation        : '4@ms0.3',
        marginTop        : '10@ms0.3',
        backgroundColor  : 'white',
    },
    centerText: {
        flex      : 1,
        fontSize  : '20@ms0.3',
        padding   : '35@ms0.3',
        color     : colors.white,
        fontWeight: 'bold',
    },
    onsiteText: {
        fontSize : '21@ms0.3',
        marginTop: '10@ms0.3',
        color    : 'white',
    },
    buttonTouchable: {
        fontSize       : '21@ms0.3',
        backgroundColor: 'transparent',
        marginTop      : '10@ms0.3',
        borderColor    : colors.white,
        borderWidth    : '2@ms0.3',
        borderRadius   : '2@ms0.3',
        width         : initialState.screenWidth / 1.5,
        justifyContent: 'center',
        alignItems    : 'center',
        height        : '38@ms0.3',
    },
    buttonTextStyle: {
        marginLeft: '7@ms0.3',
        color     : 'white',
        fontWeight: 'bold',
    },
    heading: {
        alignItems       : 'center',
        flexDirection    : 'row',
        paddingHorizontal: '12@ms0.3',
        marginBottom     : '10@ms0.3',
        height           : initialState.screenHeight / 3,
    },
    userNameStyle: {
        color     : colors.white,
        fontWeight: 'bold',
        padding   : '10@ms0.3',
    },
    cameraStyle: {
        height        : initialState.screenHeight/2,
        width         : 0.9 * initialState.screenWidth,
        alignSelf     : 'center',
        justifyContent: 'center',
    },
});

export default connect(state => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user           : state.Auth.user,
}))(withNavigation(CheckIn));
