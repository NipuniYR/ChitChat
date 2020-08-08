import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Alert, FlatList, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';

export default function PeopleScreen({navigation, route}){
    const { user } = useContext(AuthContext);
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        firestore()
            .collection('THREADS')
            .doc(route.params.id)
            .onSnapshot(snapshot=>{
            setPeople(snapshot._data.users);
            if(loading){
                setLoading(false)
            }
        })
            
    }, []);

    if(loading){
        return <Loading/>
    }

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Tap on a user to remove</Text>
            <FlatList
                data={people}
                keyExtractor={item=>item}
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
                                      .update({users:firestore.FieldValue.arrayRemove(item)})
                                      .then(res=>{
                                        if(item==user.email){
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
                            title={item}
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
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center'
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