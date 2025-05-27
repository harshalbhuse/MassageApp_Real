import React, { useState } from 'react';
import { Card, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: ''
  });
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Replace with your actual API endpoint
      const res = await axios.post(
        'http://localhost:8000/api/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('user_id', res.data.user_id);
      // On success, redirect to users page
      window.location.href = '/users';
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    try {
      const res = await axios.post('http://localhost:8000/api/signup', signupData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSignupSuccess('User created successfully! Please login.');
      setShowSignup(false);
    } catch (err) {
      setSignupError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <Card style={{ minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <FaUser size={48} className="text-primary" />
            <h3 className="mt-2">Sign In</h3>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaUser /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  aria-label="Username"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaLock /></InputGroup.Text>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-2"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
          <button className="btn btn-link mt-3" onClick={() => setShowSignup(true)}>
            Sign Up
          </button>
          {showSignup && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Sign Up</h5>
                    <button type="button" className="btn-close" onClick={() => setShowSignup(false)}></button>
                  </div>
                  <form onSubmit={handleSignup}>
                    <div className="modal-body">
                      <input type="text" className="form-control mb-2" name="first_name" placeholder="First Name" value={signupData.first_name} onChange={handleSignupChange} required />
                      <input type="text" className="form-control mb-2" name="last_name" placeholder="Last Name" value={signupData.last_name} onChange={handleSignupChange} required />
                      <input type="text" className="form-control mb-2" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} required />
                      <input type="email" className="form-control mb-2" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required />
                      <input type="password" className="form-control mb-2" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} required />
                      {signupError && <div className="alert alert-danger">{signupError}</div>}
                      {signupSuccess && <div className="alert alert-success">{signupSuccess}</div>}
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">Sign Up</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowSignup(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage; 