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
    const [addUserNames,setAddUserNames] = useState([]);

    useEffect(()=>{
        const unsub = firestore()
            .collection('THREADS')
            .doc(route.params.id)
            .onSnapshot(snapshot=>{
              const elemsCur = snapshot._data.users;
              setCurrentUsers(snapshot._data.users);
            
              const unsubscribe = firestore()
              .collection('USERS')
              .onSnapshot(snapshot=>{
                  const elemsAll=[];
                  snapshot.docs.map(doc=>{
                    elemsAll.push(doc._data.uid);
                  },error=>{
                      console.log(error);
                  });
                  setAllUsers(elemsAll);
                  const elemsAdd = elemsAll.filter(x=>!elemsCur.includes(x))
                  setAddUsers(elemsAdd);

                  const elemsPeople = [];
                  elemsAdd.forEach(id=>{
                  const unsubscribe = firestore()
                          .collection('USERS')
                          .where('uid','==',id)
                          .onSnapshot(snapshot=>{
                            snapshot.docs.forEach(doc=>{
                              elemsPeople.push({uid:id,name:doc._data.name});
                            })
                            setAddUserNames(elemsPeople);
                            return()=>unsubscribe();
                        })
                })
                  return()=>unsubscribe();
            })
            return()=>unsub();
        });
        if(loading){
          setLoading(false)
        }
            
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
              data={addUserNames}
              keyExtractor={item=>item.uid}
              extraData={addUserNames}
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
                                    .update({users:firestore.FieldValue.arrayUnion(item.uid)})
                                    .then(res=>{
                                      console.log('User added to the chat');
                                      navigation.navigate('People');
                                    }).catch(error=>{
                                      console.log(error);
                                      Alert.alert('Error',error.message);
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
                      title={item.name}
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
        flex: 1
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