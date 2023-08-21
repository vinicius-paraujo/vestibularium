// react and derivatives
import React from 'react';
import { AuthProvider } from './assets/context/AuthContext';
import { ErrProvider } from './assets/context/ErrContext';
import AppNav from './assets/navigation/AppNav';

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();

export default function App() {
  return (
    <ErrProvider>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </ErrProvider>
  )
}