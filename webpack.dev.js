const webpackMerge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = function () {
    const merged = webpackMerge.merge(base.config, {
        mode: 'development',
        output: {
            filename: '[name]-dev.js',
        },
        devtool: 'source-map',
    });
    return merged;
};
