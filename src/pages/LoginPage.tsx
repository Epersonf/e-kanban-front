import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLoginStore } from '../stores/login.store';

const LoginPage: React.FC = observer(() => {
  const loginStore = useLoginStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    await loginStore.login({ email, password });
    if (loginStore.token) {
      alert('Login successful!');
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
    <div>
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : 'Create an account'}
        </button>
        {loginStore.loading && <p>Loading...</p>}
        {loginStore.error && <p>Error: {loginStore.error}</p>}
      </form>
    </div>
  );
});

export default LoginPage;
