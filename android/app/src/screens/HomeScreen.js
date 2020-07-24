import React, {useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Title, List, Divider } from 'react-native-paper';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
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
            .onSnapshot((querySnapshot)=>{
                const threads = querySnapshot.docs.map((documentSnapshot)=>{
                    return{
                        _id: documentSnapshot.id,
                        name: '',
                        ...documentSnapshot.data(),
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
            {/*<Title>Home Screen</Title>
            <Title>Welcome {user.uid}</Title>
            <FormButton 
                modeValue='contained' 
                title='Logout'
                onPress={()=>logout()}
            />*/}
            <FlatList
                data={threads}
                keyExtractor={(item)=>item._id}
                ItemSeperatorComponent={()=> <Divider/>}
                renderItem={({ item })=>(
                    <TouchableOpacity
                        onPress={()=>navigation.navigate('Room',{thread:item})}
                    >
                        <List.Item
                            title={item.name}
                            description='Item description'
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