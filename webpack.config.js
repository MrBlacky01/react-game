/* eslint-disable no-undef */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            // Disable require.ensure as it's not a standard language feature.
            { parser: { requireEnsure: false } },

            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    },
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                }
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  MiniCssExtractPlugin.loader,
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },    
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
          }),
        // Uncomment when have to analyze bundle composition
        // new BundleAnalyzerPlugin({
        //     analyzerPort: 8000,
        //     openAnalyzer: false,
        // }),
        new ESLintPlugin({
            cache: false,
            formatter: require.resolve('react-dev-utils/eslintFormatter'),
            eslintPath: require.resolve('eslint')
        }),
        new MiniCssExtractPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        open: true,
        hot: true,
    },
    resolve:{
        extensions: [".tsx", ".ts", ".js"],
        alias:{
            src: path.resolve(__dirname, 'src/'),
        }
    }
};