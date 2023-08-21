import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

import themeContext from '../theme/themeContext';
import { AuthContext } from '../context/AuthContext';
import { ErrContext } from '../context/ErrContext';

export default function Recover({navigation}) {
    const theme = useContext(themeContext);
    const { recover } = useContext(AuthContext);
    const { setAlert, setErrMessage } = useContext(ErrContext);

    const [email, setEmail] = useState("");

    const recoverPassword = () => {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!email.match(validRegex)) {
            setAlert(true);
            return setErrMessage("Email inválido.");
        }
        recover(email);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            backgroundColor: theme.backgroundColor,
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
            width: 1412/7,
            height: 1674/7
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
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={{margin: 5, flexDirection: 'row', alignItems: 'center'}} onPress={() => navigation.navigate("Login")}>
                <Ionicons name={"arrow-back-circle-outline"} size={35} color={theme.mainCol} />
            </TouchableOpacity>

            <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
            <View style={styles.viewImg}>
                <Image source={require('../svg/password.jpg')} style={styles.imageSvg} />
            </View>

            <Text style={styles.title}>Esqueceu sua senha?</Text>

            <Text style={{fontFamily: 'MADETOMMY', fontSize: 13, marginBottom: 10, color: theme.light, marginLeft: -15}}>Insira seu email abaixo para recuperar sua conta.</Text>

            <View style={styles.textInputStyle}>
                <MaterialIcons name="alternate-email" size={24} color={theme.tColor} style={{marginRight: 5, alignSelf: "center"}} />
                <TextInput placeholderTextColor={theme.light} value={email} onChangeText={m => setEmail(m)} placeholder="paulo.pereira@vestibularium.com.br" style={{flex: 1, paddingVertical: 0, color: theme.light, fontFamily: "MADETOMMY"}} keyboardType="email-address" />
            </View>

            <TouchableOpacity onPress={() => {recoverPassword()}} style={styles.buttonOne}>
                <Text style={styles.textButtonOne}>
                    Recuperar
                </Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
};