const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    // mode: 'production',
    entry: {
        "app": './lib/playground.js',
        "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
        "css.worker": 'monaco-editor/esm/vs/language/css/css.worker'
    },
    output: {
        globalObject: 'self',
        path: path.resolve(__dirname, 'playground'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/),
        // new UglifyJSPlugin()
    ]
};