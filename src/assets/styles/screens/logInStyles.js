import {ScaledSheet}   from 'react-native-size-matters';
import {colors, fonts} from '../../theme';

const logInStyles = ScaledSheet.create({
    form: {
        flex             : 1,
        paddingHorizontal: '10@s',
    },
    heading: {
        flexDirection : 'row',
        justifyContent: 'center',
        paddingTop    : '40@ms0.3',
        paddingBottom : '20@ms0.3',
        margin        : 0,
    },
    headingImage: {
        width : '280@ms0.3',
        height: '140@ms0.3',
        borderRadius: 16,
    },
    partnersImage: {
        width : '45@ms0.3',
        height: '45@ms0.3',
    },
    forgotPasswordTextStyle: {
        color    : colors.primary.main,
        textAlign: 'right',
        marginTop: '13@ms0.1',
    },
    partnershipText: {
        fontWeight       : 'bold',
        fontSize         : '18@ms0.3',
        color            : colors.white,
        marginBottom     : '5@ms0.3',
        marginLeft       : '5@ms0.3',
        marginRight      : '5@ms0.3',
        textAlignVertical: 'center',
        textAlign        : 'center',
        fontFamily       : fonts.base,
    },
});

export default logInStyles;
