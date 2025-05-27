import React from 'react';
import { Container, Alert } from 'react-bootstrap';

function Error({ statusCode }) {
  return (
    <Container className="py-5 text-center">
      <Alert variant="danger">
        <h2>Oops! Something went wrong.</h2>
        <p>
          {statusCode
            ? `An error ${statusCode} occurred on server.`
            : 'An error occurred on client.'}
        </p>
        <p>Please try refreshing the page or go back to <a href="/login">Login</a>.</p>
      </Alert>
    </Container>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 