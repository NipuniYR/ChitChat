import React, { useState } from 'react';
import { View,  StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';

export default function EditRoomScreen({navigation,route}){
    const [roomName, setRoomName] = useState(route.params.name);
    //console.log(route.params.id);

    function handleButtonPress(){
        if(roomName.length>0){
            console.log("Hey from Button " + route.params.id);
            const docRef = firestore()
                .collection('THREADS')
                .doc(route.params.id)

            docRef.update({
                name: roomName
            }).then(res=>{
                console.log("Document updated successfully");
                navigation.navigate('Home');
                //Later try the querySnapShot thing and get real time room name
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
              disabled={roomName.length === 0} //=== - no type conversion and return true only if both value and type are identical
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