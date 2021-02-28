/* eslint-disable no-undef */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ESLintPlugin = require('eslint-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

module.exports = (env, argv) => {
    const isDevelopment  = argv.mode === 'development';
    return{
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
                    test: /\.module\.s(a|c)ss$/,
                    exclude: /node_modules/,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-modules-typescript-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    getLocalIdent: getCSSModuleLocalIdent
                                },
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },
                {
                    test: /\.s(a|c)ss$/,
                    exclude: [
                        /\.module\.(s(a|c)ss)$/,
                        /node_modules/
                    ],
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    getLocalIdent: getCSSModuleLocalIdent
                                },
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },       
                {
                    test: /\.css$/,
                    use: [
                      MiniCssExtractPlugin.loader,
                      {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: isDevelopment ? "[path][name]__[local]" : "[path][name]__[local]--[hash:base64:5]",
                            },
                            sourceMap: isDevelopment
                        }
                    },
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
            extensions: [".tsx", ".ts", ".js", ".scss", ".css"],
            alias:{
                src: path.resolve(__dirname, 'src/'),
                assets: path.resolve(__dirname, 'src/Assets'),
            }
        }
    }
};