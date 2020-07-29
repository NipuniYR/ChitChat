import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';

const { height, width } = Dimensions.get('screen'); //get the screen width and height

export default function FormInput({labelName, ...rest}){
    return(
        <TextInput
            label={labelName}
            style={styles.input}
            numberOfLines={1}
            {...rest} //to have other prop values
            //With the help of rest parameters (..rest) a function can be called with any number of arguments 
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginBottom:10,
        width: width/1.5,
        height: height/15
    } 
});