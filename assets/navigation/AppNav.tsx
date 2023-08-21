// react
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

// other dependencies
import { EventRegister } from 'react-native-event-listeners';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// from the project
import theme from "../theme/theme"
import themeContext from "../theme/themeContext"
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from '../context/AuthContext';
import { ErrContext } from '../context/ErrContext';

import * as Linking from 'expo-linking';

import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

mobileAds().setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,

    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
})
.then(() => {
  console.log("ADS Configurados.")
});

export default function AppNav() {
  const prefix = Linking.createURL('/');
  console.log(prefix);

  const linking = {
    prefixes: [prefix, "vest://"],
    config: {
      screens: {
        Home: 'Home',
      }
    }
  }

  const [darkMode, setDarkMode] = useState(false);
  const {isLoading, userToken} = useContext(AuthContext);

  const { setErrCode, alertShow, setAlert, errMessage, setErrMessage } = useContext(ErrContext);

  if (isLoading) {
    return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size="large" />
    </View>
    )
  }

  const setNotification = async () => {
      // Verificar se o usuário concedeu permissão para enviar notificações
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
    
      if (existingStatus !== 'granted') {
        setAlert(true);
        setErrMessage('Por favor, conceda permissão para enviar notificações!');
        return;
      }
    
      // Verificar se já existe alguma notificação programada
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      if (notifications.length > 0) {
        console.log('Já existe uma notificação programada:', notifications[0]);
        return;
      }
    
    // Definir o intervalo em que a notificação será enviada (em segundos)
    const minInterval = 3600; // 1 hora
    const maxInterval = 3600*12; // 12 horas

    const titles = ['Ei, amigo!', 'Com licença, meu camarada!', 'Ei, meu patrão!', 'Olá, futuro aprovado na federal!', 'Ei, meu consagrado!'];
    const content = ["Vamos lá, hora de colocar o cérebro para funcionar!","Que tal um desafio? Novas questões esperando por você.","Pratique para o vestibular: responda algumas questões agora.","Estude mais para conquistar a vaga dos seus sonhos. Resolva algumas questões!","Não deixe para depois: resolva questões do vestibular agora mesmo.","Aproveite seu tempo livre para estudar: resolva questões do vestibular.","Aprender nunca é demais! Responda mais questões do vestibular e se prepare melhor.","Não desista agora: resolva mais algumas questões do vestibular e supere seus limites.","Faça do aprendizado um hábito: resolva questões do vestibular todos os dias.","Não se contente com pouco: desafie-se e resolva mais questões do vestibular!","Falta pouco para alcançar a aprovação: continue se dedicando às questões do vestibular.","A aprovação na faculdade dos sonhos está mais perto do que você imagina: estude e se prepare para as questões do vestibular.","Seja persistente: resolva questões do vestibular diariamente e aumente suas chances de ser aprovado na federal.","Acredite em si mesmo e se prepare para a aprovação na faculdade dos sonhos. Resolva mais questões do vestibular agora!","O sucesso está ao seu alcance: dedique-se e conquiste a aprovação na federal ou na faculdade dos seus sonhos."]

    // Obter um índice aleatório dentro da array
    const i = Math.floor(Math.random() * titles.length);
    const i2 = Math.floor(Math.random() * content.length);
    
    // Gerar um horário aleatório dentro do intervalo definido
    const now = Date.now();
    const randomDelay = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval) * 1000; // em milissegundos
    const scheduledTime = now + randomDelay;
    
    // Configurar a notificação
    const notification = {
      content: {
        title: titles[i],
        body: content[i2],
        data: {data: "."}
      },
      trigger: { date: new Date(scheduledTime) },
    };
    
    // Enviar a notificação
    const notificationId = await Notifications.scheduleNotificationAsync(notification);
    console.log('Notificação agendada para:', new Date(scheduledTime), 'ID da notificação:', notificationId);
  }

  useEffect(() => {
    setNotification();
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
      console.log(data);
    })

    return () => {
      EventRegister.removeAllListeners();
    }
  }, [darkMode]);
  console.log(userToken)
  console.log(isLoading);

  return (
    <themeContext.Provider value={darkMode == true ? theme.dark : theme.light}>
      <NavigationContainer linking={linking} theme={darkMode == true ? DarkTheme : DefaultTheme}>
      <AwesomeAlert
            cancelButtonStyle={{backgroundColor: theme.light.mainCol}}
            cancelButtonTextStyle={{color: theme.light.backgroundColor, fontFamily: "MADETOMMY", fontSize: 14, paddingHorizontal: 15, paddingVertical: 5}}
            showCancelButton={true}
            onCancelPressed={() => {setAlert(false); setErrCode("0")}}
            cancelText='Ok.'
            show={alertShow}
            onDismiss  ={() => {setAlert(false);}}
            contentContainerStyle={{borderRadius: 15, backgroundColor: theme.light.backgroundColor}}
            titleStyle={{color: theme.light.light, fontFamily: "MADETOMMY", alignSelf: "center", justifyContent: "center", textAlign: "center", fontSize: 16}}
            title={errMessage} />
        {userToken !== null ? <AppStack /> : <AuthStack /> }
      </NavigationContainer>
    </themeContext.Provider>
  )
}