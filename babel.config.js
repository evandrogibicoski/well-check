module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver', {
                root: ['.'],
                alias: {
                    '@assets': './src/assets',
                    '@components': './src/components',
                    '@navigation': './src/navigation',
                    '@screens': './src/screens',
                    '@services': './src/services',
                    '@src': './src',
                    '@store': './src/redux-store'
                }
            }
        ]
    ]
};
