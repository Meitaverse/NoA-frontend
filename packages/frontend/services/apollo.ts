import { GRAPHQL_URL } from "./../config";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const query = async <T = any>(query): Promise<{ data: T; status: number }> => {
  const { data, networkStatus } = await client.query({
    query: gql`
      ${query}
    `,
  });

  return {
    data,
    status: networkStatus,
  };
};

export { query };

export default client;
