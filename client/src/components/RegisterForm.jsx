import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // import useNavigate

import { registerUser } from '../api/apis';

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate(); // initialize useNavigate

  const onSubmit = async (data) => {
    if (data.password !== data.repeatPassword) {
      setError('repeatPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    try {
      await registerUser(data);
      setSuccessMessage('Registration successful!'); // This line is now inside the try block
      navigate('/login'); // navigate to login page after successful registration
    } catch (error) {
      // console.log(error.response.data); // Add this line
      if (error.response && error.response.status === 400) {
        setError('email', {
          type: 'manual',
          message: error.response.data.errors[0].msg,
        });
      } else {
        setServerError('Something went wrong. Please try again later');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username', { required: true, minLength: 6, maxLength: 32 })} placeholder="Username" />
      {errors.username && <p>Username is required and must be between 6 and 32 characters</p>}

      <input
        type="password"
        {...register('password', { required: true, minLength: 8, maxLength: 128 })}
        placeholder="Password"
      />
      {errors.password && <p>Password is required and must be between 8 and 128 characters</p>}

      <input type="password" {...register('repeatPassword', { required: true })} placeholder="Repeat Password" />
      {errors.repeatPassword && <p>Please repeat your password</p>}

      <input type="email" {...register('email', { required: true })} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      {serverError ? <p>{serverError}</p> : successMessage && <p>{successMessage}</p>}

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
