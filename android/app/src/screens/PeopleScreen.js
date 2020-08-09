import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Alert, FlatList, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';

export default function PeopleScreen({navigation, route}){
    const { user } = useContext(AuthContext);
    const [peopleID, setPeopleID] = useState([]);
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsub =firestore()
            .collection('THREADS')
            .doc(route.params.id)
            .onSnapshot(snapshot=>{
                const peopleIDElems = snapshot._data.users;
                setPeopleID(peopleIDElems);
                const peopleElems = [];
                peopleIDElems.forEach(id=>{
                    firestore()
                        .collection('USERS')
                        .where('uid','==',id)
                        .onSnapshot(snapshot=>{
                            snapshot.forEach(doc=>{
                                peopleElems.push({uid:id,name:doc._data.name})
                            })
                            setPeople(peopleElems);
                        })
                })
                return()=>unsub();
        })
        if(loading){
            setLoading(false)
        }
            
    }, []);

    if(loading){
        return <Loading/>
    }

    return(
        <View style={styles.container}>
            <Text style={styles.textdeco}>Tap on a user to remove</Text>
            <FlatList
                data={people}
                keyExtractor={item=>item.uid}
                extraData={people}
                ItemSeperatorComponent={()=> <Divider />}
                renderItem={({ item })=>(
                    <TouchableOpacity
                        onPress={()=>{
                            Alert.alert(
                              'Confirm',
                              'Are you sure you want to remove this user from the chat?',
                              [
                                {
                                  text: 'Yes',
                                  onPress:()=>{
                                    firestore()
                                      .collection('THREADS')
                                      .doc(route.params.id)
                                      .update({users:firestore.FieldValue.arrayRemove(item.uid)})
                                      .then(res=>{
                                        if(item.uid==user.uid){
                                            navigation.navigate('Home');
                                        }
                                        console.log('User removed from the chat');
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
                            title={item.name}
                            titleNumberOfLines={1}
                            titleStyle={styles.listTitle}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({ 
    container:{
        backgroundColor: '#f5f5f5',
        flex: 1
    },
    listTitle:{
        fontSize: 22,
        alignContent: 'center',
        textAlign: 'center'
    },
    textdeco:{
        alignItems: 'center',
        textAlign: 'center'
    } 
});