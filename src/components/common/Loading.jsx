import React                         from 'react';
import {Container, Content, Spinner} from 'native-base';
import platform                      from '../../../native-base-theme/variables/platform';
import {SafeAreaView}                from 'react-native';

const Loading = ({size}) => {
    return <SafeAreaView style={styles.spinnerContainer}>
        <Container style={styles.spinnerContainer}>
            <Content>
                <Spinner color={platform.brandPrimary}/>
            </Content>
        </Container>
    </SafeAreaView>;
}

const styles = {
    spinnerContainer: {
        flex        : -1,
        marginTop   : 12,
        marginBottom: 12,
    },
};

export {Loading};
