import {ScaledSheet} from 'react-native-size-matters';
import {colors}      from '../../theme';

const wellCheckStatusStyles = ScaledSheet.create({
    statusCard: {
        borderBottomRightRadius: 60,
        minHeight: '35%',
        paddingTop: 100,
        marginTop: -15,
        marginLeft: -15,
        marginRight: -15,
    },
    defaultStatusCard: {
        backgroundColor: colors.darkGrey
    },
    clearStatusCard: {
        backgroundColor: colors.secondary.main
    },
    notClearStatusCard: {
        backgroundColor: colors.red
    }

});

export default wellCheckStatusStyles;
