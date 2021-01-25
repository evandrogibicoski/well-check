import { AsyncStorage } from 'react-native';

const DeviceStorage = {
  async saveKey(key, valueToSave) {
    try {
      await AsyncStorage.setItem(key, valueToSave);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async loadKey() {
    try {
      const value = await AsyncStorage.getItem('id_token');

      return value;
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async deleteKey() {
    try{
      await AsyncStorage.removeItem('id_token')
      .then(
        () => {
          this.setState({
            jwt: ''
          })
        }
      );
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }
};

export default DeviceStorage;
