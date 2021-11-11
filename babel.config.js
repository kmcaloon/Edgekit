const path = require( 'path' );

module.exports = {
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    [
      "module-resolver", {
        "root": ["./src"]
      }
    ],
    [
      "@babel/plugin-transform-react-jsx",
      {
        "runtime": "automatic",
        "importSource": path.join( __dirname, './src/lib' )
      }
    ],
    [
      "@babel/plugin-transform-modules-commonjs"
    ]
  ]
}