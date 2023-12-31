import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import Carousel from 'react-native-snap-carousel';
import { questionsAreaData, questionsMateriaData, lightSliderData, darkSliderData} from '../components/data';
import BannerSlide from '../components/BannerSlide';
import { windowWidth } from '../utils/Dimensions';
import CustomSwitch from '../components/CustomSwitch';
import ListItem from '../components/ListItem';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import themeContext from '../theme/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingScreen } from '../components/Loading';
import { QuestionContext } from '../context/QuestionContext';
import axios from 'axios';
import { ErrContext } from '../context/ErrContext';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import * as Linking from 'expo-linking';

export function Home({navigation}) {
    const [puxou, setPuxou] = useState(false);
    const [uData, setUdata] = useState({username: null});
    const [avatar, setUserAvatar] = useState({});
    const [search, setSearch] = useState("");
    const [questoes, setQuestoes] = useState([]);
    const [carouselData, setCarouselData] = useState([]);
    const [delay, setDelay] = useState(false);

    const [submit, setSubmit] = useState(false);

    const theme = useContext(themeContext);
    const { wasRender, setQuestionData, setRender } = useContext(QuestionContext);
    const { logout } = useContext(AuthContext);
    
    const {setAlert, setErrMessage} = useContext(ErrContext);
    const [conteudoTab, setConteudo] = useState(1);

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

    const getCarrouselData = async () => {
        setDelay(true);

        axios.get(`${BASE_URL}/api/news`, {
            timeout: 10000
        }).then(response => {
            setDelay(false);
            console.log(response.data);

            let transformedData = response.data.map((row: { title: any; imgD: any; imgL: any; link: any; }) => (
            {
                title: row.title,
                image: {uri: theme.theme == "dark" ? row.imgD : row.imgL},
                link: row.link
            }));

            console.log(transformedData);

            setCarouselData(transformedData);
        }).catch(err => {
            console.log(err);
            if (err.response) {
                switch (err.response.status) {
                    case 500:
                        setAlert(true);
                        setErrMessage("Não foi possível encontrar as notícias.");
                        break;
                }
            } else if (err.request) {
                setErrMessage("Não foi possível conectar ao banco de dados.");
                setAlert(true);
            }
        });
    }

    const searchQuestion = () => {
        if (!delay) {
            setDelay(true);

            axios.post(`${BASE_URL}/api/questions/find`, {
                search: search
            }, {
                timeout: 10000
            }).then(response => {
                setQuestoes(response.data);
                setDelay(false);
            }).catch(err => {
                console.log(err);
                setDelay(false);

                if (err.response) {
                    switch (err.response.status) {
                        case 500:
                            setAlert(true);
                            setErrMessage("Não foi possível completar.");
                            break;
                        case 404:
                            setAlert(true);
                            setErrMessage("Não encontramos nenhuma questão com este conteúdo.")
                            break;
                        case 401:
                            setAlert(true);
                            setErrMessage("Sua sessão expirou.");
                            logout();
                            break;
                        case 400:
                            setAlert(true);
                            setErrMessage("Sua busca é inválida.");
                            break;
                    }
                } else if (err.request) {
                    setErrMessage("Não foi possível conectar ao banco de dados.");
                    setAlert(true);
                }
            });
        }
    };

    const goQuestionPressed = (id) => {
        if (questoes) {
            const quest = questoes.find(questao => questao.id === id);
            setQuestionData(quest);

            if (!wasRender) {
                navigation.navigate("Question", { id: quest.id, mode: 'Materia', filter: quest.materia});   
                setRender(true);
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Question', params: { id: quest.id, mode: 'Materia', filter: quest.materia}}]
                });
            };
        }
    };

    const puxarData = async () => {
        const data = await AsyncStorage.getItem("userData");
        const getAvatar = await AsyncStorage.getItem("userAvatar");
        const dataJ = JSON.parse(data);

        if (getAvatar && getAvatar !== "default") {
            setUserAvatar({uri: getAvatar});
        } else {
            setUserAvatar(require("../images/man-profile.png"));
        }
        setUdata(dataJ);
        return setPuxou(true);
    }

    if (!puxou || uData == null) {
        puxarData();

        return (
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}>
                <LoadingScreen />
            </View>
          )
    }
    

    const renderBanner = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => {
                Linking.openURL(item.link);
            }}>
                <BannerSlide data={item} />
            </TouchableOpacity>
        )
    }
    
    const onSelect = (value) => {
        setConteudo(value);
    }

    const styles = StyleSheet.create({
        centerCont: {
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        searchBox: {
            flexDirection: 'row',
            borderColor: theme.borderColor,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
        },
        textSt1: {
            fontSize: 18,
            fontFamily: 'MADETOMMY',
            color: theme.tColor
        },
        noticiasContainer: {
            marginVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        searchBoxItem: {
            borderRadius: 5,
            borderWidth: 1,
            padding: 5,
            margin: 5,
            borderColor: theme.light
        },
        searchBoxTitle: {
            fontFamily: 'MADETOMMY',
            color: theme.mainCol,
            fontSize: 17
        },
        searchBoxText: {
            fontFamily: 'MADETOMMY',
            fontSize: 15,
            color: theme.tColor
        }
    })
    
    if (carouselData.length <= 0 && !delay) getCarrouselData();

    if (!submit && uData) {
        return (
        <SafeAreaView onLayout={onLayoutRootView} style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <ScrollView style={{padding: 20}}>
            <View style={styles.centerCont}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() } }>
                    <Image source={avatar} style={{width: 40, height: 40, borderRadius: 40}} />
                </TouchableOpacity>

                <Text style={styles.textSt1}>Olá, {uData.username}!</Text>
                <StatusBar style="auto" hidden={true} />
            </View>

            <View style={styles.searchBox}>
                <Ionicons name={"search-outline"} size={24} color={theme.tColor} style={{marginRight: 5}} />
                <TextInput style={{color: theme.tColor}} onChangeText={(m) => setSearch(m)} onSubmitEditing={() => {searchQuestion();setSubmit(true)}} placeholderTextColor={theme.tColor} placeholder="Pesquise questões" />
            </View>

            <View style={styles.noticiasContainer}>
                <Text style={styles.textSt1}>Notícias úteis</Text>
                <TouchableOpacity onPress={() => setDelay(false)}>
                    <Ionicons name="refresh-outline" color={theme.mainCol} size={24} />
                </TouchableOpacity>
            </View>

            {carouselData.length <= 0 ? 
            <ActivityIndicator
            /> : 
            <Carousel 
            ref={(c) => { this._carousel = c; }}
            data={carouselData}
            renderItem={renderBanner}
            sliderWidth={windowWidth - 40}
            itemWidth={300}
            loop={true}
            />}

            <View>
                <CustomSwitch selectionMode={1} op1="Área" op2="Matéria" onSelect={onSelect} />
            </View>

            {conteudoTab == 1 && questionsAreaData.map(item => (
                <ListItem key={item.id} icon={item.poster} n={navigation} title={item.title} mode="area" filter={item.filter} />
            ))}
            {conteudoTab == 2 && questionsMateriaData.map(item => (
                <ListItem key={item.id+10} icon={item.poster} n={navigation} title={item.title} mode="materia" filter={item.title} />
            ))}

            <View style={{marginBottom: 40}}>
            <BannerAd
                unitId="ca-app-pub-XXXX"
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
            </View>
        </ScrollView>
      </SafeAreaView>
        )   
    } else {
        return (
            <SafeAreaView onLayout={onLayoutRootView} style={{flex: 1, backgroundColor: theme.backgroundColor, padding: 20}}>
                <View style={styles.centerCont}>
                    <TouchableOpacity onPress={() => setSubmit(false)}>
                        <Ionicons name={"arrow-back-circle-outline"} size={24} color={theme.mainCol} style={{marginRight: 5}} />
                    </TouchableOpacity>
                    <Text style={styles.textSt1}>Olá, {uData.username}!</Text>
                    <Image source={avatar} style={{width: 40, height: 40, borderRadius: 40}} />
                    <StatusBar style="auto" hidden={true} />
                </View>

                <View style={styles.searchBox}>
                    <Ionicons name={"search-outline"} size={24} color={theme.tColor} style={{marginRight: 5}} />
                    <TextInput style={{color: theme.tColor}} onChangeText={(m) => setSearch(m)} onSubmitEditing={() => {searchQuestion(); if (search.length <= 0) setSubmit(false)}} placeholderTextColor={theme.tColor} placeholder="Pesquise questões" />
                </View>

                <View style={{
                    flex: 1,
                    marginVertical: 20,
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >
                    <Ionicons name={"information-circle-outline"} size={24} color={theme.mainCol} style={{marginLeft: 20, alignSelf: 'center'}} />
                    <Text style={{
                        fontFamily: 'MADETOMMY',
                        fontSize: 15,
                        textAlign: 'justify',
                        marginHorizontal: 20,
                        color: theme.light
                    }}>
                        Sempre faça buscas por conteúdos específicos. Se você está procurando por matérias específicas, utilize a aba "matérias" na página inicial.
                    </Text>
                    </View>

                    <FlatList
                        contentContainerStyle={{paddingBottom: 150}}
                        data={questoes}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                goQuestionPressed(item.id);
                            }} style={styles.searchBoxItem}>
                              <Text style={styles.searchBoxTitle}>{item.materia} | {item.origem}</Text>
                              <Text style={styles.searchBoxText}>{item.texto.length > 100 ? item.texto.replace(/(\r\n|\n|\r)/gm, " ").slice(0,100)+" [...]" : item.texto.replace(/(\r\n|\n|\r)/gm, " ")}</Text>
                            </TouchableOpacity>
                          )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={{marginBottom: 10}}>
                    <BannerAd
                        unitId="ca-app-pub-XXXXXX"
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    />
                </View>
            </SafeAreaView>
        )
    }
}
