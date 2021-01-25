import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {colors}                     from '../../theme';
import {Dimensions}                 from 'react-native';

const ScreenHeight = Dimensions.get('window').height - verticalScale(55) - verticalScale(60);

const noInternetScreenStyles = ScaledSheet.create({
    container: {
        flex          : 1,
        alignItems    : 'center',
        justifyContent: 'center',
        height        : ScreenHeight,
        paddingBottom : '50@vs',
        width         : '100%',
    },
    icon: {
        fontSize: '150@ms',
        opacity : 0.5,
    },
    text: {
        fontWeight: '600',
        fontSize  : 16,
        color     : colors.darkGrey,
        textAlign : 'center',
    },
});

export default noInternetScreenStyles;
