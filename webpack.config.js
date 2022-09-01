{
  test: /\.js$/,
  use: {
    loader: "babel-loader"
  },
  exclude(file) {
    return /node_modules/.test(file) && !/\.vue\.js/.test(file);
  }
}