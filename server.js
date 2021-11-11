import chokidar from 'chokidar';
import decache from 'decache';
import express from 'express';
import dotenv from 'dotenv/config';
import fs from 'fs';

import cache from './cache.js';
import createPage from './createPage';
import edgeConfig from './edge.config.js';


const app = express();

app.use( express.static( 'public' ) );
//


// Routes.
if( !! edgeConfig.routes && !! edgeConfig.routes.length ) {


  for( let { src, dest } of edgeConfig.routes ) {

    app.get( src, async ( req, res ) => {

      const templateFile = `.${dest}${! dest.includes( 'js' ) ? '.js' : '' }`;

      import( templateFile )
      .then( async ( { default: component } ) => {

        const page = await createPage( {
          templateFile,
          component,
        } );

        res.send( page );

      } );


    } );

  }

  app.get( '/test', ( req, res ) => {


    cache.set( 'currentTemplate', 'test' );
    cache.set( 'html', 'test' );

    res.send('test');

  } );

  // SSE.
  app.get( '/__watch', ( req, res ) => {

    if( ! req.query || ! req.query.template ) {
      return;
    }

    const templateFile = req.query.template;

    res.status( 200 ).set( {
      'connection':     'keep-alive',
      'cache-control':  'no-cache',
      'content-type':   'text/event-stream',
    } );

    // Watch.
    const watcher = chokidar.watch( '.', {
      ignored: [ 'node_modules', '.edge' ],
    } )
    .on( 'change', path => {

      const oldHTML = cache.get( 'html' );
      if( ! oldHTML ) {
        return;
      }

      import( templateFile )
      .then( async ( { default: component } ) => {

        const newHTML = await createPage( {
          templateFile,
          component
        } );

        if( oldHTML == newHTML ) {
          return;
        }

        console.log( 'Sending updated html' );
        res.write( `data: ${JSON.stringify( { newHTML } ) }\n\n` );


      } );






    } );

  } );

}

app.listen( 3000 );





