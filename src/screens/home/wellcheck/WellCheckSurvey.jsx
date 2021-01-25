// REACT ==================================================
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dimensions, ImageBackground, StyleSheet, View} from 'react-native';
import {withNavigation} from 'react-navigation';

// STYLING ================================================
import {Body, Container, Content, Card, CardItem, Text} from 'native-base';
import StepIndicator from 'react-native-step-indicator';
// import Swiper from 'react-native-swiper';
import generalStyles from '@assets/styles/generalStyles';

// COMPONENTS =============================================
import ButtonGroup from './ButtonGroup';
import WellCheckSurveySvg from './WellCheckSurveySvg';
import Button from '@components/common/Button';
import {Loading} from '@components/common/Loading';
import NoInternetScreen from '@components/common/NoInternetScreen';

// SERVICES ===============================================
import {SurveyService, SurveySubmissionService} from '@services';

// MISC ===================================================
import _ from 'lodash';

const styles = StyleSheet.create({
    stepperView: {
        marginTop: 30,
    },
    surveyCard: {
        marginTop: 60,
        paddingVertical: 30,
    }
});

const stepperStyles = {
    stepIndicatorSize: 35,
    currentStepIndicatorSize: 40,
    stepStrokeCurrentColor: '#2ec646',
    // separatorStrokeWidth: 3,
    // currentStepStrokeWidth: 5,
    // separatorFinishedColor: '#4aae4f',
    // separatorUnFinishedColor: '#a4d4a5',
    // stepIndicatorFinishedColor: '#4aae4f',
    // stepIndicatorUnFinishedColor: '#a4d4a5',
    // stepIndicatorCurrentColor: '#ffffff',
    // stepIndicatorLabelFontSize: 15,
    // currentStepIndicatorLabelFontSize: 15,
    // stepIndicatorLabelCurrentColor: '#000000',
    // stepIndicatorLabelFinishedColor: '#ffffff',
    // stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
    // labelColor: '#666666',
    // labelSize: 12,
    // currentStepLabelColor: '#4aae4f',
};

const initialState = {
    screenWidth: Dimensions.get('screen').width * 0.95,
    screenHeight: Dimensions.get('screen').height * 0.9,

    isLoading: false,

    // Current stepper position
    step: 0,

    surveyData: null,
    surveyValues: null,

    // Indicates how many times the survey has been restarted by the user
    restarts: 0,

    // Selected employer for displaying contact information
    selectedEmployer: {},
};

class WellCheckSurvey extends Component {
    state = _.cloneDeep(initialState);

    initialize = () => {
        this.setState({initialState}, () => {
            this.setState({selectedEmployer: this.props.user.employers[0]});
        });

        // Listeners
        Dimensions.addEventListener('change', () => this.checkScreenDimensions());

        // if (!Utils.isOffline() && isAuthenticated) {
            this.retrieveSurveyData();
        // }
    };

    componentDidMount() {
        this.initialize();
    }
    componentWillUnmount() {
        Dimensions.removeEventListener('change', () => this.checkScreenDimensions());
    }

    checkScreenDimensions = () => {
        let width = Dimensions.get('screen').width * 0.95;
        let height = Dimensions.get('screen').height * 0.9;
        this.setState({screenWidth: width, screenHeight: height})
    };

    initializeSurveyValues = surveyData => {
        // Initialize empty survey values based on pages and items collected from the survey data
        let surveyValues = {};

        _.each(surveyData, (page, pageKey) => {
            surveyValues[pageKey] = {};
            _.each(page.items, (item, itemKey) => {
                surveyValues[pageKey][itemKey] = null;
            });
        });

        this.setState({surveyValues});
    };

    retrieveSurveyData = () => {
        this.setState({isLoading: true}, () => {
            SurveyService.get()
                .then(r => {
                    const surveyData = r.data.survey;

                    this.setState({surveyData});
                    this.initializeSurveyValues(surveyData);
                })
                .finally(() => this.setState({isLoading: false}));
        });
    };

    updateSurveyAnswer = (pageKey, itemKey, answer) => {
        let surveyValues = _.cloneDeep(this.state.surveyValues);
        surveyValues[pageKey][itemKey] = answer;
        this.setState({surveyValues});

        // Check if there are any goto overrides to follow for the given item
        if (answer === true && 'go_yes' in this.state.surveyData[pageKey].items[itemKey]) {
            if (Number.isInteger(this.state.surveyData[pageKey].items[itemKey].go_yes)) {
                this.gotoStep(this.state.surveyData[pageKey].items[itemKey].go_yes);
            } else if (this.state.surveyData[pageKey].items[itemKey].go_yes === 'next') {
                this.gotoNextStep();
            }
            return;
        } else if (answer === false && 'go_no' in this.state.surveyData[pageKey].items[itemKey]) {
            if (Number.isInteger(this.state.surveyData[pageKey].items[itemKey].go_no)) {
                this.gotoStep(this.state.surveyData[pageKey].items[itemKey].go_no);
            } else if (this.state.surveyData[pageKey].items[itemKey].go_no === 'next') {
                this.gotoNextStep();
            }
            return;
        }

        // If all answers for the page have been filled, goto next step
        let allFilled = true;
        _.each(surveyValues[pageKey], value => {
            if (value === null) {
                allFilled = false;
                return false;
            }
        });
        if (allFilled) this.gotoNextStep();
    };

