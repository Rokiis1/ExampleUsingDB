import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';

// Realiai, useAuth yra funkcija kuri grąžina AuthContext objektą iš useContext() metodo
// Tai mes ta funkcija pernaudosime ištraukiant specifinius duomenys pernaudojant
// privateRoutes, nes mus reikia tik user ir isLoading duomenų, nevisą AuthContext objektą naudoti
export function useAuth() {
  return useContext(AuthContext);
}
