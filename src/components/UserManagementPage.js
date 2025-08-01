import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Container, Spinner, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUnlockAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users.');
            setLoading(false);
            if ([401, 403].includes(err.response?.status)) {
                logout();
                navigate('/login');
            }
        }
    }, [logout, navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (e, userId) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleAction = async (action) => {
        if (selectedUsers.length === 0) {
            setError('Please select at least one user.');
            return;
        }
        try {
            let res;
            if (action === 'block') {
                res = await api.post('/users/block', { userIds: selectedUsers });
            } else if (action === 'unblock') {
                res = await api.post('/users/unblock', { userIds: selectedUsers });
            } else if (action === 'delete') {
                res = await api.delete('/users', { data: { userIds: selectedUsers } });
            }
            setSuccessMessage(res.data.message);
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed.');
            if ([401, 403].includes(err.response?.status)) {
                logout();
                navigate('/login');
            }
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">User Management</h1>
                <Button variant="outline-danger" onClick={logout}>Logout</Button>
            </div>
            
            <div className="bg-light p-3 rounded d-flex align-items-center mb-3">
                <h5 className="mb-0 me-3">Actions:</h5>
                <OverlayTrigger placement="top" overlay={<Tooltip id="block-tooltip">Block Users</Tooltip>}>
                    <Button variant="danger" onClick={() => handleAction('block')} className="me-2" disabled={selectedUsers.length === 0}>
                        Block
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip id="unblock-tooltip">Unblock Users</Tooltip>}>
                    <Button variant="success" onClick={() => handleAction('unblock')} className="me-2" disabled={selectedUsers.length === 0}>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete Users</Tooltip>}>
                    <Button variant="secondary" onClick={() => handleAction('delete')} className="me-2" disabled={selectedUsers.length === 0}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                </OverlayTrigger>
            </div>

            {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive className="bg-white">
                    <thead>
                        <tr className="align-middle text-center">
                            <th style={{ width: '40px' }}>
                                <Form.Check
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedUsers.length === users.length && users.length > 0}
                                />
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Last Login Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className={user.status === 'blocked' ? 'table-secondary' : ''}>
                                <td className="align-middle text-center">
                                    <Form.Check
                                        type="checkbox"
                                        onChange={(e) => handleSelectUser(e, user.id)}
                                        checked={selectedUsers.includes(user.id)}
                                    />
                                </td>
                                <td className="align-middle">{user.name}</td>
                                <td className="align-middle">{user.email}</td>
                                <td className="align-middle">{formatDateTime(user.last_login_time)}</td>
                                <td className="align-middle text-center">
                                    <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default UserManagementPage;