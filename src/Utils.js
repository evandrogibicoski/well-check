import NetInfo          from '@react-native-community/netinfo';
import parsePhoneNumber from 'libphonenumber-js';
import { store }        from './redux-store';

export default {
    /**
     * Handles cooking time conversion
     * @param time
     */
    beautifyTime (time) {
        let text = '';

        time.split(':').map((number, index) => {
            let int = parseInt(number);
            if (int > 0) {
                switch (index) {
                    case 0:
                        if (int === 1) {
                            text += int + ' oră ';
                        } else {
                            text += int + ' ore ';
                        }
                        break;
                    case 1:
                        text += int + ' min';
                        break;
                }
            }
        });
        return text;
    },

    // TODO this will never work because NetInfo is an async function !!
    // this function will always return false (async methods are promise based, not return value based)
    isOffline () {
        NetInfo.fetch().then(connectionInfo => {
            // return connectionInfo.type === 'none';
            if (connectionInfo.type === 'none') return true;
        });

        return false;
    },

    /**
     * Capitalizes string
     * @param value
     * @returns {string}
     */
    capitalize (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    },

    /**
     * converts the values to the correct format and back for multiSliders
     * @param array
     * @param reverse
     * @returns {Array}
     */
    calculateTimeValuesForMultiSliders (array, reverse = false) {
        let values = [];

        if (reverse) {
            if (!array.values || !array.values.length) return null;

            array.values.forEach(string => {
                const a            = string.split(':');
                const firstNumber  = parseInt(a[0] * 60);
                const secondNumber = parseInt(a[1]);
                values.push(firstNumber + secondNumber);
            });

            return values;

        } else if (array && array.length) {
            array.forEach(number => {
                if ((number / 60) >= 1) {
                    const hours         = Math.floor(number / 60);
                    const minutes       = number - (hours * 60);
                    const correctHour   = this.checkTimeDigitNumber(hours);
                    const correctMinute = this.checkTimeDigitNumber(minutes);
                    values.push(`${correctHour}:${correctMinute}`);
                } else {
                    values.push(`00:${this.checkTimeDigitNumber(number)}`);
                }
            });

            return values;

        } else {
            return null;
        }
    },

    checkTimeDigitNumber (value) {
        return value <= 9 ? `0${value}` : value;
    },

    formatPhoneNumber (number) {
        number = parsePhoneNumber(number);
        return number.country === 'US'
            ? number.formatNational()
            : number.formatInternational();
    },

    /**
     * Check if the user has the appropriate permission
     * @return {Boolean}
     */
    hasPermissionTo (permission) {
        // grab current state
        const state = store.getState();
        let user  = state.Auth.user;
        let check = false;
        if (user && user.permissions) {
            if (Array.isArray(permission)) {
                let checks = [];
                for (let i in permission) {
                    checks[i] = user.permissions.includes(permission);
                    check     = check || checks[i];
                }
            } else {
                check = user.permissions.includes(permission);
            }
        }

        return check;
    },
};
