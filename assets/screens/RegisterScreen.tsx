//react and dependencies
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

import GoogleRecaptcha from 'react-native-google-recaptcha'

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

// from project
import themeContext from "../theme/themeContext"
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from '../context/AuthContext';
import { ErrContext } from '../context/ErrContext';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function RegisterScreen({navigation}) {
    const { setAlert, setErrMessage } = useContext(ErrContext);

    const [email, setEmail] = useState(null)
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState(null);
    const [rPassword, setRPassword] = useState(null);
    const [token, setToken] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [warn, setWarn] = useState(false);

    const {register, googleRegister} = useContext(AuthContext);
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '379686738115-3resrljk4k7e8dgv75h67o2r1cam2vad.apps.googleusercontent.com',
        androidClientId: '379686738115-otsir0ifitvc9j8vhcidf39mvuqs41g6.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === "success" && !authenticated) {
            setLoading(true);
            setAuthenticated(true);
            setToken(response.authentication.accessToken);
            getUserInfo();
        } else {
            setAuthenticated(false);
        }
    }, [response, token]);

    const getUserInfo = async () => {
        try {
            if (response?.type === "success") {
                const responseb = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                    headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
                });
    
                const userD = await responseb.json();
                googleRegister(userD, response.authentication.accessToken);
            }
        } catch (error) {
            setAuthenticated(false);
        }
    };
      
    const recaptchaRef = React.useRef(null);

    const handleSend = () => {
        recaptchaRef.current?.open();
    };
    
    const handleVerify = (token) => {
        register(user, email, password, 'default');
    }
    
    const handleError = (error) => {
        console.error('Recaptcha Error:', error)
    }
    
    const postRegisterData = async() => {
        if (email == null || email == "" || user == "" || user == null || password == "" || password == null || rPassword == null) {
            setErrMessage("Preencha todos os campos para prosseguir."); return setAlert(true);
        }

        // password problems
        if (password !== rPassword) {setErrMessage("As senhas não coincidem."); return setAlert(true);}
        if (password.length <= 3) {setErrMessage("Sua senha é muito pequena."); return setAlert(true)};

        const usernameRegex = /^[a-zA-Z0-9._]{3,255}$/;
        if (!usernameRegex.test(user)) {
            setErrMessage("Seu usuário é inválido.");
            return setAlert(true);
        }

        // email problems
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email.match(validRegex)) {
            {setErrMessage("Você inseriu um email inválido."); return setAlert(true);}
        }

        handleSend();
        //register(user, email, password)
    }

    const theme = useContext(themeContext);

    const [fontsLoaded] = useFonts({
        'MADETOMMY': require('../fonts/MADETOMMY.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    
    if (!fontsLoaded) {
        return null;
    }

    const styles = StyleSheet.create({
        mainContent: {
            flex: 1, 
            backgroundColor: theme.backgroundColor,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
        }, 
        title: {
            color: theme.tColor,
            textAlign: 'center',
            alignItems: 'center',
            fontFamily: "MADETOMMY",
            fontWeight: "500",
            fontSize: 25,
            alignSelf: "flex-start",
            marginLeft: 25,
            marginBottom: 10,
        },
        text: {
            fontFamily: "MADETOMMY",
            marginBottom: 20,
            fontSize: 12,
            color: theme.light
        },
        // 1412 x 1674
        imageSvg: {
            width: 1412/8,
            height: 1674/8
        },
        viewImg: {
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5
        },
        textInputStyle: {
            flexDirection: "row",
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
            marginHorizontal: 25
        },
        buttonOne: {
            backgroundColor: theme.mainCol,
            padding: 20,
            paddingHorizontal: 120,
            borderRadius: 10,
            marginBottom: 10,
        },
        textButtonOne: {
            fontFamily: "MADETOMMY",
            textAlign: 'center',
            fontSize: 16,
            color: theme.backgroundColor,
        }
    })

    return(
        <ScrollView>
        <SafeAreaView onLayout={onLayoutRootView} style={styles.mainContent}>
            <AwesomeAlert
            show={warn}
            contentContainerStyle={{
                borderRadius: 30,
                backgroundColor: theme.backgroundColor,
                justifyContent: 'center'
            }}

            titleStyle={{
                fontFamily: 'MADETOMMY',
                color: theme.tColor
            }}

            messageStyle={{
                color: theme.light,
                fontFamily: 'MADETOMMY',
                textAlign: 'center'
            }}

            confirmButtonStyle={{
                backgroundColor: theme.mainCol,
                borderRadius: 25
            }}

            showConfirmButton={true}
            confirmText="Ok, prosseguir."
            onConfirmPressed={() => {promptAsync()}}
            onDismiss={() => setWarn(false)}
            title="Atenção"
            message="Alguns usuários estão enfrentando dificuldades com contas do google com autenticação de dois fatores. Caso você esteja enfrentando esse problema, recomendamos que faça o registro utilizando o outro método."

            confirmButtonTextStyle={{
                fontFamily: 'MADETOMMY'
            }}
            />

            <View style={styles.viewImg}>
                <Image source={require('../svg/student03.png')} style={styles.imageSvg} />
            </View>

            <Text style={styles.title}>Registro</Text>

            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: 'center',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc"
            }}>

            {
                <TouchableOpacity
                onPress={() => {
                    setWarn(true);
                }}
                disabled={!request}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: "#ddd",
                    borderWidth: 2,
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 20,
                }}>
                <Image source={require("../svg/google-logo.png")} style={{width: 30, height: 30}} />
                <Text style={{fontFamily: 'MADETOMMY', fontSize: 14, color: theme.light, marginLeft: 15}}>Registrar com Google</Text>
                </TouchableOpacity>
            }
            </View>

            {/* EMAIL */}
            <View style={styles.textInputStyle}>
                <MaterialIcons name="alternate-email" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} onChangeText={e => {setEmail(e)}} placeholder="paulo.pereira@vestibularium.com.br" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} keyboardType="email-address" />
            </View>

            {/* USER */}
            <View style={styles.textInputStyle}>
                <Ionicons name="person-outline" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} onChangeText={e => {setUser(e)}} placeholder="Usuário" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} keyboardType="default" />
            </View>

            {/* PASSWORD */}
            <View style={styles.textInputStyle}>
                <Ionicons name="lock-closed-outline" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} onChangeText={e => {setPassword(e)}} placeholder="Senha" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} secureTextEntry={true} />
            </View>

            {/* REPEAT PASSWORD */}
            <View style={styles.textInputStyle}>
                <Ionicons name="lock-closed-outline" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} onChangeText={e => {setRPassword(e)}} placeholder="Repetir senha" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} secureTextEntry={true} />
            </View>
            
            <GoogleRecaptcha
                ref={recaptchaRef}
                baseUrl="http://localhost:4545"
                onError={handleError}
                onVerify={handleVerify}
                siteKey="6LcwCWIlAAAAAHEQ1LcGADwD61S9L902UnNWhUVP"
            />

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                <Text style={{
                    fontFamily: 'MADETOMMY',
                    fontSize: 12,
                    color: theme.light,
                    textAlign: 'center'
                }}>
                    Ao prosseguir, você concorda com nossos 
                    <TouchableOpacity onPress={() => navigation.navigate('Termos')}>
                        <Text style={{fontFamily: 'MADETOMMY',
                            fontSize: 12,
                            color: theme.mainCol, textAlign: 'center'}}>
                                termos de uso & política de privacidade
                        </Text>
                    </TouchableOpacity>
                </Text>
            </View>

            <TouchableOpacity onPress={() => {postRegisterData()}
                } style={styles.buttonOne}>
                <Text style={styles.textButtonOne}>
                    Registrar
                </Text>
            </TouchableOpacity>

            <View style={{
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 10,
            }}>
                <Text style={styles.text}>Já registrado? </Text>
                <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
                    <Text style={{
                        color: theme.mainCol,
                        fontFamily: "MADETOMMY",
                        fontSize: 12
                    }}>Logar</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color={theme.light} size="large" animating />
                </View>
            )}
        </SafeAreaView>
        </ScrollView>
    )
}