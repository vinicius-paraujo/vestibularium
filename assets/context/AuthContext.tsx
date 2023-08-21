import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import { BASE_URL } from '../config';
import { ErrContext } from './ErrContext';

export const AuthContext = createContext({
    login: null,
    logout: null, 
    isLoading: false,
    userToken: null,
    register: null,
    googleRegister: null,
    googleLogin: null,
    deleteAccount: null,
    recover: null
});

export const AuthProvider = ({children}) => {
    const { setErrMessage, setAlert } = useContext(ErrContext);

    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [delay, setDelay] = useState(false);

    const login = (user, password) => {
        if (!delay) {
            setDelay(true);
            axios.post(`${BASE_URL}/auth/login`, {
                user: user,
                password: password,
                typeRegister: 'default'
            }, {
                timeout: 10000
            }).then(res => {
                setDelay(false);
                setUserToken(res.data.token);

                const statsData = {
                    solvedQuestions: res.data.solvedQuestions,
                    qCertas: res.data.qCertas,
                    time: res.data.time
                }

                console.log(res.data.verificado);

                if (res.data.verificado !== 1) {
                    setAlert(true);
                    setErrMessage("Certifique-se de manter a segurança em sua conta e verifique seu email.")
                }

                console.log(res.data)
                AsyncStorage.setItem("userToken", res.data.token);
                AsyncStorage.setItem("userAvatar", res.data.avatar);
                AsyncStorage.setItem("userStats", JSON.stringify(statsData));
                AsyncStorage.setItem("userData", JSON.stringify(res.data));
                AsyncStorage.setItem("userRating", String(res.data.ratingGeral));
            }).catch(async err => {
                setDelay(false);
                console.log(err);
                if (err.response) {
                    setAlert(true);
                    setErrMessage(err.response.data.message);
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }
    }

    const recover = (email) => {
        if (!delay) {
            setDelay(true);
            axios.post(`${BASE_URL}/api/users/account/forgot`, {
                email: email
            }, {
                timeout: 10000
            }).then(res => {
                setDelay(false);
                
                setAlert(true)
                setErrMessage(res.data.message);
            }).catch(async err => {
                setDelay(false);
                if (err.response) {
                    setAlert(true);
                    setErrMessage(err.response.data.message);
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }
    }

    const register = (user, email, password, type) => {
        if (!delay) {
            setDelay(true);
            axios.post(`${BASE_URL}/auth/register`, {
                username: user,
                email: email,
                password: password,
                typeRegister: type
            }, {
                timeout: 10000
            }).then(res => {
                setDelay(false);
                setUserToken(res.data.token);

                const statsData = {
                    solvedQuestions: -1,
                    qCertas: null,
                    time: "0:00"
                }

                AsyncStorage.setItem("userStats", JSON.stringify(statsData));
                AsyncStorage.setItem("userToken", res.data.token);
                AsyncStorage.setItem("userData", JSON.stringify(res.data));
                AsyncStorage.setItem("userAvatar", "default");
                AsyncStorage.setItem("userRating", "0");

                setErrMessage(`Enviamos um link de verificação para "${email}".`)
                setAlert(true);
            }).catch(async err => {
                setDelay(false);
                if (err) console.log("erro: "+err);
                if (err.response) {
                    setAlert(true);
                    return setErrMessage(err.response.data.message);
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }
    }

    const googleRegister = (data, token) => {
        if (!delay) {
            setDelay(true);

            axios.post(`${BASE_URL}/auth/register`, {
                data: data,
                token: token,
                typeRegister: 'google'
            }, {
                timeout: 10000
            }).then(res => {
                setDelay(false);
                setUserToken(res.data.token);
                console.log(res.data);

                const statsData = {
                    solvedQuestions: -1,
                    qCertas: null,
                    time: "0:00"
                }

                AsyncStorage.setItem("userStats", JSON.stringify(statsData));
                AsyncStorage.setItem("userToken", res.data.token);
                AsyncStorage.setItem("userData", JSON.stringify(res.data));
                AsyncStorage.setItem("userAvatar", "default");
                AsyncStorage.setItem("userRating", `0`);
            }).catch(err => {
                setDelay(false);
                if (err) console.log("erro: "+err);
                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            setAlert(true);
                            setErrMessage("Ocorreu um erro na autenticação, tente.");
                        case 409:
                            setAlert(true);
                            setErrMessage("Usuário ou email já cadastrado.");
                            break;
                    }
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            })
        };
    };

    const googleLogin = (data, token) => {
        if (!delay) {
            if (data.error) {
                setAlert(true);
                setErrMessage("Ocorreu um erro na autenticação, tente novamente.");
                return;
            };
            setDelay(true);

            axios.post(`${BASE_URL}/auth/login`, {
                data: data,
                token: token,
                typeRegister: 'google'
            }, {
                timeout: 10000
            }).then(res => {
                setDelay(false);

                console.log(res.data);
                setUserToken(res.data.token);
                console.log(res.data.avatar)

                const statsData = {
                    solvedQuestions: res.data.solvedQuestions,
                    qCertas: res.data.qCertas,
                    time: res.data.time
                }

                AsyncStorage.setItem("userStats", JSON.stringify(statsData));
                AsyncStorage.setItem("userToken", res.data.token);
                AsyncStorage.setItem("userData", JSON.stringify(res.data));
                AsyncStorage.setItem("userAvatar", res.data.avatar);
                AsyncStorage.setItem("userRating", String(res.data.ratingGeral));
            }).catch(err => {
                setDelay(false);
                if (err) console.log("erro: "+err);
                if (err.response) {
                    let message;
                    if (err.response.data.message) message = err.response.data.message;
                    else message = "Não foi possível completar, aguarde alguns segundos e tente novamente."

                    setAlert(true);
                    setErrMessage(message);
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            })
        };
    };

    const logout = () => {
        setUserToken(null);
        AsyncStorage.removeItem("userToken")
        AsyncStorage.removeItem("userData")
        AsyncStorage.removeItem("userRating");
        AsyncStorage.removeItem("userAvatar");
        AsyncStorage.removeItem("userStats");
        setIsLoading(false);
    }

    const deleteAccount = () => {
        if (!delay) {
            axios.post(`${BASE_URL}/api/users/settings/delete`,{},{
                headers: {
                    "x-access-token": userToken
                },
                timeout: 10000
            }).then(result => {
                setDelay(false);
                logout();
            }).catch(err => {
                setDelay(false);
                if (err.response) {
                    if (err.response.status == 401) logout();
                    setAlert(true);
                    setErrMessage(err.response.data.message)
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
    }
    }

    const isLoggedIn = async () => {
        try {
            const userTk = await AsyncStorage.getItem("userToken");
            const userAv = await AsyncStorage.getItem("userAvatar");
            setUserToken(userTk);

            console.log("token: "+userTk);
            console.log("avatar: "+userAv)
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, register, googleRegister, googleLogin, deleteAccount, recover}}>
            {children}
        </AuthContext.Provider>
    )
};