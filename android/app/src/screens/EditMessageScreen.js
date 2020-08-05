import React, { useState } from 'react';
import { View,  StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';

export default function EditMessageScreen({navigation,route}){
    const [message, setMessage] = useState(route.params.text);
    //console.log(route.params.id);

    function handleButtonPress(){
        if(message.length>0){
            const docRef = firestore()
                .collection('THREADS')
                .doc(route.params.threadID)
                .collection('MESSAGES')
                .doc(route.params.msgID)

            docRef.update({
                text: message
            }).then(res=>{
                console.log("Document updated successfully");
                navigation.navigate('Room');
            }).catch(error=>{
                console.log(error);
            })
        }
    }

    return (
        <View style={styles.rootContainer}>
          <View style={styles.closeButtonContainer}>
            <IconButton
              icon='close-circle'
              size={36}
              color='#6646ee'
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.innerContainer}>
            <Title style={styles.title}>Edit Message</Title>
            <FormInput
              labelName='Message'
              value={message}
              onChangeText={text => setMessage(text)}
              //clearButtonMode='while-editing'
            />
            <FormButton
              title='Update'
              modeValue='contained'
              labelStyle={styles.buttonLabel}
              onPress={() => handleButtonPress()}
              disabled={message.length === 0} //=== - no type conversion and return true only if both value and type are identical
            />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    buttonLabel: {
      fontSize: 22,
    },
  });