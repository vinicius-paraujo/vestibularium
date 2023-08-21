// react and other dependencies
import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// from project
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';
import { ErrContext } from './ErrContext';

export const QuestionContext = createContext({
    findQuestion: null,
    setQuestionMode: null,
    setFilter: null,
    questionData: null,
    findNew: null,
    setWasResponse: null,
    questionWasResponse: null,
    setRender: null,
    wasRender: null,
    setQuestionData: null,
    showAd: null,
    setShowAd: null,
    setSolvedCount: null,
    solvedCount: null
});

export const QuestionProvider = ({children}) => {
    const {logout} = useContext(AuthContext);
    const {setErrMessage, setAlert} = useContext(ErrContext);

    const [questionFilter, setFilter] = useState()
    const [questionMode, setQuestionMode] = useState();
    const [questionData, setQuestionData] = useState();
    const [questionWasResponse, setWasResponse] = useState(false);
    const [solvedCount, setSolvedCount] = useState(0);
    const [showAd, setShowAd] = useState(false);

    const [delay, setDelay] = useState(false);

    const [wasRender, setRender] = useState(false);

    // alterar rating quando resolve
    const findNew = async (questionId: any, time, acertou) => {
        let token = await AsyncStorage.getItem("userToken");
        const userData = await AsyncStorage.getItem("userData");
        const dataJ = JSON.parse(userData);

        setSolvedCount((prevState) => {
            return prevState+1;
        })

        axios.post(`${BASE_URL}/api/refresh`, {
            token: token,
            id: dataJ.id,
        }, {
            timeout: 10000
        }).then(async r => {
            await AsyncStorage.setItem("userToken", r.data.token);
            token = r.data.token;

            if (!time) return;

            axios.post(`${BASE_URL}/api/questions/solved`, {
                questionId: questionId,
                acertou: acertou,
                time: time
            }, {
                headers: {
                    "x-access-token": token
                },
                timeout: 10000
            }).then(async r => {
                const statsData = {
                    solvedQuestions: r.data.solvedQuestions,
                    qCertas: r.data.qCertas,
                    time: r.data.time
                }

                await AsyncStorage.setItem("userRating", String(r.data.rating));
                await AsyncStorage.setItem("userStats", JSON.stringify(statsData));

            }).catch(err => {
                console.log(err);
    
                if (err.response) {
                    switch (err.response.status) {
                        case 429:
                            setErrMessage("Você alcançou o número máximo de requisições por minuto, aguarde e tente novamente.");
                            setAlert(true);
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
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao servidor.");
                    setAlert(true);
                }
            })
        }).catch(err => {
            if (err) console.log(err);
            if (err.response) {
                switch (err.response.status) {
                    case 429:
                        setAlert(true);
                        setErrMessage("Você fez muitas solicitações em um minuto, aguarde um pouco.");
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
        if (!delay) {
            setDelay(true);

            const userData = await AsyncStorage.getItem("userData");
            const dataJ = JSON.parse(userData);

            const token = await AsyncStorage.getItem("userToken");
            
            setQuestionMode(questionMode);
            setFilter(questionFilter);

            // refresh
            axios.post(`${BASE_URL}/api/questions`, {
                mode: mode,
                filter: filter,
                id: dataJ.id
            }, {
                headers: {
                    "x-access-token": token
                },
                timeout: 10000
            }).then(r => {
                setDelay(false);

                let quest = r.data.rows[0];
                if (r.data.token) AsyncStorage.setItem("userToken", r.data.token);

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
                setDelay(false);
                if (err) console.log(err);
                if (err.response && err.response.data.message) console.log(err.response.data.message);
                
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
                        case 429:
                            setAlert(true);
                            setErrMessage("Você fez muitas solicitações, aguarde um pouco e tente novamente.")
                    }
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }
    };

    return (
        <QuestionContext.Provider value={{findQuestion, setQuestionMode, setFilter, questionData, findNew, setWasResponse, questionWasResponse, setRender, wasRender, setQuestionData, showAd, setShowAd, setSolvedCount, solvedCount}}>
            {children}
        </QuestionContext.Provider>
    )
};