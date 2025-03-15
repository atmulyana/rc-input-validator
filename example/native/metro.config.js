const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');
const validatorPath = path.resolve(__dirname + '/../../dist');
const config = {
    resolver: {
        extraNodeModules: new Proxy({}, {
            get: (_, moduleName) => moduleName == 'rc-input-validator'
                ? validatorPath
                : path.join(__dirname, `node_modules/${moduleName}`)
        }),
    },
    watchFolders: [validatorPath],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
