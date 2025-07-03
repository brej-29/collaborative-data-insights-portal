import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  query {
    allUsers {
      id
      username
      email
      role
    }
  }
`;
