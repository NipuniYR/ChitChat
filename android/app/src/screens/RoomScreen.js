import React, { useState } from 'react';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function RoomScreen(){
    const [messages, setMessages] = useState([
        //Mock messages
    //System message 
    {
        _id: 0,
        text: 'New room created',
        createdAt: new Date().getTime(),
        system: true
    },
    //chat message
    {
        _id: 1,
        text: 'Hello!',
        createdAt: new Date().getTime(),
        user:{
            _id: 2,
            name: 'Test User'
        }
    }
    ]);

    //helper method that sends a message
    function handleSend(newMessage = []){
        setMessages(GiftedChat.append(messages, newMessage));
    }

    function renderBubble(props){
        return(
            <Bubble
                {...props}
                wrapperStyle={{
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

    return(
        <GiftedChat
            messages={messages}
            onSend={newMessage=> handleSend(newMessage)}
            user={{_id: 1, name: 'user Test'}}
            renderBubble={renderBubble}
            placeholder='Type your message here...'
            showUserAvatar
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
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
    }
});