import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 

import { registerUser } from '../api/apis';

function RegisterForm() {
  const {
    // register yra funkcija, kuri yra naudojama, kad registruoti formos laukus
    register,
    // handleSubmit yra funkcija, kuri yra naudojama, kad apdoroti formos duomenis ir išsiųsti užklausą į serverį
    handleSubmit,
    // formState yra objektas, kuris turi visas formos savybes, kurios yra naudojamos formos valdymui, 
    // kaip pavyzdžiui, klaidos, kurių yra formoje ar success, kuri yra naudojama, kad nurodyti, kad forma buvo sėkmingai išsiųsta
    formState: { errors },
    // setError yra funkcija, kuri yra naudojama, kad nurodyti klaidas formos laukuose
    setError,
  } = useForm();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // prieš išsiunčiant užklausą į serverį, patikriname ar slaptažodžiai sutampa
    // Patikrinant ir kliento pusėje ar slaptažodis sutampa, nes taip išvengiame nereikalingų užklausų į serverį
    if (data.password !== data.repeatPassword) {
      setError('repeatPassword', {
        // type: 'manual' nurodo, kad klaida yra nurodyta rankiniu būdu
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      // išsiunčiame užklausą į serverį, kad užregistruoti vartotoją
      await registerUser(data);
      setSuccessMessage('Registration successful!');
      navigate('/login');
    } catch (error) {
      // console.log(error.response.data);
      // jeigu iš serverio gauname klaidą, tai ją apdorojame ir nurodome, kad klaida yra email lauke
      if (error.response && error.response.status === 400) {
        setError('email', {
          type: 'manual',
          // error.response.data.errors[0].msg yra klaidos pranešimas iš serverio
          // geriau yra naudoti klaidos pranešimą iš serverio negu parašant kalidas kliento pusėje, nes serveris gali turėti skirtingus klaidos pranešimus
          // data.errors[0].msg, pas kiekviena bus skirtingas jeigu naudoiste kitą programavimo kalbą ar kitaip gaunate klaidos pranešimus
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
