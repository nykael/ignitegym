import { StatusBar } from 'react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';


export default function App() {
 const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})
  
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#202024'}}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor='trasparent'
        translucent
      />
      {
        fontsLoaded ? <Text >Hello World</Text> : <View />
      }
    </View>
  );
}
