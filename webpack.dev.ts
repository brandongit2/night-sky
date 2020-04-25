import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

import common from './webpack.common';

const config: webpack.Configuration = merge(common, {
    mode: 'development',
    devtool: 'inline-cheap-source-map',
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 3000,
        hot: true,
        open: false
    },
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }
});

export default config;
