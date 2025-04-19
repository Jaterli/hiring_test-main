import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AuthForms.module.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      onLogin();
      navigate('/play');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('User not found. Please register first.');
      } else {
        setError(error.response?.data.message || 'Error logging in');
      }
    }
  };

  return (
    <div className={styles['auth-container']}>
      <form onSubmit={handleSubmit} className={styles['auth-form']}>
        <h2 className={styles['auth-title']}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={styles['auth-input']}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={styles['auth-input']}
          required
        />
        <button type="submit" className={`${styles['auth-button']} ${styles['login-button']}`}>
          Login
        </button>
        {error && <p className={`${styles['auth-message']} ${styles['error-message']}`}>{error}</p>}
        <div className={styles['auth-link-container']}>
          Not registered yet? <br /><Link to="/register" className={styles['auth-link']}>Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;