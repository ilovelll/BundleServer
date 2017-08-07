require("babel-core/register")({
    "plugins": [
    "transform-async-to-generator",
    "syntax-async-functions"
  ]
});
require("reify")
require('./index.js');