import {ScaledSheet} from 'react-native-size-matters';
import {colors}      from '../../theme';

const signUpStyles = ScaledSheet.create({
    container: {
        flex             : 1,
        paddingHorizontal: '40@vs',
    },
    heading: {
        flexDirection : 'row',
        justifyContent: 'center',
        //paddingTop    : '20@ms0.3',
        paddingBottom : '20@ms0.3',
        margin        : 0,
    },
    headingImage: {
        width          : '160@ms0.3',
        height         : '160@ms0.3',
        borderRadius   : '80@ms0.3',
        backgroundColor: colors.white,
        borderWidth    : '3@ms0.1',
        borderColor    : colors.white,
    },
    imageContainer: {
        width       : '140@ms0.3',
        height      : '140@ms0.3',
        borderRadius: '70@ms0.3',
    },
    form: {
        flex             : 1,
        paddingHorizontal: '10@ms',
        paddingBottom    : '10@ms',
    },
    listItem: {
        flexDirection: 'row',
        marginLeft   : 0,
    },
    listItemText: {
        paddingLeft: 13,
        color      : colors.mediumGrey,
    },
    dialogContentView: {
        paddingBottom: 40,
        paddingTop   : 10,
    },
    dialogButton: {
        justifyContent: 'center',
        alignItems    : 'center',
    },
});

export default signUpStyles;
