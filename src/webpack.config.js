var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: __dirname,
    entry: "./ts/app.ts",
    output: {
        path: __dirname + "/dist",
        filename: "js/app.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".less", ".css", ".ico"]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: { loader: "ts-loader" } },
            { test: /\.less$/, loader: ExtractTextPlugin.extract(["css-loader", "less-loader"]) }
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/site.css")
    ]
};
