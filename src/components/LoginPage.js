import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card className="p-4" style={{ minWidth: '400px' }}>
                <Card.Header className="text-center bg-primary text-white">
                    <h2 className="mb-0">Login</h2>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <Form.Check type="checkbox" label="Remember me" />
                           <a href="/forgot-password" className="text-muted">Forgot password?</a>
                        </div>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                    Don't have an account? <a href="/register">Register</a>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default LoginPage;