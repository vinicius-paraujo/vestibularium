import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ImageBackground, Image, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons';

import themeContext from '../theme/themeContext';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

import { BASE_URL } from '../config';
import { ErrContext } from '../context/ErrContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Redacao() {
    // writing - waiting - result
    const theme = useContext(themeContext);
    const { setAlert, setErrMessage } = useContext(ErrContext);

    const [mode, setMode] = useState('writing');
    const [tema, setTema] = useState("");
    const [text, setText] = useState("");
    const [response, setResponse] = useState({nota: null, c1: null, c2: null, c3: null, c4: null, c5: null, obs: null});
    const [textInputHeight, setTextInputHeight] = useState(0);

    const [alert, setAlerta] = useState(false);
    const [delay, setDelay] = useState(false);

    const [fontsLoaded] = useFonts({
        'MADETOMMY': require('../fonts/MADETOMMY.ttf'),
        'MADETOMMY-BOLD': require("../fonts/MADETOMMY-BOLD.otf"),
        'COURIER': require("../fonts/Courier.ttf")
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
      if (!fontsLoaded) {
        return null;
    }

    const changeText = (text) => {
        setText(text);
        setTextInputHeight(Math.min(700, Math.max(180, text.length * 10)));
    };

    const onSubmit = () => {
        setAlerta(true);
    };

    const randomTema = () => {
        var temas = [
            "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
            "Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil",
            "O estigma associado às doenças mentais na sociedade brasileira",
            "O desafio de reduzir as desigualdades entre as regiões do Brasil",
            "Democratização do acesso ao cinema no Brasil",
            "Manipulação do comportamento do usuário pelo controle de dados na Internet",
            "Desafios para a formação educacional de surdos no Brasil",
            "Caminhos para combater a intolerância religiosa no Brasil",
            "A persistência da violência contra a mulher na sociedade brasileira",
            "Publicidade infantil em questão no Brasil",
            "Efeitos da implantação da Lei Seca no Brasil",
            "Movimento imigratório para o Brasil no século 21",
            "Viver em rede no século XXI: os limites entre o público e o privado",
            "O trabalho na construção da dignidade humana"
        ];       
        var iTema = Math.floor(Math.random() * temas.length);   
        return temas[iTema];
    }

    if (tema.length <= 0) {
        setTema(randomTema);
    }

    const sendRequest = async () => {
        if (text.length < 50) {
            setErrMessage("Sua redação é muito curta, tente acrescentar mais algumas informações.")
            return setAlert(true);
        };

        if (!delay) {
            setDelay(true);
            setMode("waiting");

            const userData = await AsyncStorage.getItem("userData");
            const token = await AsyncStorage.getItem("userToken");
            const userDataJSON = await JSON.parse(userData);

            axios.post(`${BASE_URL}/api/redacao/corrigir`, {
                tema: tema,
                text: text,
                id: userDataJSON.id
            }, {
                headers: {
                    "x-access-token": token
                },
                timeout: 10000
            }).then(async res => {
                setDelay(false);

                if (res.data.message) {
                    setErrMessage(res.data.message);
                    setMode("writing");
                    return setAlert(true);
                }

                if (typeof res.data !== "object") {
                    try {
                        const r1 = JSON.parse(res.data);
                        setResponse(r1);
                    } catch (e) {
                        setErrMessage("Não foi possível corrigir sua redação, tente novamente.");
                        setAlert(true);
                    }
                } else {
                    setResponse(res.data);
                }
                setMode('result');

                console.log(typeof res.data);
                console.log(res.data);
                console.log(response);
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
    
    // style
    const styles = StyleSheet.create({
        title1: {
            fontSize: 16,
            fontFamily: 'MADETOMMY-BOLD',
            color: "#FFF"
        }
    });
    if (mode == 'writing') {
        console.log(textInputHeight);
        console.log(tema);

        return (
            <SafeAreaView onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: theme.theme == "dark" ? "#666" : "#c9c9c9" }}>
                <ScrollView>
                <AwesomeAlert
                    show={alert}
                    onDismiss={() => {
                        setAlerta(false);
                    }}

                    contentContainerStyle={{
                        backgroundColor: theme.backgroundColor,
                        padding: 20,
                        borderRadius: 25,
                    }}

                    titleStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.mainCol,
                        fontSize: 20
                    }}
                    title="Você tem certeza?"

                    
                    messageStyle={{
                        fontFamily: "MADETOMMY",
                        color: theme.light,
                        fontSize: 15,
                        textAlign: "center"
                    }}
                    message={`Por favor, verifique se tudo está em ordem antes de enviar sua redação para correção.`}

                    showConfirmButton={true}
                    confirmText="Sim, prosseguir!"
                    confirmButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25
                    }}
                    confirmButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    onConfirmPressed={async () => {
                        sendRequest();
                        setAlerta(false);
                    }}

                    showCancelButton={true}
                    cancelButtonStyle={{
                        backgroundColor: theme.mainCol,
                        borderRadius: 25,
                    }}
                    cancelButtonTextStyle={{
                        fontFamily: "MADETOMMY",
                        fontSize: 15
                    }}
                    cancelText="Não, ainda não."
                    onCancelPressed={() => setAlerta(false)}
                />

                <View style={{flex: 1, borderRadius: 15, marginVertical: 30, marginHorizontal: 10, shadowColor: "#fff", shadowOffset: {width: 40, height: 20}, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10}}>
                    <Image style={{ flex: 1, position: 'absolute', width: '100%', height: '100%', borderRadius: 15 }} source={require("../images/purple-bg.jpg")} />
                    <View style={{marginVertical: 20, marginHorizontal: 15}}>
                        <Text style={{color: "#fff", fontFamily: "MADETOMMY-BOLD", letterSpacing: 2 }}>CORRETOR DE REDAÇÕES</Text>
                        <TouchableOpacity onPress={() => { setTema(randomTema) }} style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, alignItems: 'center'}}>
                            <Ionicons name={"refresh-outline"} size={14} color={"#fff"} style={{opacity: .5, alignSelf: 'center'}} />
                            <Text style={{fontFamily: 'MADETOMMY', color: "#fff", marginTop: 10, opacity: .5}}>Clique para alterar o tema.</Text>
                        </TouchableOpacity>
                        <Text style={{fontFamily: 'MADETOMMY', color: "#fff", marginTop: 10}}>Desenvolva uma redação nos moldes do <Text style={{fontFamily: 'MADETOMMY-BOLD'}}>ENEM</Text>, abordando o tema "<Text style={{fontFamily: 'MADETOMMY-BOLD'}}>{tema}</Text>". {"\nNossa inteligência artificial avaliará sua redação de acordo com as cinco competências exigidas pela prova do ENEM, que são: domínio da norma culta da língua escrita, compreensão e desenvolvimento do tema, estrutura textual, argumentação e proposta de intervenção social."}</Text>

                        <View style={{flex: 1}}>
                            <TextInput multiline textAlignVertical='top' onChangeText={(t) => { changeText(t) }} placeholder="Ao longo do processo de formação da sociedade, o pensamento cinematográfico consolidou-se em diversas comunidades. No início do século XX, com os regimes totalitários, por exemplo, o cinema era utilizado como meio de dominação à adesão das massas ao governo. [...]" style={{
                                marginTop: 20,
                                height: textInputHeight < 180 ? 180 : textInputHeight,
                                backgroundColor: theme.backgroundColor,
                                padding: 20,
                                borderRadius: 5,
                                color: theme.light,
                                fontFamily: 'COURIER'
                            }} placeholderTextColor={theme.light} />
                            <Text style={{ fontFamily: 'MADETOMMY', color: "#fff", textAlign: 'right'}}>{text.length} caracteres</Text>
                        </View>

                        <View style={{flex: 1, marginTop: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => onSubmit() } style={{
                                backgroundColor: theme.backgroundColor,
                                padding: 10,
                                width: '100%',
                                borderRadius: 40,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <Text style={{fontFamily: 'MADETOMMY', fontSize: 15, color: theme.light, marginLeft: 5}}>Está tudo certo!</Text>
                                <Ionicons name={"play"} size={24} color={theme.mainCol} style={{marginLeft: 20, alignSelf: 'center'}} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
    if (mode == "waiting") {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.backgroundColor}}>
                <View style={{margin: 20}}>
                    <ActivityIndicator size="large" color={theme.mainCol} />
                    <Text style={{fontFamily: 'MADETOMMY', textAlign: 'center', fontSize: 16, color: theme.tColor}}>Estamos corrigindo sua redação, aguarde um pouco...</Text>
                </View>
            </SafeAreaView>
        )
    }
    if (mode == "result") {
        if (response.nota == null) return;

        let nota, c1, c2, c3, c4, c5;
        if (response.nota) nota = response.nota;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: "#777"}}>
                <ScrollView>
                    <View style={{flex: 1, borderRadius: 15, marginVertical: 30, marginHorizontal: 10, shadowColor: "#fff", shadowOffset: {width: 40, height: 20}, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10}}>
                    <Image style={{ flex: 1, position: 'absolute', width: '100%', height: '100%', borderRadius: 15 }} source={require("../images/purple-bg.jpg")} />
                    <View style={{marginVertical: 20, marginHorizontal: 15}}>
                        <Text style={{color: "#fff", fontFamily: "MADETOMMY-BOLD", letterSpacing: 2 }}>CORRETOR DE REDAÇÕES</Text>
                        <Text style={{fontFamily: 'MADETOMMY', fontSize: 40, textAlign: 'center', color: "#fff", marginTop: 10}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>{parseInt(response.nota) > 0 ? nota : "0"}</Text></Text>
                        <Text style={{fontFamily: 'MADETOMMY', color: "#fff"}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>Competência 1</Text>: {`\n${response.c1 !== null && response.c1}`}</Text>
                        <Text style={{fontFamily: 'MADETOMMY', color: "#fff"}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>Competência 2</Text>: {`\n${response.c2 !== null && response.c2}`}</Text>
                        <Text style={{fontFamily: 'MADETOMMY', color: "#fff"}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>Competência 3</Text>: {`\n${response.c3 !== null && response.c3}`}</Text>
                        <Text style={{fontFamily: 'MADETOMMY', color: "#fff"}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>Competência 4</Text>: {`\n${response.c4 !== null && response.c4}`}</Text>
                        <Text style={{fontFamily: 'MADETOMMY', color: "#fff"}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>Competência 5</Text>: {`\n${response.c5 !== null && response.c5}`}</Text>
                        {response.obs && response.obs.length >= 1 && <Text style={{fontFamily: 'MADETOMMY', color: "#fff"}}><Text style={{fontFamily: 'MADETOMMY-BOLD'}}>Observação</Text>: {`\n${response.obs}`}</Text>}

                        <TouchableOpacity onPress={() => {setMode("writing"); setTextInputHeight(0); setText(""); } } style={{
                                backgroundColor: theme.backgroundColor,
                                padding: 10,
                                width: '100%',
                                borderRadius: 40,
                                marginTop: 15,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row'
                        }}>
                                <Text style={{fontFamily: 'MADETOMMY', fontSize: 15, color: theme.light, marginLeft: 5}}>Desejo analisar outra redação</Text>
                                <Ionicons name={"play"} size={24} color={theme.mainCol} style={{marginLeft: 20, alignSelf: 'center'}} />
                        </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
};