import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import themeContext from '../theme/themeContext';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import axios from 'axios';

import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthContext } from '../context/AuthContext';
import { ErrContext } from '../context/ErrContext';
import { BASE_URL } from '../config';

export default function Settings() {
    const theme = useContext(themeContext);
    const {logout} = useContext(AuthContext);
    const {setAlert, setErrMessage} = useContext(ErrContext);

    const [token, setToken] = useState();
    const [userData, setUserData] = useState();

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();

    const [alertShow, setAlertShow] = useState();
    const [message, setMessage] = useState();

    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        getPermissionAsync();
        getToken();
    }, []);

    const getToken = async () => {
        const tk = await AsyncStorage.getItem("userToken");
        const userDt = await AsyncStorage.getItem("userData");
        setUserData(JSON.parse(userDt));

        setToken(tk);
    };

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status !== 'granted') {
            Alert.alert('É necessário conceder permissão para acessar a galeria de imagens');
        }
        }
    };

    const submitSettings = async () => {
        const token = await AsyncStorage.getItem("userToken");

        if (!username && !email && !oldPassword && !newPassword) {
            setAlert(true);
            return setErrMessage("Preencha um dos campos para prosseguir.");
        }

        const usernameRegex = /^[a-zA-Z0-9._]{3,255}$/;
        if (username && !usernameRegex.test(username)) {
            setAlert(true);
            setErrMessage("Usuário inválido.");
            return;
        }

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email && !validRegex.test(email)) {
            setAlert(true);
            setErrMessage("Seu email é inválido.");
            return;
        }

        if (oldPassword && !newPassword) {
            setAlert(true);
            setErrMessage("Preencha a nova senha.");
            return;
        }

        if (!oldPassword && newPassword) {
            setAlert(true);
            setErrMessage("Insira a senha antiga.");
            return;
        }

        if (newPassword && newPassword.length <= 3) {
            setAlert(true);
            setErrMessage("Sua senha é muito curta.")
        }

        if (oldPassword && newPassword && oldPassword == newPassword) {
            setAlert(true);
            setErrMessage("A senha nova deve ser diferente da antiga.");
        }

        axios.post(`${BASE_URL}/user/settings/change`, {
            username,
            email,
            oldPassword,
            newPassword
        }, {
            headers: {
                "x-access-token": token
            },
            timeout: 10000
        }).then(res => {
            console.log(res.data);
            setAlert(true);
            return setErrMessage("Suas mudanças foram salvas.");
        }).catch(err => {
            console.log(err);
            if (err.response) {
                if (err.response.status == 401) logout();
                setAlert(true);
                return setErrMessage(err.response.data.message);
            } else if (err.request) {
                setErrMessage("Não foi possível conectar ao banco de dados.");
                setAlert(true);
            }
        })
    }

    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            console.log(result.assets[0].uri.toString('base64'));
            setImageUri(result.assets[0].uri);
            shortenUrl(result.assets[0].uri);
        }
    };

    const shortenUrl = async (uri) => {
        const longUrl = await convertImageToBase64(uri);

        await axios.post(`${BASE_URL}/user/avatar/send`, {
            image: longUrl
        }, {
            headers: {
                "x-access-token": token
            },
            timeout: 10000
        }).then(async response => {
            await AsyncStorage.setItem("userAvatar", response.data.image);

            setAlertShow(true);
            setMessage("Você mudou o avatar com sucesso.");
        }).catch(err => {
            console.log(err);
            if (err.response) {
                switch (err.response.status) {
                    case 404:
                        setAlert(true);
                        setErrMessage("Não foi possível enviar essa imagem.")
                        break;
                    case 401:
                        setAlert(true);
                        setErrMessage("Sua sessão expirou.");
                        logout();
                        break;
                    case 400:
                        setAlert(true);
                        setErrMessage("Ocorreu uum problema com a imagem.");
                        break;
                }
            } else if (err.request) {
                setErrMessage("Não foi possível conectar ao banco de dados.");
                setAlert(true);
            }
        })
    };

    const convertImageToBase64 = async (uri) => {
        const base64 = await fetch(uri)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Erro ao ler imagem como base64'));
            reader.readAsDataURL(blob);
            });
        });
        return base64;
    };

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.backgroundColor,
        },
        title: {
            color: theme.tColor,
            fontFamily: 'MADETOMMY',
            textAlign: 'left',
            fontSize: 20
        },
        subtitle: {
            color: theme.mainCol,
            fontSize: 17,
            fontFamily: 'MADETOMMY'
        },
        text: {
            color: theme.tColor,
            fontSize: 15,
            fontFamily: 'MADETOMMY'
        },
        textInputStyle: {
            flexDirection: "row",
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
            marginTop: 10,
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
    });

    if (userData) {
        return(
            <SafeAreaView style={styles.mainContainer}>

            <AwesomeAlert
                cancelButtonStyle={{backgroundColor: theme.mainCol}}
                cancelButtonTextStyle={{color: theme.backgroundColor, fontFamily: "MADETOMMY", fontSize: 14, paddingHorizontal: 15, paddingVertical: 5}}
                showCancelButton={true}
                onCancelPressed={() => {setAlertShow(false)}}
                cancelText='Ok.'
                show={alertShow}
                onDismiss  ={() => {setAlertShow(false);}}
                contentContainerStyle={{borderRadius: 15, backgroundColor: theme.backgroundColor}}
                titleStyle={{color: theme.light, fontFamily: "MADETOMMY", alignSelf: "center", justifyContent: "center", textAlign: "center", fontSize: 16}}
                title={message} 
            />
            <ScrollView>
                <View style={{
                    flex: 1,
                    marginLeft: 10,
                    marginTop: 10,
                    justifyContent: 'flex-start'
                }}>
                    <Text style={styles.title}>
                        Configurações da conta
                    </Text>
                    <Text style={styles.subtitle}>
                        {userData.username}
                    </Text>

                    <View style={{
                        marginTop: 20
                    }}>

                        <Text style={styles.text}>Foto do perfil</Text>

                        <TouchableOpacity onPress={() => {
                            handleChoosePhoto();
                        }} style={styles.textInputStyle}>
                            <Text style={{
                                color: theme.light,
                                fontSize: 15,
                                fontFamily: 'MADETOMMY',
                                width: '90%'
                            }}>
                                Clique para alterar.
                            </Text>
                            <Ionicons name="cloud-upload-outline" size={20} color={theme.mainCol} style={{marginRight: 5, alignSelf: 'center'}} />
                        </TouchableOpacity>

                        <Text style={styles.text}>Usuário</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput placeholderTextColor={theme.light} value={username} onChangeText={m => setUsername(m)} placeholder={userData.username} style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} keyboardType="default" />
                            <Ionicons name="pencil-outline" size={20} color={theme.mainCol} style={{marginRight: 5, alignSelf: "center"}} />
                        </View>

                        { userData.type == 'default' ?
                        <View>
                            <Text style={styles.text}>Email</Text>
                            <View style={styles.textInputStyle}>
                                <TextInput placeholderTextColor={theme.light} value={email} onChangeText={m => setEmail(m)} placeholder={userData.email} style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} keyboardType="email-address" />
                                <Ionicons name="pencil-outline" size={20} color={theme.mainCol} style={{marginRight: 5, alignSelf: "center"}} />
                            </View>

                            <Text style={styles.text}>Senha</Text>
                            <View style={styles.textInputStyle}>
                                <TextInput placeholderTextColor={theme.light} value={oldPassword} onChangeText={m => setOldPassword(m)} placeholder="Senha atual" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} secureTextEntry={true} />
                                <Ionicons name="pencil-outline" size={20} color={theme.mainCol} style={{marginRight: 5, alignSelf: "center"}} />
                            </View>
                            <View style={styles.textInputStyle}>
                                <TextInput placeholderTextColor={theme.light} value={newPassword} onChangeText={m => setNewPassword(m)} placeholder="Nova senha" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} secureTextEntry={true} />
                                <Ionicons name="pencil-outline" size={20} color={theme.mainCol} style={{marginRight: 5, alignSelf: "center"}} />
                            </View>
                        </View>
                        :
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginHorizontal: 20,
                            marginVertical: 20,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start'
                        }}>
                            { userData.type == 'google' &&
                            <Image source={require("../svg/google-logo.png")} style={{width: 30, height: 30, alignSelf: 'center'}} />
                            }
                            <Text style={{
                                fontFamily: 'MADETOMMY',
                                fontSize: 15,
                                textAlign: 'justify',
                                marginHorizontal: 20,
                                color: theme.light
                            }}>
                                Sua conta está vinculada ao email: <Text style={{
                                color: theme.mainCol,
                                fontSize: 15,
                                fontFamily: 'MADETOMMY'
                            }}>
                                {userData.email}
                            </Text>
                            </Text>
                            
                        </View>
                        }

                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}>
                            <TouchableOpacity onPress={() => submitSettings()} style={styles.buttonOne}>
                                <Text style={styles.textButtonOne}>
                                    Salvar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            </SafeAreaView>
        )
    }
};