    submitSurvey = () => {
        this.setState({isLoading: true}, () => {
            SurveySubmissionService.create({
                answers : this.state.surveyValues,
                restarts: this.state.restarts,
            })
                .then(() => this.props.navigation.navigate('WellCheckStatus'))
                .finally(() => this.setState({isLoading: false}));
        });
    };

    gotoStart = () => {
        this.initializeSurveyValues(this.state.surveyData);
        this.setState({restarts: this.state.restarts + 1});
        this.gotoStep(0);
    };
    gotoStep = step => this.setState({step});
    gotoNextStep = () => this.gotoStep(this.state.step + 1);

    render() {
        const {isLoading, surveyData, surveyValues, step} = this.state;

        return <Container>{
        isLoading
            ? <Loading/>
            :
            <ImageBackground
                resizeMode={'cover'}
                style={generalStyles.container}
                source={require('@assets/images/bg_pattern.png')}
            >
            {!!surveyData && <Content padder
                showsVerticalScrollIndicator
            >
                <View style={styles.stepperView}>
                <StepIndicator
                    currentPosition={step}
                    customStyles={stepperStyles}
                >
                </StepIndicator>
                </View>

                {/*<Swiper
                    loop={false}
                    index={step}
                    autoplay={false}
                    showsButtons={false}
                    dot={<Text/>}
                    activeDot={<Text/>}
                >
                    <View>
                        <Card style={styles.surveyCard}>
                        <CardItem>
                        <Body style={{align: 'center'}}>
                        <Text>Hello 1</Text>
                        </Body>
                        </CardItem>
                        </Card>
                    </View>
                    <View>
                        <Card style={styles.surveyCard}>
                        <CardItem>
                        <Body style={{align: 'center'}}>
                        <Text>
                            Try to insert some very long text here - it won't fit since the swiper element cuts it off
                        </Text>
                        </Body>
                        </CardItem>
                        </Card>
                    </View>
                    <View>
                        <Card style={styles.surveyCard}>
                        <CardItem>
                        <Body style={{align: 'center'}}>
                        <Text>Finality of al</Text>
                        </Body>
                        </CardItem>
                        </Card>
                    </View>
                </Swiper>*/}

                {/* BEGIN Dynamic Survey */}
                {Object.keys(surveyData).map(pageKey => <View key={pageKey}>
                {(
                    step === surveyData[pageKey].step && (
                        (
                            !('when_yes' in surveyData[pageKey]) &&
                            !('when_no' in surveyData[pageKey])
                        ) || (
                            'when_yes' in surveyData[pageKey] &&
                            surveyValues[surveyData[pageKey].when_yes.page][surveyData[pageKey].when_yes.item] === true
                        ) || (
                            'when_no' in surveyData[pageKey] &&
                            surveyValues[surveyData[pageKey].when_no.page][surveyData[pageKey].when_no.item] === false
                        )
                    )
                ) && <Card style={styles.surveyCard}>
                    {('text' in surveyData[pageKey]) && <CardItem>
                    <Body style={{alignItems: 'center', marginBottom: 10}}>
                        <Text style={{textAlign: 'center'}}>
                            {surveyData[pageKey].text}
                        </Text>
                    </Body>
                    </CardItem>}

                    {('icon' in surveyData[pageKey]) && <Body style={{alignItems: 'center'}}>
                        <WellCheckSurveySvg type={surveyData[pageKey].icon}/>
                    </Body>}

                    {Object.keys(surveyData[pageKey].items).map(itemKey => {
                        return <View key={itemKey}>
                        {!!(
                            (
                                !('when_yes' in surveyData[pageKey].items[itemKey]) &&
                                !('when_no' in surveyData[pageKey].items[itemKey])
                            ) || (
                                'when_yes' in surveyData[pageKey].items[itemKey] &&
                                surveyValues[pageKey][surveyData[pageKey].items[itemKey].when_yes] === true
                            ) || (
                                'when_no' in surveyData[pageKey].items[itemKey] &&
                                surveyValues[pageKey][surveyData[pageKey].items[itemKey].when_no] === false
                            )
                        ) && <CardItem>
                            <Body style={{alignItems: 'center'}}>
                                <Text style={{textAlign: 'center'}}>
                                    {surveyData[pageKey].items[itemKey].text}
                                </Text>
                                <ButtonGroup
                                    answer={surveyValues[pageKey][itemKey]}
                                    onAny={answer => {
                                        this.updateSurveyAnswer(pageKey, itemKey, answer);
                                    }}
                                ></ButtonGroup>
                            </Body>
                        </CardItem>}
                        </View>;
                    })}
                </Card>}
                </View>)}

                {/* Survey End Page */}
                {step === 4 &&
                <View>
                <Card style={styles.surveyCard}>
                <CardItem>
                <Body style={{alignItems: 'center'}}>
                    <Text style={{textAlign: 'center'}}>
                        You confirm that all answers are accurate and allow {this.state.selectedEmployer.name} to have access to these answers.
                    </Text>

                    <Button
                        isLoading={isLoading}
                        title='Confirm'
                        onPress={this.submitSurvey}
                    />
                    <Button bordered
                        disabled={isLoading}
                        title='Restart Well Check'
                        onPress={this.gotoStart}
                    />
                </Body>
                </CardItem>
                </Card>
                </View>}
                {/* END Dynamic Survey */}

            </Content>}
            </ImageBackground>
        }</Container>;
    }
}

export default connect(state => ({
    user: state.Auth.user,
}))(withNavigation(WellCheckSurvey));
