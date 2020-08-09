import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Text } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ProfileScreen(){
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.displayName);
    const [oldPassword, setOldPassword] = useState('');
    const [userDocID, setUserDocID] = useState([]);

    useEffect(()=>{
        firestore()
            .collection('USERS')
            .where('uid','==',user.uid)
            .get()
            .then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    setUserDocID(doc.id);
                })
            }).catch(error=>{
                console.log(error);
            });
    }, []);

    return(
        <View style={styles.container}>
            <Title style={styles.titleText}>Profile Details</Title>
            <FormInput
                labelName='Display Name'
                value={name}
                autoCapitalize='none' //react-native TextInput props
                //onChangeText={userName => setName(userName)}
                editable={false}
            />
            <FormInput
                labelName='Email'
                value={email}
                autoCapitalize='none' //react-native TextInput props
                //onChangeText={userEmail => setEmail(userEmail)}
                editable={false}
            />
            <Title style={styles.titleText}>Delete Profile</Title>
            <Text>Please enter your password before deleting the profile</Text>
            <FormInput
                labelName='Password'
                value={oldPassword}
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={password=>setOldPassword(password)}
            />
            <FormButton
                title='Delete Profile'
                modeValue='contained' //button with a background color and elevation shadow
                labelStyle={styles.deleteButtonLabel}
                disabled={oldPassword.length===0}
                onPress={() => {
                    if(oldPassword.length>0){
                        Alert.alert(
                            'Delete Account Permanently',
                            'Are you sure you want to delete this Account? Once deleted there is no way back!',
                            [
                                {
                                    text: 'Yes',
                                    onPress: () => {
                                        const credential = auth.EmailAuthProvider.credential(user.email,oldPassword);
                                        user.reauthenticateWithCredential(credential)
                                            .then(res=>{
                                                console.log("User re-authenticated");
                                                user.delete()
                                                    .then(res=>{
                                                        console.log("User deleted successfully");
                                                        firestore()
                                                            .collection('USERS')
                                                            .doc(userDocID)
                                                            .delete()
                                                            .then(res=>{
                                                                console.log("User removed");
                                                            }).catch(error=>{
                                                                console.log(error);
                                                                Alert.alert('Error',error.message);
                                                            });
                                                    }).catch(error=>{
                                                        console.log(error);
                                                        Alert.alert('Error',error.message);
                                                    });
                                            }).catch(error=>{
                                                console.log(error);
                                                Alert.alert('Error',error.message);
                                            });
                                    }
                                },
                                {
                                    text: 'No'
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f5f5f5',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText:{
        fontSize: 24,
        marginBottom: 10
    },
    deleteButtonLabel:{
        fontSize: 20
    }
});