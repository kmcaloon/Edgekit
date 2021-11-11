import NodeCache from 'node-cache';

export default new NodeCache();

const someFunction = () => {
  console.log( 'SOME FUNCTION DOING SOMETHING' );

};

export const something = () => {

  const message = someFunction();

  return message;

}