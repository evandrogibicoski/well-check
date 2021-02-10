import {colors}      from '../../theme';
import {ScaledSheet} from 'react-native-size-matters';

const authContainerStyles = ScaledSheet.create({
    container: {
        flex           : 1,
        justifyContent : 'center',
        backgroundColor: colors.primary.main,
    },
    heading: {
        flexDirection  : 'row',
        justifyContent : 'center',
        paddingTop     : '20@ms0.3',
        paddingBottom  : '20@ms0.3',
        backgroundColor: colors.primary.main,
    },
    headingImage: {
        width : '120@ms0.3',
        height: '120@ms0.3',
    },
});

export default authContainerStyles;
