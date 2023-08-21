import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, TextInput, Touchable, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

import GoogleRecaptcha from 'react-native-google-recaptcha'

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

import themeContext from "../theme/themeContext"
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from '../context/AuthContext';
import { ErrContext } from '../context/ErrContext';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [token, setToken] = useState("");
    const recaptchaRef = React.useRef(null);

    const { errCode, setErrCode, alertShow, setAlert, errMessage, setErrMessage } = useContext(ErrContext);

    console.log(errCode)

    const theme = useContext(themeContext);
    const {login, googleLogin} = useContext(AuthContext);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '379686738115-3resrljk4k7e8dgv75h67o2r1cam2vad.apps.googleusercontent.com',
        androidClientId: '379686738115-otsir0ifitvc9j8vhcidf39mvuqs41g6.apps.googleusercontent.com',
    });
    

    useEffect(() => {
        if (response?.type === "success" && !authenticated) {
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
                const responseb = await fetch(
                "https://www.googleapis.com/userinfo/v2/me", {
                    headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
                });
                
                const userD = await responseb.json();

                if (userD) {
                    googleLogin(userD, response.authentication.accessToken);
                }
            }
        } catch (error) {
            setAuthenticated(false);
            console.log(error);
        }
    };

    const handleSend = () => {
        recaptchaRef.current?.open();
    };
    
    const handleVerify = async (token) => {
        await login(email, password);
    }
    
    const handleError = (error) => {
        console.error('Recaptcha Error:', error)
        return;
    }

    const postLoginData = async () => {
        console.log(email +" | "+password)
        if (email == null || email == "" || password == null || password == "") {
            setErrMessage("Preencha todos os campos para prosseguir."); 
            setErrCode("0"); 
            return setAlert(true);
        }
        handleSend();
    }

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
            textAlign: 'center',
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
            marginBottom: 5,
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
            marginBottom: 30,
        },
        textButtonOne: {
            fontFamily: "MADETOMMY",
            textAlign: 'center',
            fontSize: 16,
            color: theme.backgroundColor,
        }
    })

    return(
        <SafeAreaView onLayout={onLayoutRootView} style={styles.mainContent}>
            <GoogleRecaptcha
                ref={recaptchaRef}
                baseUrl="http://localhost:4545"
                onError={handleError}
                onVerify={handleVerify}
                siteKey="6LcwCWIlAAAAAHEQ1LcGADwD61S9L902UnNWhUVP"
            />

            <View style={styles.viewImg}>
                <Image source={require('../svg/student02.png')} style={styles.imageSvg} />
            </View>

            <Text style={styles.title}>Login</Text>

            {/* EMAIL */}
            <View style={styles.textInputStyle}>
                <MaterialIcons name="alternate-email" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} value={email} onChangeText={m => setEmail(m)} placeholder="paulo.pereira@vestibularium.com.br" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} keyboardType="email-address" />
            </View>

            {/* PASSWORD */}
            <View style={styles.textInputStyle}>
                <Ionicons name="lock-closed-outline" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} value={password} onChangeText={pass => setPassword(pass)} placeholder="Senha." style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} secureTextEntry={true} />

                <TouchableOpacity onPress={() => {
                    navigation.navigate("Recover");
                }}>
                    <Text style={{color: theme.mainCol}}>Recuperar</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {postLoginData()}
                } style={styles.buttonOne}>
                <Text style={styles.textButtonOne}>
                    Login
                </Text>
            </TouchableOpacity>

            <Text style={styles.text}>Outras maneiras de fazer login:</Text>

            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
            }}>

                <TouchableOpacity onPress={() => {
                    promptAsync();
                }} disabled={!request} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: "#ddd",
                    borderWidth: 2,
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                }}>
                <Image source={require("../svg/google-logo.png")} style={{width: 20, height: 20}} />
                <Text style={{fontFamily: 'MADETOMMY', fontSize: 14, color: theme.light, marginLeft: 15}}>Login com Google</Text>
                </TouchableOpacity>

            </View>

            <View style={{
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 10,
            }}>
                <Text style={styles.text}>Novo por aqui? </Text>
                <TouchableOpacity onPress={() => { navigation.navigate("Register") }}>
                    <Text style={{
                        color: theme.mainCol,
                        fontFamily: "MADETOMMY",
                        fontSize: 12
                    }}>Registrar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}