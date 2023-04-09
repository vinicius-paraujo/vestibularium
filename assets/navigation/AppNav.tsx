// react
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

// other dependencies
import { EventRegister } from 'react-native-event-listeners';
import AwesomeAlert from 'react-native-awesome-alerts';

// from the project
import theme from "../theme/theme"
import themeContext from "../theme/themeContext"
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from '../context/AuthContext';
import { ErrContext } from '../context/ErrContext';

import * as Linking from 'expo-linking';

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

  const { setErrCode, alertShow, setAlert, errMessage } = useContext(ErrContext);

  if (isLoading) {
    return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size="large" />
    </View>
    )
  }

  useEffect(() => {
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