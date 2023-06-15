import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../lib/customHooks';
import { storeTokenInLocalStorage } from '../lib/common';
import { Button, Form, FormGroup, Label, Input, Container, Col, FormFeedback,Alert } from 'reactstrap';
import { Spinner } from 'reactstrap';

const SignIn = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD)
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setUsernameError('');
    setPasswordError('');
    setError('');

    if(email.trim() === '') {
      setUsernameError('Email is required');
      return;
    }

    if(password.trim() === '') {
      setPasswordError('Password is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password
        }
      });
      if (!response?.data?.token) {
        setError('User not found or invalid credentials');
        console.log('Something went wrong during signing in: ', response);
        return;
      }
      storeTokenInLocalStorage(response.data.token);
      navigate(APP_ROUTES.DASHBOARD)
    }
    catch (err) {
      setError('Some error occurred during signing in');
      console.log('Some error occured during signing in: ', err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
    <Col sm="12" md="6" lg="4" className="mx-auto">
      <div className="shadow-lg rounded bg-white p-4 d-flex flex-column">
        <h2 className="text-center font-weight-medium mb-4">Sign in</h2>
        <Form className="d-flex flex-column justify-content-around h-75">
          <FormGroup>
            <Label for="email" className="sr-only">Email</Label>
            <Input 
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2"
              invalid={!!usernameError}
            />
            <FormFeedback>{usernameError}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="password" className="sr-only">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded p-2"
              invalid={!!passwordError}
            />
            <FormFeedback>{passwordError}</FormFeedback>
          </FormGroup>
          {error && <Alert color="danger">{error}</Alert>}
          <Button
            color="dark"
            onClick={signIn}
            className="d-flex justify-content-center align-items-center mt-2"
          >
            { isLoading ? <Spinner size="sm" color="light" className="mr-2"/> : null }
            <span>SIGN IN</span>
          </Button>
        </Form>
        <div className="text-center small">
          Not a User?
          <Link to="/signup">
            <span className="font-weight-medium text-dark ml-1">Sign Up</span>
          </Link>
        </div>
      </div>
    </Col>
  </Container>
  );
}


export default SignIn;