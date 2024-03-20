import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../utils/AuthContext';

function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loginUser } = useContext(AuthContext);
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      if (result && result.token) {
        if (result.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Username or Email:
        <input {...register('login', { required: 'Username is required' })} />
        {errors.username && <p>{errors.username.message}</p>}
      </label>
      <label>
        Password:
        <input type="password" {...register('password', { required: 'Password is required' })} />
        {errors.password && <p>{errors.password.message}</p>}
      </label>
      {serverError && <p>{serverError}</p>}
      <input type="submit" value="Log in" />
    </form>
  );
}

export default LoginForm;
