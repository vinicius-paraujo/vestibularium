// react and other dependencies
import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// from project
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';
import { ErrContext } from './ErrContext';

export const QuestionContext = createContext();

export const QuestionProvider = ({children}) => {
    const {logout} = useContext(AuthContext);
    const {setErrMessage, setAlert} = useContext(ErrContext);

    const [questionFilter, setFilter] = useState()
    const [questionMode, setQuestionMode] = useState();
    const [questionData, setQuestionData] = useState();
    const [questionWasResponse, setWasResponse] = useState(false);

    const [renew, setRenew] = useState(false);

    const [wasRender, setRender] = useState(false);

    // alterar rating quando resolve
    const findNew = async (questionId, acertou) => {
        let token = await AsyncStorage.getItem("userToken");
        const userData = await AsyncStorage.getItem("userData");
        const dataJ = JSON.parse(userData);

        axios.post(`${BASE_URL}/api/refresh`, {
            token: token,
            id: dataJ.id
        }, {
            timeout: 10000
        }).then(async r => {
            await AsyncStorage.setItem("userToken", r.data.token);
            token = r.data.token;

            console.log(token)

            axios.post(`${BASE_URL}/questions/solved`, {
                userId: dataJ.id,
                questionId: questionId,
                acertou: acertou
            }, {
                headers: {
                    "x-access-token": token
                },
                timeout: 10000
            }).then(async r => {
                console.log(r.data)
                await AsyncStorage.setItem("userRating", String(r.data.rating));
            }).catch(err => {
                console.log(err);
    
                if (err.response) {
                    switch (err.response.status) {
                        case 400:
                            setErrMessage("Ei! Nós não temos mais questões deste tipo em nosso banco de dados no momento.");
                            setAlert(true);
                            break;
                        case 401:
                            console.log('erro 401')
                            logout();
                            setErrMessage("Sua sessão expirou.");
                            setAlert(true);
                            break;
                        case 404:
                            console.log("erro 404")
                    }
                } else if (error.request) {
                    setErrMessage("Não foi possível conectar ao servidor.");
                    setAlert(true);
                }
            })
        }).catch(err => {
            if (err) console.log(err);
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        setAlert(true);
                        setErrMessage("Sua sessão expirou.");
                        logout();
                        break;
                }
            } else if (err.request) {
                setErrMessage("Não foi possível conectar ao banco de dados.");
                setAlert(true);
            }
        })
    }

    const findQuestion = async (mode, filter, navigation) => {
        let token;
        token = await AsyncStorage.getItem("userToken");

        const userData = await AsyncStorage.getItem("userData");
        const dataJ = JSON.parse(userData);

        console.log("token antes do refresh: "+token)
        
        setQuestionMode(questionMode);
        setFilter(questionFilter);

        // refresh
        axios.post(`${BASE_URL}/api/refresh`, {
            token: token,
            id: dataJ.id
        }, {
            timeout: 10000
        }).then(async r => {
            console.log("token na hora do refresh: "+r.data.token)
            await AsyncStorage.setItem("userToken", r.data.token);
            token = r.data.token;

            axios.post(`${BASE_URL}/questions`, {
                mode: mode,
                filter: filter,
                userId: dataJ.id
            }, {
                headers: {
                    "x-access-token": token
                },
                timeout: 10000
            }).then(r => {
                let quest = r.data[0];
                console.log(quest);

                setQuestionData(quest);

                if (!wasRender) {
                    navigation.navigate("Question", { id: quest.id, mode: mode, filter: filter});   
                    setRender(true);
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Question', params: { id: quest.id, mode: mode, filter: filter}}]
                    });
                }
                
            }).catch(err => {
                if (err) console.log(err);
                if (err.response) {
                    switch (err.response.status) {
                        case 400:
                            setErrMessage("Ei! Nós não temos mais questões deste tipo em nosso banco de dados no momento.");
                            setAlert(true);
                            break;
                        case 401:
                            setAlert(true);
                            setErrMessage("Sua sessão expirou.");
                            logout();
                            break;
                    }
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }).catch(err => {
            if (err) console.log(err);
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        setAlert(true);
                        setErrMessage("Sua sessão expirou.");
                        logout();
                        break;
                }
            } else if (err.request) {
                setErrMessage("Não foi possível conectar ao banco de dados.");
                setAlert(true);
            }
        });
    };

    return (
        <QuestionContext.Provider value={{findQuestion, setQuestionMode, setFilter, questionData, findNew, setWasResponse, questionWasResponse, setRender, wasRender, setQuestionData}}>
            {children}
        </QuestionContext.Provider>
    )
};