const pack2 = require('pack2');
const config = {
  entry: "./src/index.js",
  output: "./dist"
};

const compiler = pack2(config);
compiler.build();