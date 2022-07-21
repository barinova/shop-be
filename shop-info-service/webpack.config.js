const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    mode: 'production',
    resolve: {
        extensions: ['.cjs', '.mjs', '.js', '.ts'],
    },
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()],
    module: {
        // Instruct Webpack to use the `ts-loader` for any TypeScript files, else it
        // won't know what to do with them.
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        /node_modules/,
                        path.resolve(__dirname, '.webpack'),
                        path.resolve(__dirname, '.serverless'),
                    ],
                ],
                // And here we have options for ts-loader
                // https://www.npmjs.com/package/ts-loader#options
                options: {
                    // Disable type checking, this will lead to improved build times
                    transpileOnly: true,
                    // Enable file caching, can be quite useful when running offline
                    experimentalFileCaching: true,
                },
            },
        ],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
};
