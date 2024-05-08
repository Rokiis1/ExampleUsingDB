import { createContext, useState, useEffect } from 'react';
// jwtDecode yra biblioteka, kuri yra naudojama, kad iš tokeno išgauti vartotojo duomenis
//  tai nėra, kad nuskaitytu iš serverio duomenis
// ar kad išsaugotų duomenis į serverį, tai tik iš tokeno išgauna vartotojo duomenis
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../api/apis';

// Pats context principas yra tas, kad mes sukuriame vieną objektą, kuris bus pasiekiamas visoje programoje
// Pavzydys būtu su liftu - mes turime liftą, kuris yra visoje pastate ir kiekvienas gali jo naudoti
// Tai čia mes sukuriame AuthContext objektą, kuris bus pasiekiamas visoje programoje
// Pats createContext() metodas sukuria objektą, kuris turi dvi savybes: Provider ir Consumer
// Provider yra tas objektas, kuris pateikia duomenis, o Consumer yra tas objektas, kuris gali gauti duomenis
export const AuthContext = createContext();

// Tai yra AuthProvider komponentas, kuris yra naudojamas, kad pateikti duomenis AuthContext objektui
// children yra visi komponentai, kurie yra AuthProvider komponento viduje
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // token neegzistuoja, tai localStorage.getItem('token') grąžins null, o jei token yra, tai grąžins token
  // Tai čia jeigu expire tokenas, tai jis bus null, o jeigu jis yra, tai jis bus token
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  // pats useEffect() skirtas vykdyti veiksmus, kai komponentas atnaujinamas arba priklauso nuo tam tikrų reikšmių pokyčių 
  // Ppavyzdžiu, kai atnaujiname puslapį, tai mes turime patikrinti ar yra tokenas, kad vartotojas būtu prisijungę
  // Tai reiškia, kad šis kodas bus įvykdytas tik vieną kartą, kai komponentas yra surenderintas, ir nebebus kviečiamas vėliau, nebent komponento būsenos pasikeistų.
  useEffect(() => {
    // Išsaugome state token kaip kinamąjį token, kad būtu galima iš storage tokeną, kuris yra saugomas localStorage objekte
    // tai mes galime nuo dabar naudoti kintamajį token, kag galėtume naudoti visoje programoje
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
     // state user yra naudojamas, kad išsaugoti vartotojo duomenis, kurie yra išgaunami iš tokeno tai mes naudojame, kaip kinamąjį user
      const user = jwtDecode(token);
      console.log('User from jwtDecode:', user);
      // Tada mes setToken(token) ir setUser(user), kad išsaugoti token ir user state objektuose
      setToken(token);
      setUser(user);
    }
    // setIsLoading() metodas yra naudojamas, kad nustatyti, kad duomenys yra užkrauti ir galima juos naudoti
    // mes nurodome false, nes duomenys yra užkrauti
    setIsLoading(false);
  }, []);

  // loginUser() metodas yra naudojamas, kad prisijungti prie sistemos
  // data yra objektas, kuris turi duomenis, kurie yra reikalingi prisijungimui
  const loginUser = async (data) => {
    try {
      // apiClient yra axios objektas, kuris yra naudojamas, kad siųsti užklausas į serverį
      const response = await apiClient.post('/users/login', {
        // pats serveris gali turėti skirtingus duomenis, kurie yra reikalingi prisijungimui
        // Pas mane šiuo atveju yra login ir password, bet jūsų atveju gali būti email ir password arba kitokie duomenys
        login: data.login,
        password: data.password,
      });
      if (response.data) {
        console.log(response.data);
        // nurodome, kad response.data turi būti tokenas, kuris yra grąžinamas iš serverio, nes jis yra reikalingas, kad prisijungti prie sistemos
        const token = response.data.token;
        console.log(token);
        // tai ties ta vieta, mes naudojame user state objektą, kad išsaugoti vartotojo duomenis, kurie yra iš tokeno, kai vartotojas prisijungia
        // o viršuje naudojome useEffect() metodą, kad išsaugoti vartotojo duomenis, kurie yra iš tokeno, tai bus pasiekiamas visada, kai atnaujiname puslapį
        const user = jwtDecode(token);
        // Naudojame localStorage.setItem('token', token), tai todėl, kad kai atnaujiname puslapį, tai mes neprarasime prisijungimo duomenų (token ir user)
        console.log('User from loginUser:', user);
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        // grąžiname token ir user, kaip objektą, kad būtu galima naudoti kituose komponentuose
        return { token, user };
      } else {
        throw new Error('Response data is undefined');
      }
    } catch (error) {
      console.error('Failed to log in:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    // siūsime value kaip props į AuthContext.Provider komponentą, kad būtu galima pasiekti duomenis kituose komponentuose globaliai
    <AuthContext.Provider value={{ isLoading, token, user, loginUser, logoutUser }}>{children}</AuthContext.Provider>
  );
};
