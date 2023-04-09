import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { ErrContext } from '../context/ErrContext';
import { QuestionContext } from '../context/QuestionContext';
import themeContext from '../theme/themeContext';

export function NextQuestion({userData, route, questionId, response, certa, setResponse, alertaQ, setAlertQ, navigation}) {
    const theme = useContext(themeContext);
    const { findNew, wasRender, findQuestion } = useContext(QuestionContext);

    const [respondeu, setRespondeu] = useState(false);
    const [firstR, setFirstR] = useState(null);

    if (userData == null) return;

    if (response !== null && !respondeu) {
        if (response == certa) {
            if (!respondeu) {
                setRespondeu(true);
                setFirstR(response);
                findNew(questionId, true);
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
                        padding: 20
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

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol
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

                    showCancelButton={true}
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    cancelText="Resolução"
                    />
                </View>
            )
        } else {
            if (!respondeu) {
                setRespondeu(true);
                setFirstR(response);
                findNew(questionId, false);
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
                        padding: 20
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
                        backgroundColor: theme.mainCol
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

                    showCancelButton={true}
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    cancelText="Resolução"
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
                        padding: 20
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
                    message={`Parabéns!\nAlternativa correta: "${certa}"`}

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol
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

                    showCancelButton={true}
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    cancelText="Resolução"
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
                        padding: 20
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

                    showConfirmButton={true}
                    confirmText="Próxima questão"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol
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

                    showCancelButton={true}
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    cancelText="Resolução"
                    />
                </View>
            )
        }
    }
}