import React, { useState, useContext, useEffect } from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export default function RoomScreen({ route, navigation }){
    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON(); //coverting data to JSON object
    const [messages, setMessages] = useState([]);
    const { thread } = route.params;

    useEffect(()=>{
        console.log({ user });
    }, []);

    //helper method that sends a message
    async function handleSend(messages){
        const text = messages[0].text;

        firestore()
            .collection('THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                user:{
                    _id:currentUser.uid,
                    email:currentUser.email
                }
            });

        await firestore()
            .collection('THREADS')
            .doc(thread._id)
            .set({
                latestMessage:{
                    text,
                    createdAt: new Date().getTime()
                }
            },
            {merge: true} //update fields in the document or create it if it doesn't exist
            );
    }

    useEffect(()=>{
        const messageListner = firestore()
                .collection('THREADS')
                .doc(thread._id)
                .collection('MESSAGES')
                .orderBy('createdAt','desc')
                .onSnapshot(querySnapshot=>{
                    const messages = querySnapshot.docs.map(doc=>{
                        const firebaseData=doc.data()

                        const data = {
                            _id: doc.id,
                            text: '',
                            createdAt: new Date().getTime(),
                            ...firebaseData
                        };

                        if(!firebaseData.system){
                            data.user = {
                                ...firebaseData.user,
                                name: firebaseData.user.email
                            };
                        }

                        return data;
                    });

                    setMessages(messages)
                });

                return () =>messageListner();
    }, []);

    function renderBubble(props){
        return(
            <Bubble
                {...props}
                wrapperStyle={{
                    left:{
                        backgroundColor: '#ded6ff',
                        borderRadius: 15
                    },
                    right:{
                        backgroundColor: '#6646ee'
                    }
                }}
                textStyle={{
                    right:{
                        color:'#fff'
                    }
                }}
            />
        );
    }

    function renderSend(props){
        return(
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton icon='send-circle' size={32} color='#6646ee'/>
                </View>
            </Send>
        )
    }

    function scrollToBottomComponent() {
        return (
          <View style={styles.bottomComponentContainer}>
            <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
          </View>
        );
    }

    function renderLoading(){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee'/>
            </View>
        );
    }

    function renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                wrapperStyle={styles.systemMessageWrapper}
                textStyle={styles.systemMessageText}
            />
        );
    }

    function handleBubbleLongPress(context, message){
        console.log("Bubble long pressed ");
        if(message.user.email==user.email){
            const options=['Edit Message','Delete Message','Cancel'];
            const cancelButtonIndex = options.length-1;
            context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex
            }, buttonIndex=>{
                switch(buttonIndex){
                    case 0:
                        console.log("Pressed edit");
                        navigation.navigate('EditMessage',{threadID:thread._id,msgID:message._id,text:message.text});
                        break;
                    case 1:
                        console.log("Pressed delete");
                        Alert.alert(
                            'Delete Message',
                            'Are you sure you want to delete this message?',
                            [
                                {
                                    text: 'Yes',
                                    onPress: () => {
                                        const docRef = firestore()
                                            .collection('THREADS')
                                            .doc(thread._id)
                                            .collection('MESSAGES')
                                            .doc(message._id)

                                        docRef.delete()
                                            .then(res=>{
                                                console.log("Room deleted successfully");
                                                navigation.navigate('Home');
                                            }).catch(error=>{
                                                console.log(error);
                                            })
                                    }
                                },
                                {
                                    text: 'No'
                                }
                            ],
                            { cancelable: false }
                        );
                        break;
                }
            });
        }
    }

    return(
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            user={{_id: currentUser.uid}}
            placeholder='Type your message here...'
            renderBubble={renderBubble}
            onLongPress={handleBubbleLongPress}
            showUserAvatar
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
            renderSystemMessage={renderSystemMessage}
        />
    );
}

const styles = StyleSheet.create({
    sendingContainer:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    systemMessageWrapper:{
        backgroundColor: '#6646ee',
        borderRadius: 4,
        padding: 5
    },
    systemMessageText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    }
});