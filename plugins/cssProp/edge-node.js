import randomstring from 'randomstring';

export const onCreatePage = async(  {
  dom: {
    window: {
      document
    }
  }
} ) => {

  // console.log( 'Start cssProp' );
  // console.log( html );
  //
  // return html;
  //

  const cssEls = document.querySelectorAll( '[css]' );

  if( ! cssEls.length ) {
    return;
  }

  const styleCache = [];

  for( let el of cssEls ) {

    // Create classname.
    const className = randomstring.generate( {
      length: 5,
      charset: 'alphabetic',
    } );

    // Create styles.
    const styles = el.getAttribute( 'css' );
    const css = `.${className} {
      ${styles}
    }`;
    const styleEl = document.createElement( 'style' );
    styleEl.type = 'text/css';
    styleEl.appendChild( document.createTextNode( css ) );

    document.head.appendChild( styleEl );
    el.removeAttribute( 'css' );

    styleCache.push( styles );




    el.classList.add( className );
  }


  return;


}