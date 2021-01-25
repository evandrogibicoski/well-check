import {ScaledSheet} from 'react-native-size-matters'
import {Dimensions}  from 'react-native';

const screenWidth = Dimensions.get('window').width;

const searchBarStyles = ScaledSheet.create({
    
    container: {
        height: '55@vs',
        width: screenWidth
    },
    header: {
    
    },
    suggestion: {
    
    },
    input: {
    
    },
    suggestionEntry: {
    
    },
    icon: {
    
    }
});

export default searchBarStyles;
