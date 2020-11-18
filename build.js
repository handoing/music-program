const path = require('path');
const pack2 = require('pack2');
const args = process.argv.splice(2);
const buildType = args[0];

const JSONPlugin = (options) => ({
  COMPILER_PARSE_BEFORE(compiler) {
    if (path.extname(compiler.fileName) === '.json') {
      compiler.content = `module.exports = ${compiler.content}`
    }
  }
})

const config = {
  "8bit": {
    entry: "./src/8bit/index.js",
    output: "./dist/8bit"
  },
  "instrument": {
    entry: "./src/instrument/index.js",
    output: "./dist/instrument",
    plugins: [
      JSONPlugin({})
    ]
  },
  "default": {
    entry: "./src/index.js",
    output: "./dist"
  }
};

const compiler = pack2(config[buildType]);
compiler.build();