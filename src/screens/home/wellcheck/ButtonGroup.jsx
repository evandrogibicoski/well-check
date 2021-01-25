import React, {Component} from 'react';
import {View} from 'react-native';

import Button from '@components/common/Button';
import generalStyles from '@assets/styles/generalStyles';

class ButtonGroup extends Component {
    state = {
        borderedYes: this.props.answer != null ? this.props.answer === false : true,
        borderedNo: this.props.answer != null ? this.props.answer === true : true,
    };

    setAnswer (value) {
        if (value === null) return;

        this.setState({
            borderedYes: !value,
            borderedNo: value,
        });

        this.props.onAny && this.props.onAny(value);
        value === true
            ? (this.props.onYes && this.props.onYes())
            : (this.props.onNo && this.props.onNo());
    }

    render() {
        const {setAnswer, borderedYes, borderedNo} = this.state;
        return <View style={generalStyles.buttonsContainerView}>
            <View style={generalStyles.leftButton}>
                <Button bordered={borderedYes}
                    title='Yes'
                    onPress={() => this.setAnswer(true)}
                />
            </View>
            <View style={{
                ...generalStyles.rightButton,
                flexGrow: 1
            }}>
                <Button bordered={borderedNo}
                    title='No'
                    onPress={() => this.setAnswer(false)}
                />
            </View>
        </View>;
    }
}

export default ButtonGroup;
