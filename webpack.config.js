const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry: {
        app:'./public/js/app.js',
        main:'./public/js/main.js',
        meeti:'./public/js/meeti.js'
        }, 
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, "./public/dist")
    },
    module: {
        rules: [    
        {
            test: /\.m?js$/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
            }
        }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery'
        })
    ]
}