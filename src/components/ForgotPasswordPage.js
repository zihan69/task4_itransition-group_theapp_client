import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card className="p-4" style={{ minWidth: '400px' }}>
                <Card.Header className="text-center bg-info text-white">
                    <h2 className="mb-0">Forgot Password</h2>
                </Card.Header>
                <Card.Body>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <p className="text-muted">Enter your email address to receive a password reset link.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Button variant="info" type="submit" className="w-100" disabled={loading}>
                            <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                    <a href="/login">Back to Login</a>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default ForgotPasswordPage;