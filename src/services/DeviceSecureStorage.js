import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const config = {
    accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    accessible: ACCESSIBLE.WHEN_UNLOCKED,
    authenticationPrompt: 'Authenticate with your device unlocking mechanism',
    service: 'React Native Boilerplate secure storage',
    authenticateType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
}

const DeviceSecureStorage = {
    /**
     * Save a new key to an encrypted file on the phone
     * @param key
     * @param valueToSave
     * @returns {Promise<void>}
     */
    async saveKey(key, valueToSave) {
        try {
            if (Platform.OS === 'android') await SecureStorage.setItem(key, valueToSave, config);
            else await AsyncStorage.setItem(key, valueToSave);
        } catch (error) {
            await AsyncStorage.setItem(key, valueToSave);
            console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async getKey(key) {
        try {
            if (Platform.OS === 'android') return await SecureStorage.getItem(key, config);
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
            return await AsyncStorage.getItem(key);
        }
    },

    async deleteKey(key) {
        try{
            if (Platform.OS === 'android') await SecureStorage.removeItem(key);
            else await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
            await AsyncStorage.removeItem(key);
        }
    }
};

export default DeviceSecureStorage;
