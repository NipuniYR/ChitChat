import React, {useContext, useState} from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import { IconButton } from 'react-native-paper';
import RoomScreen from '../screens/RoomScreen';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();
const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

function ChatApp(){
    const { logout } = useContext(AuthContext);

    return(
        <ChatAppStack.Navigator
            screenOptions={{
                headerStyle:{
                    backgroundColor: '#6646ee',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontSize: 22,
                    textAlign: 'center'
                }
            }}
        >
            <ChatAppStack.Screen 
                name='Home' 
                component={HomeScreen} 
                options={({navigation})=>({
                    headerTitleStyle:{
                        textAlign:'center'
                    },
                    headerRight:()=>(
                        <IconButton
                            icon='message-plus'
                            size={28}
                            color='#ffffff'
                            onPress={()=>navigation.navigate('AddRoom')}
                        />
                    ),
                    headerLeft:()=>(
                        <IconButton
                            icon='logout-variant'
                            size={28}
                            color='#ffffff'
                            onPress={()=>logout()}
                        />
                    )
                })}
            />
            <ChatAppStack.Screen 
                name='Room' 
                component={RoomScreen}
                options={({ navigation, route }) => ({
                    //each screen coponent has a route prop 
                    //route.params - parameters passed when navigating navigate.('Room',{ thread: item })
                    //name - name of the room stored in the firestore
                    title: route.params.thread.name,
                    headerRight:()=>(
                        <IconButton
                            icon='delete'
                            size={28}
                            color='#ffffff'
                            onPress={()=>{
                                console.log("These are the route parameters "+route.params.thread._id)
                                Alert.alert(
                                    'Delete Room',
                                    'Are you sure you want to delete this Room?',
                                    [
                                        {
                                            text: 'Yes',
                                            onPress: () => {
                                                const docRef = firestore()
                                                    .collection('THREADS')
                                                    .doc(route.params.thread._id)

                                                docRef.delete()
                                                    .then(res=>{
                                                        console.log("Room deleted successfully");
                                                        navigation.navigate('Home');
                                                    })
                                            }
                                        },
                                        {
                                            text: 'No'
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                    )
                })}
            />
        </ChatAppStack.Navigator>
    );
}

export default function HomeStack(){
    return(
        //A modal screen displays content that temporarily blocks interactions with the main view. 
        //It’s like a popup and usually has a different transition in terms of how the screen opens and closes. 
        <ModalStack.Navigator mode='modal' /* to made the screens slide up */ headerMode='none'>
            <ModalStack.Screen name='ChatApp' component={ChatApp} />
            <ModalStack.Screen name='AddRoom' component={AddRoomScreen} />
        </ModalStack.Navigator>
    );
}