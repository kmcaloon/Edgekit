import decache from 'decache';
import path from 'path';
import { JSDOM } from 'jsdom';

// This shouldn't be necessary...
//import reefUtils from './reef/utilities';
import importScript from './importScript.js';
import pluginList from './edge-plugins.js';
import cache from './cache.js';

const createDOMFilters = [];
const createPageFilters = [];
if( !! pluginList?.length ) {
  for( let pluginConfig of pluginList ) {

    const hasOptions = typeof pluginConfig === 'object';
    const name = hasOptions ? pluginConfig.name : pluginConfig;
    const isLocal = pluginConfig?.local;
    const pluginPath = !! isLocal ? `./plugins/${name}/edge-node.js` : `${name}/edge-node.js`;
    const plugin = require( pluginPath );

    if( !! plugin.onCreateDOM ) {
      createDOMFilters.push( plugin.onCreateDOM );
    }

    if( !! plugin.onCreatePage ) {
      createPageFilters.push( plugin.onCreatePage );
    }

  }
}

const onCreateDOM = async( { html, templateFile } ) => {

  if( ! createDOMFilters?.length ) {
    console.log( 'No DOM filters' );
    return html;
  }

  let parsedHTML = html;

  console.log( 'Ready to start onCreateDOM' );

  if( !! createDOMFilters.length ) {
    for( let createDOMFilter of createDOMFilters ) {
      parsedHTML = await createDOMFilter( { html: parsedHTML, templateFile } );
    }
  }

  return parsedHTML;

}

const onCreatePage = async( { dom, html, templateFile } ) => {

  if( process.env.NODE_ENV == 'development' ) {

    const diffScripts = await importScript( './reef/dom.js', [ 'diff' ] );
    const head = dom.window.document.querySelector( 'head' );
    //const watcher = Watcher();
    head.insertAdjacentHTML( 'beforeend',`

      <script>

        ${diffScripts}

        const templateFile = '${templateFile}';
        const events = new EventSource( '//localhost:3000/__watch?template=${templateFile}' );
        events.onmessage = function( e ) {
          if( ! e.data ) {
            return;
          }
          const data = JSON.parse( e.data );
          const { newHTML } = data;
          const parser = new DOMParser();
          const newDoc = parser.parseFromString( newHTML, 'text/html' );

          diff( newDoc, document );



        }
      </script>
    ` );

  }

  console.log( { createPageFilters } );

  if( !! createPageFilters.length ) {
    for( let createPageFilter of createPageFilters ) {
      console.log( { createPageFilter } );
      await createPageFilter( { dom, templateFile } );
    }
  }

  return { dom };

}

// const Watcher = () => {
//
//   return(
//     <script>
//       const events = new EventSource( '//localhost:3000/__watch' );
//       events.onmessage = function( e ) {
//         console.log( e );
//       }
//     </script>
//   )
// }

export default async function createPage( {
  templateFile,
  component,
}) {

  let page = component();
  page = `${page}`;

  page = await onCreateDOM( { html: page, templateFile } );

  const dom = new JSDOM( page );

  await onCreatePage( { dom, templateFile } );

  const html = dom.serialize();

  if( process.env.NODE_ENV == 'development' ) {
    cache.set( 'html', html );
    decache( templateFile );
  }


  return html;


}