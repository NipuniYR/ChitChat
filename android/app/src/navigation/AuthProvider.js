import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
                    catch(error){
                        console.log(error);
                        if (error.code === 'auth/invalid-email') {
                            console.log('That email address is invalid!');
                            Alert.alert('Error','Invalid email. Please try again.');
                        }
                        else if (error.code === 'auth/user-not-found') {
                            console.log('User not found');
                            Alert.alert('Error','User not found. Please register.');
                        }
                        else if (error.code === 'auth/wrong-password') {
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
                        await auth().createUserWithEmailAndPassword(email,password)
                            .then(userCreds=>{
                                firestore()
                                    .collection('USERS')
                                    .add({
                                        uid: userCreds.user.uid,
                                        email: userCreds.user.email
                                    }).then(res=>{
                                        console.log("Added new user");
                                    })
                            }).catch(error=>{
                        console.log(error);
                        if (error.code === 'auth/invalid-email') {
                            console.log('That email address is invalid!');
                            Alert.alert('Error','Invalid email. Please try again.');
                        }
                        else if (error.code === 'auth/email-already-in-use') {
                            console.log('Email alredy in use');
                            Alert.alert('Error','That email is already in use. Please login or try again using another email.');
                        }
                        else if (error.code === 'auth/weak-password'){
                            console.log('Weak Password');
                            Alert.alert('Error','That password is too weak. Try again with a new password.');
                        }
                        else{
                            console.log('An error occured');
                            Alert.alert('Error','Oops... An error occured');
                        }
                    });
                },
                logout: async () => {
                    try{
                        await auth().signOut();
                    }
                    catch(error){
                        console.error(error);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>    
    );
}