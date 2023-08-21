import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { BASE_URL } from '../config';
import { ErrContext } from '../context/ErrContext';

//project
import { QuestionContext } from '../context/QuestionContext';
import themeContext from '../theme/themeContext';
import ShowAd from './ShowAd';

export function NextQuestion({userData, route, questionId, response, certa, setResponse, alertaQ, setAlertQ, navigation, time}) {
    const { findNew, wasRender, findQuestion, solvedCount, setSolvedCount, questionData } = useContext(QuestionContext);
    const { setErrMessage, setAlert } = useContext(ErrContext);
    const theme = useContext(themeContext);

    const [respondeu, setRespondeu] = useState(false);
    const [firstR, setFirstR] = useState(null);
    const [resolution, setResolution] = useState(null);
    const [delay, setDelay] = useState(false);

    const sendRequest = async () => {
        if (!questionData) {
            setErrMessage("Ocorreu um erro ao enviar a resolução da questão..")
            return setAlert(true);
        };

        if (!delay) {
            setDelay(true);

            const userData = await AsyncStorage.getItem("userData");
            const token = await AsyncStorage.getItem("userToken");
            const userDataJSON = await JSON.parse(userData);

            axios.post(`${BASE_URL}/api/questions/resolution`, {
                question: questionData,
                id: userDataJSON.id
            }, {
                headers: {
                    "x-access-token": token
                },
                timeout: 10000
            }).then(async res => {
                setDelay(false);

                if (res.data.erro) {
                    setErrMessage(res.data.erro);
                    return setAlert(true);
                }
                if (res.data.message) {
                    setErrMessage(res.data.message);
                    return setAlert(true);
                }

                if (typeof res.data !== "object") {
                    try {
                        const r1 = JSON.parse(res.data);
                        setResponse(r1);
                    } catch (e) {
                        setErrMessage("Não foi possível encontrar a resolução da questão, tente novamente.");
                        setAlert(true);
                    }
                } else {
                    setResponse(res.data);
                }
            }).catch(err => {
                console.log(err);
                setDelay(false);

                if (err.response) {
                    let message = "Não foi possível completar.";
                    if (err.response.data.message) message = err.response.data.message;

                    setAlert(true);
                    setErrMessage(message);
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }
    }

    if (userData == null) return;

    console.log(solvedCount);
    if (response !== null && !respondeu && time) {
        if (solvedCount >= 5) {
            return (
                <ShowAd
                    showAd={solvedCount >= 5}
                    onAdClosed={() => {
                        console.log("O anúncio foi fechado! Obrigado <3")
                    }}
                />
            )
        }

        if (response == certa) {
            if (!respondeu) {
                setRespondeu(true);
                setFirstR(response);
                findNew(questionId, time, true);
            }

            return (
                <View>
                    <ActivityIndicator />
                    <AwesomeAlert
                    show={alertaQ}
                    onDismiss={() => {
                        setAlertQ(false);
                    }}

                    contentContainerStyle={{
                        backgroundColor: theme.backgroundColor,
                        padding: 20,
                        borderRadius: 25
                    }}

                    titleStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.mainCol,
                        fontSize: 20
                    }}
                    title="Você acertou!"

                    
                    messageStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.light,
                        fontSize: 15,
                        textAlign: "center"
                    }}
                    message={`${userData.ratingGeral} + 15`}

                    showCancelButton={questionData.image !== null ? false : true}
                    cancelText="Resolução"
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onCancelPressed={() => {
                        if (!delay) sendRequest();
                    }}

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    confirmButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onConfirmPressed={async () => {
                        if (wasRender) {
                            findQuestion(route.params.mode, route.params.filter, navigation);
                        }
                    }}
                    />
                </View>
            )
        } else {
            if (!respondeu && time) {
                setRespondeu(true);
                setFirstR(response);
                findNew(questionId, time, false);
            }

            return (
                <View>
                <AwesomeAlert
                    show={alertaQ}
                    onDismiss={() => {
                        setAlertQ(false);
                    }}

                    contentContainerStyle={{
                        backgroundColor: theme.backgroundColor,
                        padding: 20,
                        borderRadius: 25
                    }}

                    titleStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.mainCol,
                        fontSize: 20
                    }}
                    title="Você errou!"

                    
                    messageStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.light,
                        fontSize: 15,
                        textAlign: "center"
                    }}
                    message={`${userData.ratingGeral} - 15\nA alternativa certa era: "${certa}".`}

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    confirmButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onConfirmPressed={async () => {
                        if (wasRender) {
                            findQuestion(route.params.mode, route.params.filter, navigation);
                        }
                    }}

                    showCancelButton={questionData.image !== null ? false : true}
                    cancelText="Resolução"
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onCancelPressed={() => {
                        if (!delay) sendRequest();
                    }}
                    />
                </View>
            )
        }
    // se já respondeu
    } else {
        if (firstR == certa) {
            return (
                <View>
                    <AwesomeAlert
                    show={alertaQ}
                    onDismiss={() => {
                        setAlertQ(false);
                    }}

                    contentContainerStyle={{
                        backgroundColor: theme.backgroundColor,
                        padding: 20,
                        borderRadius: 25
                    }}

                    titleStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.mainCol,
                        fontSize: 20
                    }}
                    title="Você acertou!"

                    showCancelButton={questionData.image !== null ? false : true}
                    cancelText="Resolução"
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onCancelPressed={() => {
                        if (!delay) sendRequest();
                    }}

                    messageStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.light,
                        fontSize: 15,
                        textAlign: "center"
                    }}
                    message={`Parabéns!\nAlternativa correta: "${certa}"`}

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 20
                    }}
                    confirmButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onConfirmPressed={async () => {
                        if (wasRender) {
                            findQuestion(route.params.mode, route.params.filter, navigation);
                        }
                    }}
                    />
                </View>
            )
        } else {
            return (
                <View>
                <AwesomeAlert
                    show={alertaQ}
                    onDismiss={() => {
                        setAlertQ(false);
                    }}

                    contentContainerStyle={{
                        backgroundColor: theme.backgroundColor,
                        padding: 20,
                        borderRadius: 25
                    }}

                    titleStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.mainCol,
                        fontSize: 20
                    }}
                    title="Você errou!"

                    
                    messageStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.light,
                        fontSize: 15,
                        textAlign: "center"
                    }}
                    message={`A alternativa certa é: "${certa}".\nVocê marcou: "${firstR}".`}

                    showCancelButton={questionData.image !== null ? false : true}
                    cancelText="Resolução"
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onCancelPressed={() => {
                        if (!delay) sendRequest();
                    }}

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    confirmButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onConfirmPressed={async () => {
                        if (wasRender) {
                            findQuestion(route.params.mode, route.params.filter, navigation);
                        }
                    }}
                    />
                </View>
            )
        }
    }
}