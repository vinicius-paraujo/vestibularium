import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import themeContext from "../theme/themeContext"
import CustomSwitch2 from './CustomSwitch2';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';

export default function CustomDrawer({navigation}) {
    const theme = useContext(themeContext);
    const {logout} = useContext(AuthContext);
    const [screen, setScreen] = useState("Home");
    const [puxou, setPuxou] = useState(false);
    const [userData, setUserdata] = useState({username: ""});
    const [userAvatar, setUserAvatar] = useState();
    const [rating, setURating] = useState("");
    const [lastScreen, setLast] = useState("");

    const [fontsLoaded] = useFonts({
        'MADETOMMY': require('../fonts/MADETOMMY.ttf'),
    });

    const backActionHandler = () => {
        if (lastScreen.length <= 0) {
            setScreen("Home");
            navigation.navigate("Home");
        } else {
            setScreen(lastScreen);
            navigation.navigate(lastScreen);
        }
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backActionHandler);
        return () => BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
      if (!fontsLoaded) {
        return null;
    }

    const puxarData = async () => {
        const data = await AsyncStorage.getItem("userData");
        const rating = await AsyncStorage.getItem("userRating");
        const avatar = await AsyncStorage.getItem("userAvatar");

        if (avatar && avatar !== "default") {
            setUserAvatar({uri: avatar});
        } else {
            setUserAvatar(require("../images/man-profile.png"))
        }
        const dataJ = JSON.parse(data);

        setUserdata(dataJ);
        setURating(rating);
        await setPuxou(true);
    }

    if (!puxou || userData == null) {
        puxarData();
    }

    const onSelect = (value) => {
        if (value === 2) {
          EventRegister.emit("ChangeTheme", true);
        }
        else {
          EventRegister.emit("ChangeTheme", false);
        }
    }
    if (puxou && userData !== null) {
    return(
        <View onLayout={onLayoutRootView} style={{flex: 1, backgroundColor: theme.backgroundColor}}>
            <DrawerContentScrollView>
                <Image source={userAvatar} style={{height: 80, width: 80, borderRadius: 40, margin: 10}} />
                <Text style={{color: theme.tColor, fontFamily: "MADETOMMY", fontSize: 18, marginHorizontal: 10}}>{userData.username}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                    <Ionicons name="star-outline" color={theme.mainCol} />
                    <Text style={{color: theme.tColor, fontFamily: "MADETOMMY", marginHorizontal: 10}}>{rating}</Text>

                    <TouchableOpacity style={{
                        borderWidth: 1,
                        borderColor: theme.light,
                        borderRadius: 5,
                        alignItems: 'center'
                    }} onPress={async () => {
                        puxarData();
                    }}>
                        <Ionicons name="refresh-outline" size={14} color={theme.mainCol} />
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1, backgroundColor: theme.backgroundColor, paddingTop: 10}}>
                    <DrawerItem 
                    focused={screen == "Home" ? true : false}
                    activeTintColor={theme.mainCol}
                    icon={() => <Ionicons name="home-outline" color={theme.mainCol}/>}
                    label={"Início"} 
                    labelStyle={{fontFamily: 'MADETOMMY', fontSize: 15, color: theme.tColor}}
                    onPress={() => {
                        if (screen !== "Home") {
                            navigation.navigate("Home");
                            setScreen("Home");
                        }
                    }} 
                    />

                    <DrawerItem 
                    activeTintColor={theme.mainCol}
                    focused={screen == "Redacao" ? true : false}
                    icon={() => <Ionicons name="reader-outline" color={theme.mainCol}/>}
                    label={"Corretor de redação"} 
                    labelStyle={{fontFamily: 'MADETOMMY', fontSize: 15, color: theme.tColor}}
                    onPress={() => {
                        if (screen !== "Redacao") {
                            navigation.navigate("Redacao");
                            setScreen("Redacao");
                        }
                    }} 
                    />

                    <DrawerItem 
                    focused={screen == "Config" ? true : false}
                    activeTintColor={theme.mainCol}
                    icon={() => <Ionicons name="settings-outline" color={theme.mainCol}/>}
                    label={"Configurações"} 
                    labelStyle={{fontFamily: 'MADETOMMY', fontSize: 15, color: theme.tColor}}
                    onPress={() => {
                        if (screen !== "Config") {
                            navigation.navigate("Config");
                            setScreen("Config");
                        }
                    }} 
                    />

                    <DrawerItem 
                    activeTintColor={theme.mainCol}
                    focused={screen == "Stats" ? true : false}
                    icon={() => <Ionicons name="stats-chart-outline" color={theme.mainCol}/>}
                    label={"Estatísticas"} 
                    labelStyle={{fontFamily: 'MADETOMMY', fontSize: 15, color: theme.tColor}}
                    onPress={() => {
                        if (screen !== "Stats") {
                            navigation.navigate("Stats");
                            setScreen("Stats");
                        }
                    }} 
                    />
                
                    <View style={{marginHorizontal: 20, width: "100%", height: 50, flex: 1}}>
                        <CustomSwitch2 larg={2} selectionMode={1} op1="sunny" op2="moon-sharp" onSelect={onSelect}/>
                    </View>
                </View>
            </DrawerContentScrollView>

            <View style={{padding: 40, borderTopWidth: 1, borderTopColor: "#CCC", alignItems: "flex-start", marginLeft: -25}}>
                <TouchableOpacity onPress={() => {logout()}}>
                    <View style={{flexDirection: "row", alignItems: 'center'}}>
                        <Ionicons name="log-out-outline" color={theme.mainCol} />
                        <Text style={{color: theme.tColor, fontSize: 15, fontFamily: "MADETOMMY", marginLeft: 5}}>Desconectar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
    }
};