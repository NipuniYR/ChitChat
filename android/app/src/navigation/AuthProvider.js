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
                        Alert.alert('Error',error.message);
                    }
                },
                register: async (email,password, name) => {
                        await auth().createUserWithEmailAndPassword(email,password)
                            .then(userCreds=>{
                                userCreds.user.updateProfile({
                                    displayName:name
                                }).then(res=>{
                                    const currentUser = auth().currentUser;
                                    firestore()
                                    .collection('USERS')
                                    .add({
                                        name: currentUser.displayName,
                                        uid: currentUser.uid,
                                        email: currentUser.email
                                    }).then(res=>{
                                        console.log("Added new user");
                                    }).catch(error=>console.log(error))
                                }).catch(error=>console.log(error))
                            }).catch(error=>{
                            console.log(error);
                            Alert.alert('Error',error.message);
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