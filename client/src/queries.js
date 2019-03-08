import { gql } from 'apollo-boost';

/* post queries */
export const GET_POSTS = gql`
  query {
    getPosts {
    _id
    title
    imageUrl
    description
    }
  }
`;

/* user queries */

/* posts mutations queries */

/* user mutations */
