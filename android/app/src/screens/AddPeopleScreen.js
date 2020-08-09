import React, { useState, useEffect } from 'react';
import { View,  StyleSheet, FlatList, Alert, Text } from 'react-native';
import { IconButton, List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AddPeopleScreen({navigation, route}){
    const [loading, setLoading] = useState(true);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [addUsers, setAddUsers] = useState([]);

    useEffect(()=>{
        firestore()
            .collection('THREADS')
            .doc(route.params.id)
            .onSnapshot(snapshot=>{
              const elemsCur = snapshot._data.users;
              setCurrentUsers(snapshot._data.users);
            
              firestore()
              .collection('USERS')
              .onSnapshot(snapshot=>{
                  const elemsAll=[];
                  snapshot.docs.map(doc=>{
                    const data = {
                      displayName:doc._data.name,
                      email:doc._data.email
                    }
                    elemsAll.push(data);
                  },error=>{
                      console.log(error);
                  });
                  setAllUsers(elemsAll);
                  const add = elemsAll.filter(x=>!elemsCur.includes(x));
                  setAddUsers(elemsAll.filter(x=>!elemsCur.includes(x)));
                  console.log("Inside ");
                  console.log(add);
                  if(loading){
                    setLoading(false)
                  }
            });
        });
            
    }, []);

    if(loading){
        return <Loading/>
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
            <Text style={styles.text}>Tap on a user to add</Text>
            <FlatList
              data={addUsers}
              keyExtractor={item=>item.email}
              extraData={addUsers}
              ItemSeperatorComponent={()=><Divider />}
              renderItem={({ item })=>(
                <TouchableOpacity
                        onPress={()=>{
                          Alert.alert(
                            'Confirm',
                            'Are you sure you want to add this user to the chat?',
                            [
                              {
                                text: 'Yes',
                                onPress:()=>{
                                  firestore()
                                    .collection('THREADS')
                                    .doc(route.params.id)
                                    .update({users:firestore.FieldValue.arrayUnion(item)})
                                    .then(res=>{
                                      console.log('User added to the chat');
                                    }).catch(error=>{
                                      console.log(error);
                                    });
                                }
                              },
                              {
                                text: 'No'
                              }
                            ],
                            {cancelable: false}
                          );
                        }}
                >
                  <List.Item
                      title={item.displayName}
                      titleNumberOfLines={1}
                      titleStyle={styles.listTitle}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f5f5f5',
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center'
    },
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
      paddingTop: 80,
      justifyContent: 'center'
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    buttonLabel: {
      fontSize: 22,
    },
    listTitle:{
        fontSize: 22,
        alignContent: 'center',
        textAlign: 'center'
    },
    text:{
        alignItems: 'center',
        textAlign: 'center'
    }
  });