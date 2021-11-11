import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import to from 'await-to-js';

import compile from './compile.js';



export default async function( filepath, functionNames ) {

  // First let's create file to bundle.
  let name = path.basename( filepath ).replace( '.js', '' );
  let entry = filepath;

  if( functionNames ) {

    for( let functionName of functionNames ) {
      name = `${name}.${functionName}`;
    }

    entry = `./.edge/__${name}.js`;

    let functionImports = [];
    for( let name of functionNames ) {
      functionImports.push( `${name} as __${name}` );
    }
    functionImports = functionImports.join();


    const fileContent = `
      import { ${functionImports} } from '../${filepath}';
      ${functionNames.map( name => `window.${name} = __${name};` )}
    `;
    fs.writeFileSync( entry, fileContent );


  }


  const config = {
    mode: process.env.NODE_ENV,
    devtool: false,
    entry: {
      [name]: entry,
    },
    output: {
      path: path.resolve( __dirname, '.edge' ),
      filename: '[name].js',
    }
  };
  await compile( config, name );

  const fileContents = fs.readFileSync( `./.edge/${name}.js`, 'utf-8' );

  return fileContents;


}