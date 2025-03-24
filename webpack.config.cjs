
// import path from 'path';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import CssPlugin from 'mini-css-extract-plugin';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");


module.exports = {
    mode: 'production',
    entry: './front-end/script.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'build.[contenthash].js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './front-end/index.html',
        }),
        new CssPlugin({
            filename: 'styles.[contenthash].css',
        }),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["imagemin-mozjpeg", { quality: 75 }],
                        ["optipng", { optimizationLevel: 5 }],
                        ["svgo", {
                            plugins: [{ removeViewBox: false }],
                        },
                        ],
                    ],
                },
            },
        }),
    ],
    optimization: {
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    CssPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { modules: false }]]
                    }
                }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.mjs'],

    },
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
    },
    devServer: {
        port: 9000,
        static: {
            directory: path.join(__dirname, 'dist'),
            publicPath: '/',
        },
        open: true,
        hot: true
    },
};
