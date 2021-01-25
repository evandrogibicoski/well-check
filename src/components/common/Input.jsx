import React, {Component} from 'react';
import PropTypes          from 'prop-types';

import {ScaledSheet} from 'react-native-size-matters';
import {TextField}   from 'react-native-material-textfield';
import platform      from '../../../native-base-theme/variables/platform';
import {Icon}        from 'native-base';

export default class Input extends Component {
    render() {
        const {baseColor, focusColor, label, onChangeText, name, icon} = this.props;

        // labelTextStyle={{paddingLeft: 28}}
        return <TextField
            {...this.props}
            autoCapitalize='none'
            autoCorrect={false}
            style={[styles.input]}
            label={label}
            placeholderTextColor={baseColor}
            onChangeText={value => (onChangeText(name, value))}
            tintColor={focusColor}
            textColor={baseColor}
            baseColor={baseColor}
            ref={this.props.refInner}
            inputContainerStyle={{paddingLeft: 32}}
            renderLeftAccessory={() => <Icon
                size={10}
                name={icon}
                type='Ionicons'
                style={{
                    position: 'absolute',
                    top     : 28,
                    left    : 0,
                    color   : baseColor,
                }}/>
            }
        />;
    }
}

Input.propTypes = {
    baseColor   : PropTypes.string,
    focusColor  : PropTypes.string,
    label       : PropTypes.string,
    onChangeText: PropTypes.func,
    name        : PropTypes.string,
    icon        : PropTypes.string,
};

Input.defaultProps = {
    baseColor : '#a0a0a0',
    focusColor: platform.brandPrimary,
    icon      : '',
};

const styles = ScaledSheet.create({
    input: {
        fontFamily: platform.fontFamily,
    },
})

//({baseColor = '#a0a0a0', focusColor = platform.brandPrimary, label, onChangeText, name, icon = '', ...props}) => (
