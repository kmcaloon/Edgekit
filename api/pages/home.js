
import Layout from 'layout';

const css = ( strings, ...props ) => {

  return strings[0].replace( /(\r\n|\n|\r)/gm, '' ).replace( /\s/g, '' );
}

const color = 'red';


export default function( req, res) {

  return(
    <Layout>
      <h1 css={ css`
        font-size: 3rem;
        color: blue;
      ` }>
        What are we doing again?
      </h1>
    </Layout>

  );

}