import React                   from 'react';
import {Button, Spinner, Text} from 'native-base';
import {ScaledSheet}           from 'react-native-size-matters';
import {colors}                from '@assets/theme';

const styles = ScaledSheet.create({
    button: {
        marginTop    : '20@ms0.3',
        flexDirection: 'row',
    },
    activityIndicator: {
        marginTop: '3.5@ms0.1',
        padding  : '5@ms0.3',
    },
});

export default ({
    title,
    onPress,
    bordered = false,
    disabled = false,
    isLoading = false,
    backgroundColor = colors.primary.dark,
    style = {},
}) => (
    <Button block
        bordered={bordered}
        disabled={disabled || isLoading}
        onPress={isLoading ? null : onPress}
        style={[styles.button, style]}
        tintColor={backgroundColor}>
        {isLoading
            ? <Spinner color='white' style={styles.activityContainer}/>
            : <Text>{title}</Text>}
    </Button>
);
