import {  Text, View, StatusBar } from 'react-native';
import {NativeBaseProvider} from 'native-base'
import React from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import {THEME} from './src/theme'
import { Loading } from '@components/Loading';
import { SignIn } from '@screens/Signin';


export default function App() {
 const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})
  
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor='trasparent'
        translucent
      />
      {
        fontsLoaded ? <SignIn /> : <Loading />
      }
    </NativeBaseProvider>
  );
}
