import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native'

// expo
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import CustomSwitch2 from '../components/CustomSwitch2';
import { EventRegister } from 'react-native-event-listeners';

import themeContext from "../theme/themeContext"

export function Welcome({navigation}) {
  // dark mode settings
  const theme = useContext(themeContext);

  const [darkMode, setDarkMode] = useState(false)

  const [fontsLoaded] = useFonts({
    'MADETOMMY': require('../fonts/MADETOMMY.ttf'),
  });

  
  const onSelect = (value) => {
      if (value === 2) {
        EventRegister.emit("ChangeTheme", true);
        setDarkMode(true)
      }
      else {
        EventRegister.emit("ChangeTheme", false);
        setDarkMode(false)
      }
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonStyle: {
      backgroundColor: theme.mainCol,
      padding: 25,
      width: '60%',
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20
    },
    textButton: {
      fontSize: 18,
      color: "#fff",
      fontFamily: 'MADETOMMY'
    },
    textUp: {
      fontSize: 35,
      fontWeight: '600',
      color: theme.mainCol,
      fontFamily: 'MADETOMMY',
      textAlign: 'center'
    },
    imageSvg: {
      transform: [{
        rotate: '-15deg'
      }],
      width: 341,
      height: 261
    },
    viewImg: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textN: {
      marginTop: 5, 
      marginHorizontal: 15, 
      textAlign: 'center', 
      fontFamily: 'MADETOMMY',
      color: theme.tColor
    }
  });

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <View style={{marginTop: 30}}>
        <Text style={styles.textUp}>VESTIBULARIUM</Text>
        <Text style={styles.textN}>Bem vindo! Nós vamos te ajudar a solucionar questões de vestibular.</Text>
        <StatusBar style="auto" hidden={true} />
      </View>

      <View style={styles.viewImg}>
        <Image source={require('../svg/02.png')} style={styles.imageSvg} />
      </View>

      <CustomSwitch2 selectionMode={1} op1="sunny" op2="moon-sharp" onSelect={onSelect} larg={null} />


      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.buttonStyle}>
        <Text style={styles.textButton}>Iniciar</Text>
        <Ionicons name="arrow-forward-outline" size={22} color={theme.textButtonColor} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
  