export const jsx = ( type, config ) => {

  if( typeof type === 'function' ) {
    return type( config );
  }

  const { children = [], ...props } = config;

  let atts = ``;
  if( !! props ) {
    for( let [ key, val ] of Object.entries( props ) ) {
      atts = `${atts} ${key}=${val}`;
    }
  }

  return `
    <${type} ${atts}>
      ${children}
    </${type}>
  `;

}
export const jsxs = ( type, config ) => {

  if( typeof type === 'function' ) {
    return type( config );
  }

  const { children = [], ...props } = config;

  let atts = ``;
  if( !! props ) {
    for( let [ key, val ] of Object.entries( props ) ) {
      atts = `${atts} ${key}=${val}`;
    }
  }

  return `
    <${type} ${atts}>
      ${typeof children == 'object' ? children.join( ' ' ) : children }
    </${type}>
  `;

}
// function jsxForDOM = ( type, config ) => {
//
//   if( typeof type === 'function' ) {
//     return type( config );
//   }
//
//   const { children = [], ...props } = config;
//
//   return {
//     type,
//     props: {
//       ...props,
//       children: childrenProps.map( child => (
//         typeof child === 'object' ? child : createTextElement( child );
//       ) )
//     }
//   }
//
// }
//
// function createTextElement( text ) {
//   return {
//     type: 'TEXT_ELEMENT',
//     props: {
//       nodeValue: text,
//       children: [],
//     }
//   }
// }