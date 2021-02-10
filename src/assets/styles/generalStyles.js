import {ScaledSheet} from 'react-native-size-matters';

const generalStyles = ScaledSheet.create({
    container: {
        flex          : 1,
        flexDirection : 'row',
        alignItems    : 'center',
        justifyContent: 'center',
    },
    buttonsContainerView: {
        flex         : 1,
        flexDirection: 'row',
    },
    leftButton: {
        flex: 1, marginRight: 5, alignItems: 'stretch',
    },
    rightButton: {
        flex: 1, marginLeft: 5, alignItems: 'stretch',
    },
    backButton: {
        position       : 'absolute',
        top            : 10,
        left           : 10,
        backgroundColor: 'white',
        borderRadius   : 44,
        width          : 44,
        height         : 44,
    },
});

export default generalStyles;
