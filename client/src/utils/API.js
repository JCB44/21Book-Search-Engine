export const getMe = (token) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `query {
        me {
          _id
          username
          email
          savedBooks {
            _id
            authors
            description
            title
            image
            link
          }
        }
      }`
    }),
  });
};

export const saveBook = (bookData, token) => {
  return fetch('/graphql', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutation: `mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
          _id
          username
          email
          savedBooks {
            _id
            authors
            description
            title
            image
            link
          }
        }
      }`,
      variables: { input: bookData },
    }),
  });
};

export const delBook = (bookId, token) => {
  return fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutation: `mutation delBook($bookId: ID!) {
        delBook(bookId: $bookId) {
          _id
          username
          email
          savedBooks {
            _id
            authors
            description
            title
            image
            link
          }
        }
      }`,
      variables: { bookId },
    }),
  });
};

export const createUser = (userData) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutation: `mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
          token
          user {
            _id
            username
          }
        }
      }`,
      variables: userData,
    }),
  });
};

export const loginUser = (userData) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutation: `mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            _id
            username
          }
        }
      }`,
      variables: userData,
    }),
  });
};

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};