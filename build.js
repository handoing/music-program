const pack2 = require('pack2');
const args = process.argv.splice(2);
const buildType = args[0];

const config = {
  "8bit": {
    entry: "./src/8bit/index.js",
    output: "./dist/8bit"
  },
  "default": {
    entry: "./src/index.js",
    output: "./dist"
  }
};

const compiler = pack2(config[buildType]);
compiler.build();