import React                   from 'react';
import {Button, Spinner, Text} from 'native-base';
import {ScaledSheet}           from 'react-native-size-matters';
import {colors}                from '@assets/theme';

export default ({
    title,
    onPress,
    bordered = false,
    disabled = false,
    isLoading = false,
    backgroundColor = colors.secondary.main,
    style = {},
}) => {
    const styles = ScaledSheet.create({
        button: {
            marginTop    : '20@ms0.3',
            flexDirection: 'row',
            borderRadius: 13,
            backgroundColor: bordered ? 'transparent' : colors.secondary.main,
        },
        activityIndicator: {
            marginTop: '3.5@ms0.1',
            padding  : '5@ms0.3',
        },
    });

    return <Button block
        bordered={bordered}
        disabled={disabled || isLoading}
        onPress={isLoading ? null : onPress}
        style={[styles.button, style]}
        tintColor={backgroundColor}
    >
        {isLoading
            ? <Spinner color='white' style={styles.activityContainer}/>
            : <Text style={{color: bordered ? colors.secondary.main : 'white'}}>{title}</Text>}
    </Button>
};
