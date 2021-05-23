export interface ErrorQL {
  message: string;
}

export interface GraphQLError {
  response: {
    errors: ErrorQL[];
  };
}
