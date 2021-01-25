import React, { Component } from 'react'
import PropTypes            from 'prop-types'

import { ScaledSheet } from 'react-native-size-matters'
import { TextField }   from 'react-native-material-textfield'
import platform        from '../../../native-base-theme/variables/platform'
import { View }        from 'react-native'
import { Icon }        from 'native-base'

export default class Input extends Component {
    render () {
        const {baseColor, focusColor, label, onChangeText, name, icon} = this.props
        return (
            <View>
                <View>
                    <Icon
                        size={14}
                        name={icon}
                        type='Ionicons'
                        style={{
                            position: 'absolute',
                            top     : 34,
                            right    : 0,
                            color   : baseColor
                        }}/>
                </View>
                <View>
                    <TextField
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
                        // labelTextStyle={{paddingLeft: 28}}
                        inputContainerStyle={{paddingRight: 32}}
                    />
                </View>
            </View>
        )
    }
}

Input.propTypes = {
    baseColor   : PropTypes.string,
    focusColor  : PropTypes.string,
    label       : PropTypes.string,
    onChangeText: PropTypes.func,
    name        : PropTypes.string,
    icon        : PropTypes.string
}

Input.defaultProps = {
    baseColor : '#a0a0a0',
    focusColor: platform.brandPrimary,
    icon      : ''
}

const styles = ScaledSheet.create({
    input: {
        marginBottom: '-8@ms0.3',
        fontFamily  : platform.fontFamily,
    }
})

//({baseColor = '#a0a0a0', focusColor = platform.brandPrimary, label, onChangeText, name, icon = '', ...props}) => (
