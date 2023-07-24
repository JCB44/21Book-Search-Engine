import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_BOOK } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import Auth from '../utils/auth';
import { delBookId } from '../utils/localStorage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [deleteBookMutation, { error }] = useMutation(DELETE_BOOK);
  
  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBookMutation({
        variables: { bookId },
        update: cache => {
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...userData, savedBooks: userData.savedBooks.filter(book => book.bookId !== bookId) } }
          });
        }
      });

      delBookId(bookId); 
      toast.success('Book deleted!');
      
    } catch (err) {
      console.error(err);
    }
  };

  
  if (loading) {
    return <h2>Incoming in 5 4 3 2 1 </h2>;
  }

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Now showing Books that you asked me to Save!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete Book.
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;