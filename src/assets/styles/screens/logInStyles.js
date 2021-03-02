import {ScaledSheet}   from 'react-native-size-matters';
import {colors, fonts} from '../../theme';

const logInStyles = ScaledSheet.create({
    form: {
        paddingHorizontal: '40@s',
        marginTop: '40@ms0.1',
    },
    heading: {
        flexDirection : 'row',
        justifyContent: 'center',
        paddingTop    : '20@ms0.3',
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
    signUpTextStyle: {
        color    : colors.primary.main,
        textAlign: 'center',
        marginTop: '40@ms0.1',
    },
    forgotPasswordTextStyle: {
        color    : colors.primary.main,
        textAlign: 'center',
        marginTop: '40@ms0.1',
        marginBottom: '40@ms0.1',
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
    loginButton: {
        marginTop: '50@ms0.1',
    },
    imageBackground: {
        minHeight: '35%',
        alignItems    : 'center',
        justifyContent: 'center',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default logInStyles;
