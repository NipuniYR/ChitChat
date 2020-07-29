import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const[user,setUser] = useState(null);

    return(
        <AuthContext.Provider
            value={{
                user, //current user in the application
                setUser,
                login: async (email, password) => {  //async - this functions returns a promise
                    try{
                        //await - wait until the promise settles (doesn’t cost any CPU resources, because the engine can do other jobs in the meantime)
                        await auth().signInWithEmailAndPassword(email,password);
                    }
                    catch(e){
                        console.log(e);
                        if (e.code === 'auth/invalid-email') {
                            console.log('That email address is invalid!');
                            Alert.alert('Error','Invalid email. Please try again.');
                        }
                        else if (e.code === 'auth/user-not-found') {
                            console.log('User not found');
                            Alert.alert('Error','User not found. Please register.');
                        }
                        else if (e.code === 'auth/wrong-password') {
                            console.log('That password is incorrect');
                            Alert.alert('Error','Incorrect password. Please try again.');
                        }
                        else{
                            console.log('An error occured');
                            Alert.alert('Error','Oops... An error occured');
                        }
                    }
                },
                register: async (email,password) => {
                    try{
                        await auth().createUserWithEmailAndPassword(email,password);
                    }
                    catch(e){
                        console.log(e);
                        if (e.code === 'auth/invalid-email') {
                            console.log('That email address is invalid!');
                            Alert.alert('Error','Invalid email. Please try again.');
                        }
                        else if (e.code === 'auth/email-already-in-use') {
                            console.log('Email alredy in use');
                            Alert.alert('Error','That email is already in use. Please login or try again using another email.');
                        }
                        else{
                            console.log('An error occured');
                            Alert.alert('Error','Oops... An error occured');
                        }
                    }
                },
                logout: async () => {
                    try{
                        await auth().signOut();
                    }
                    catch(e){
                        console.error(e);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>    
    );
}