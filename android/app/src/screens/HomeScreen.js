import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function HomeScreen({navigation}){
    //const { user, logout } = useContext(AuthContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = firestore()
            .collection('THREADS')
            .orderBy('latestMessage.createdAt','desc')
            .onSnapshot((querySnapshot)=>{ //creates a snapshot and updates everytime when the content changed 
                const threads = querySnapshot.docs.map(documentSnapshot=>{
                    return{
                        _id: documentSnapshot.id,
                        name: '',
                        latestMessage:{
                            text:''
                        },
                        ...documentSnapshot.data() 
                        //... - spread operator - allows an iterable such as an array to be expanded in places where zero or more elements are expected
                    };
                });
                setThreads(threads);
                if(loading){
                    setLoading(false);
                }
            });

            return()=> unsubscribe();
    }, []);

    if(loading){
        return <Loading/>;
    }
 
    return(
        <View style={styles.container}>
            <FlatList
                data={threads}
                keyExtractor={item=>item._id}
                ItemSeperatorComponent={()=> <Divider />}
                renderItem={({ item })=>(
                    <TouchableOpacity
                        onPress={()=>navigation.navigate('Room',{thread:item})}
                        //onLongPress={()=>{}} try this thing later
                    >
                        <List.Item
                            title={item.name}
                            description={item.latestMessage.text}
                            titleNumberOfLines={1}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            descriptionNumberOfLines={1}
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
    },
    listDescription:{
        fontSize: 16,
    }, 
});