import { html } from '../utils';
import Layout from '../layout';

export default function( data ) {


  return html`

    ${layout(null, html`
      <div>
        ${ button(null, html`

      ` )}
      </div>
    `) }


  `;

}