import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage({ text: response.data.message, isError: false });
      setFormData({ username: '', password: '' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data.message || 'Error registering', 
        isError: true 
      });
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Register
        </button>
        {message.text && (
          <p className={`${styles.message} ${message.isError ? styles.error : styles.success}`}>
            {message.text}
          </p>
        )}
        <div className={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;