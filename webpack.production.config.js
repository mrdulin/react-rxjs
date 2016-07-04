const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackBrowserPlugin = require('webpack-browser-plugin');

const paths = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist')
};

module.exports = {
    entry: {
        app: path.resolve(paths.src, 'app.js'),
        lib: path.resolve(paths.src, 'lib.js')
    },
    output: {
        path: paths.dist,
        filename: '[name].[hash].js'
    },
    devtool: "source-map",
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loaders: ['react-hot', 'babel']
        }, {
            test: /\.json$/,
            loaders: ['json']
        }, {
            test: /\.scss$/,
            exclude: /(node_modules|bower_components)/,
            loader: ExtractTextPlugin.extract(
                'style', // The backup style loader
                'css?sourceMap!postcss!sass?sourceMap'
            )
        }, {
            test: /\.(png|jpg|jpeg|gif|woff)$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'url-loader',
            query: {
                limit: 8192
            }
        }]
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.json', '.jsx']
    },
    //解决import scss文件时相对路径的问题
    sassLoader: {
        //相对于webpack.config.js文件的路径
        includePaths: ['/scss']
    },
    postcss: [
        require('autoprefixer')
    ],
    plugins: [
        //不要在生产环境使用，因为该插件会在页面中插入browser-sync-client.js文件（调试用）
        //这里只是用做编译成功后快速预览用
        new WebpackBrowserPlugin({
            port: 8080,
            browser: 'default'
        }),
        new FaviconsWebpackPlugin(__dirname + '/favicon.png'),
        new CleanWebpackPlugin(['dist', 'build'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.[hash].js'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(paths.src, 'index.html'),
            filename: 'index.html',
            hash: true
        }),
        new ExtractTextPlugin('style.[hash].css', {
            allChunks: true
        }),
        new webpack.BannerPlugin("Copyright Novaline"),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false,
                dead_code: true,
                drop_debugger: true,
                unused: true,
                drop_console: true
            },
            mangle: {
                //avoid mangling the Webpack runtime.
                except: ['webpackJsonp']
            },
            output: {
                comments: false
            }
        })
    ]
};