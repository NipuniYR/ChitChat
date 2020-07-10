/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Routes from './android/app/src/navigation/Routes';

const theme = {
    ...DefaultTheme,
    //dark:true,
    //mode: 'adaptive',
    roundness: 2,
    colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
}

export default function Main(){
    return(
        <PaperProvider>
            <Routes/>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
