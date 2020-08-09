import React, { useState } from 'react';
import { View,  StyleSheet, Alert } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';

export default function EditRoomScreen({navigation,route}){
    const [roomName, setRoomName] = useState(route.params.name);

    function handleButtonPress(){
        if(roomName.length>0){
            const docRef = firestore()
                .collection('THREADS')
                .doc(route.params.id)

            docRef.update({
                name: roomName
            }).then(res=>{
                console.log("Document updated successfully");
                navigation.navigate('Home');
            }).catch(error=>{
              console.log(error);
              Alert.alert('Error',error.message);
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
            <Title style={styles.title}>Edit Chat Room name</Title>
            <FormInput
              labelName='Room Name'
              value={roomName}
              onChangeText={text => setRoomName(text)}
              //clearButtonMode='while-editing'
            />
            <FormButton
              title='Update'
              modeValue='contained'
              labelStyle={styles.buttonLabel}
              onPress={() => handleButtonPress()}
              disabled={roomName.length === 0 || roomName === route.params.name} //=== - no type conversion and return true only if both value and type are identical
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