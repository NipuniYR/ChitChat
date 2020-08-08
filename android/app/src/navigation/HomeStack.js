import React, {useContext, useState} from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Menu } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import EditRoomScreen from '../screens/EditRoomScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditMessageScreen from '../screens/EditMessageScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PeopleScreen from '../screens/PeopleScreen';
import AddPeopleScreen from '../screens/AddPeopleScreen';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

function ChatApp(){
    const { logout } = useContext(AuthContext);
    const [visibleHome, setVisibleHome] = useState(false);
    const [visibleRoom, setVisibleRoom] = useState(false);

    const openMenuHome = () => setVisibleHome(true);
    const closeMenuHome = () => setVisibleHome(false);

    const openMenuRoom = () => setVisibleRoom(true);
    const closeMenuRoom = () => setVisibleRoom(false);

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
                        <Menu
                            visible={visibleHome}
                            onDismiss={closeMenuHome}
                            anchor={<IconButton
                                    icon='menu'
                                    size={28}
                                    color='#ffffff'
                                    onPress={openMenuHome}
                                />}
                        >
                        <Menu.Item 
                                title='View Profile'
                                onPress={()=>{
                                    navigation.navigate('Profile');
                                    closeMenuHome();
                                }}
                                
                        />
                        <Menu.Item 
                                title='Logout'
                                onPress={()=>logout()}
                        />
                        </Menu>
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
                        <Menu
                            visible={visibleRoom}
                            onDismiss={closeMenuRoom}
                            anchor={<IconButton
                                    icon='menu-down'
                                    size={28}
                                    color='#ffffff'
                                    onPress={openMenuRoom}
                                />}
                        >
                                <Menu.Item
                                    title= "People"
                                    onPress={()=>{
                                        navigation.navigate('People',{id:route.params.thread._id});
                                        closeMenuRoom();
                                    }}
                                />
                                <Menu.Item
                                    title="Edit Room"
                                    onPress={()=>{
                                        navigation.navigate('EditRoom',{id:route.params.thread._id,name:route.params.thread.name});
                                        closeMenuRoom();
                                    }}
                                />
                                <Menu.Item
                                    title="Delete Room"
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
                        </Menu>
                    )
                })}
            />
            <ChatAppStack.Screen
                name='Profile'
                component={ProfileScreen}
                options={({navigation})=>({
                    headerRight:()=>(
                        <IconButton
                            icon='account-edit'
                            size={28}
                            color='#ffffff'
                            onPress={()=>navigation.navigate('EditProfile')}
                        />
                    )
                })}
            />
            <ChatAppStack.Screen
                name='People'
                component={PeopleScreen}
                options={({ navigation, route }) => ({
                    headerRight:()=>(
                        <IconButton
                            icon='account-multiple-plus'
                            size={28}
                            color='#ffffff'
                            onPress={()=>navigation.navigate('Registered Users',{id:route.params.id})}
                        />
                    )
                })}
            />

            {/*<ChatAppStack.Screen
                name='Registered Users'
                component={AddPeopleScreen}
            />*/}
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
            <ModalStack.Screen name='EditRoom' component={EditRoomScreen}/>
            <ModalStack.Screen name='EditMessage' component={EditMessageScreen}/>
            <ModalStack.Screen name='EditProfile' component={EditProfileScreen}/>
            <ModalStack.Screen name='Registered Users' component={AddPeopleScreen}/>
        </ModalStack.Navigator>
    );
}