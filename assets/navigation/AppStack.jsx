// react and other dependencies
import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';

import { createDrawerNavigator } from '@react-navigation/drawer';

SplashScreen.preventAutoHideAsync();

// from the project
import { Home } from '../screens/Home';
import { Question } from '../screens/Question';
import { QuestionProvider } from '../context/QuestionContext';
import Settings from '../screens/Settings';
import CustomDrawer from '../components/CustomDrawer';
import Stats from '../screens/Stats';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  return (
    <QuestionProvider>
    <Drawer.Navigator  drawerContent={props => <CustomDrawer {...props} />} screenOptions={{headerShown: false}}>
        <Drawer.Screen component={Home} name="Home" />
        <Drawer.Screen component={Settings} name="Config" />
        <Drawer.Screen component={Question} name="Question" />
        <Drawer.Screen component={Stats} name="Stats" />
    </Drawer.Navigator>
    </QuestionProvider>
  )
}