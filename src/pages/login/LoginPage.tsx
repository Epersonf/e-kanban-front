import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLoginStore } from '../../stores/login.store';
import styles from './LoginPage.module.css';
import CommonInput from '../../components/common/common-input/CommonInput';
import CommonButton from '../../components/common/common-button/CommonButton';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = observer(() => {
  const loginStore = useLoginStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginStore.login({ email, password });
    if (loginStore.token) {
      alert('Login successful!');
      navigate('/boards');
    } else if (loginStore.error) {
      alert(`Login failed: ${loginStore.error}`);
    }
  };

  const handleSignup = async () => {
    await loginStore.signup({ name, surname, email, password });
    if (loginStore.token) {
      alert('Signup successful!');
    } else if (loginStore.error) {
      alert(`Signup failed: ${loginStore.error}`);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className={styles["login-page"]}>
      <h1 className={styles["login-title"]}>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        {isSignup && (
          <>
            <CommonInput
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <CommonInput
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </>
        )}
        <CommonInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CommonInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <CommonButton type="submit">{isSignup ? 'Sign Up' : 'Login'}</CommonButton>
        <CommonButton type="button" variant="secondary" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : 'Create an account'}
        </CommonButton>
        {loginStore.loading && <p className={styles.loading}>Loading...</p>}
        {loginStore.error && <p className={styles.error}>{loginStore.error}</p>}
      </form>
    </div>
  );
});

export default LoginPage;
