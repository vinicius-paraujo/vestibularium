// react and other dependencies
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import * as SplashScreen from 'expo-splash-screen';

// from the project
import { Welcome } from '../screens/Welcome';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen component={Welcome} name="Welcome" />
        <Stack.Screen component={LoginScreen} name="Login" />
        <Stack.Screen component={RegisterScreen} name="Register" />
    </Stack.Navigator>
  )
}