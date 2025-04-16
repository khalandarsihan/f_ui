import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import webpack from "webpack"
import dotenv from "dotenv"

// Load environment variables from .env file
const env = dotenv.config().parsed || {}

// Convert environment variables to a format that webpack can use
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])
  return prev
}, {})

// Get the directory name from the current module URL
const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // Define environment variables for the client-side code
    new webpack.DefinePlugin({
      // Provide a default API URL if not defined in .env
      "process.env.REACT_APP_API_URL": JSON.stringify(process.env.REACT_APP_API_URL || "http://localhost:3001/api"),
      ...envKeys,
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
  },
}
