import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import themeContext from '../theme/themeContext';
import ProgressBar from '../components/ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Stats() {
    const theme = useContext(themeContext);
    
    const [userData, setUserData] = useState({username: null});
    const [userAvatar, setUserAvatar] = useState({});
    const [userRating, setUserRating] = useState("");
    const [userStats, setStats] = useState({solvedQuestions: null, qCertas: null});
    const [timer, setTimer] = useState("");
    const [getData, setGetData] = useState(false);

    const puxarData = async () => {
        const userDt = await AsyncStorage.getItem("userData")
        const userAv = await AsyncStorage.getItem("userAvatar");
        const userRt = await AsyncStorage.getItem("userRating");
        const userStatsA = await AsyncStorage.getItem("userStats");
        const userStatsJ = JSON.parse(userStatsA);
        const uTimer = userStatsJ.time;

        console.log(userAvatar);

        if (!userStatsJ || userStatsJ.solvedQuestions == -1) setStats({solvedQuestions: " ", qCertas: 0});
        else setStats(userStatsJ);

        if (uTimer) {
            if (uTimer.includes(",")) {
                const tempos = uTimer.split(","); // divide a string em um array de tempos separados por vírgula
                let totalSegundos = 0;

                for (let i = 0; i < tempos.length; i++) {
                    const partes = tempos[i].split(":"); // divide cada tempo em horas, minutos e segundos
                    const segundos = (+partes[0]) * 60 * 60 + (+partes[1]) * 60 + (+partes[2]); // converte para segundos
                    totalSegundos += segundos; // adiciona ao total de segundos
                }

                let minutes;
                const mediaSegundos = totalSegundos / tempos.length; // calcula a média em segundos
                const hours = Math.floor(mediaSegundos / 3600);
                minutes = Math.floor((mediaSegundos % 3600) / 60);
                const remainingSeconds = Math.floor(mediaSegundos % 60);

                // formatar a string de tempo
                if (minutes == 0) minutes = "00";
                if (hours < 1) setTimer(`${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`);
                else setTimer(`${hours}:${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`);
            } else {
                setTimer(uTimer)
            }
        } else {
            setTimer("0:00");
        }

        if (userAv && userAv !== "default") {
            setUserAvatar({uri: userAv});
        } else {
            setUserAvatar(require("../images/man-profile.png"))
        }

        setUserRating(userRt);
        setUserData(JSON.parse(userDt));
        setGetData(true);
    };

    useEffect(() => {
        puxarData();
    }, [])
    
    if (!getData) puxarData();

    const styles = StyleSheet.create({
        bigTitle: {
            fontSize: 30,
            fontFamily: 'MADETOMMY',
            color: theme.tColor,
            textAlign: 'center',
        },
        title: {
            fontFamily: 'MADETOMMY',
            fontSize: 20,
            color: "#fff",
            textAlign: 'left',
            margin: 10
        },
        titleMainCol: {
            fontFamily: 'MADETOMMY',
            fontSize: 19,
            color: theme.tColor,
            marginHorizontal: 10
        },
        card: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
            marginHorizontal: 20
        },
        title1: {
            fontFamily: 'MADETOMMY',
            fontSize: 30,
            textAlign: 'center',
            color: theme.mainCol,
        },
        sub1: {
            fontFamily: 'MADETOMMY',
            fontSize: 15,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: 10,
            color: theme.light,
        },
        list: {
            flexDirection: 'row'
        }
    });

    if (getData) {
        let solvedQTotal = 0;
        let i;

        if (userStats.solvedQuestions == null) solvedQTotal = 0;
        if (userStats.solvedQuestions == " ") solvedQTotal = 0;
        if (userStats.solvedQuestions && userStats.solvedQuestions !== " " && !userStats.solvedQuestions.includes(",")) solvedQTotal = 1;
        if (userStats.solvedQuestions && userStats.solvedQuestions !== "" && userStats.solvedQuestions.includes(",")) i = userStats.solvedQuestions.split(",");
        if (i && i.length > 1) solvedQTotal = i.length;

        return (
            <SafeAreaView style={{flex: 1}}>
                <Image source={require("../images/purple-bg.jpg")} style={{position: 'absolute', width: '100%', height: '110%'}} />
                <View style={{}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                        <Text style={styles.title}>
                            Estatísticas
                        </Text>

                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderColor: theme.light,
                            borderRadius: 5,
                            alignItems: 'center'
                        }} onPress={async () => {
                            puxarData();
                        }}>
                            <Ionicons name="refresh-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Image source={userAvatar} style={{height: 130, width: 130, alignSelf: 'center', borderRadius: 70}} />
                    <Text style={{fontFamily: 'MADETOMMY', fontSize: 20, textAlign: 'center', color: "#fff"}}>{userData.username}</Text>

                    <View style={{margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="star-outline" color="#fff" style={{marginRight: 5}} />
                        <Text style={{
                            fontFamily: 'MADETOMMY',
                            fontSize: 15,
                            color: "#fff"
                        }}>{userRating}</Text>
                    </View>
                </View>

                <View style={{flex: 1, margin: 10, borderRadius: 10, backgroundColor: theme.backgroundColor}}>
                    <Text style={styles.sub1}>Questões resolvidas:</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: -5}}>
                        <Ionicons name="md-checkmark-circle-outline" size={20} color={theme.mainCol} style={{alignSelf: 'center'}} />
                        <Text style={styles.bigTitle}>{solvedQTotal}</Text>
                    </View>

                    <View style={{margin: 10}}>
                        <ProgressBar valueA={userStats.qCertas} valueB={solvedQTotal === 0 ? 0 : solvedQTotal-userStats.qCertas} />
                    </View>

                    <Text style={styles.sub1}>Tempo médio de solução:</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: -5}}>
                        <Ionicons name="hourglass" size={20} color={theme.mainCol} style={{alignSelf: 'center'}} />
                        <Text style={styles.bigTitle}>{String(timer)}</Text>
                    </View>

                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name="information-circle" size={20} color={theme.mainCol} style={{alignSelf: 'flex-end', marginRight: 5}} />
                        <Text style={styles.sub1}>Em breve mais estatísticas!</Text>
                    </TouchableOpacity>    
                </View>
            </SafeAreaView>
        )
    } else {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color={theme.light} size="large" animating />
            </View>
        )
    }
}