import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';
import FormButton from '../components/FormButton';

export default function HomeScreen({navigation}){

    return(
        <View style={styles.container}>
            <Title>Home Screen</Title>
            <FormButton modeValue='contained' title='Logout'/>
        </View>
    );
}

const styles = StyleSheet.create({ 
    container:{
        backgroundColor: '#f5f5f5',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    } 
});