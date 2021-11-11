import htm from 'htm';
import vhtml from 'vhtml';
import utf8 from 'utf8';

export const html = ( strings, ...values ) => {

  if( typeof strings == 'string' ) {
    return strings;
  }

  let parsed = '';
  strings.forEach( ( string, i ) => {
    parsed += `${string}${values[i] || ''}`;
  } );
  //utf8.encode( elements );

  return parsed;

}

