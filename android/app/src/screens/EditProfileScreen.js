import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { IconButton, Title, Text } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function EditProfileScreen({navigation}){
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [name, setName] = useState(user.displayName);
    const [email, setEmail] = useState(user.email)
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [userDocID, setUserDocID] = useState('');

    useEffect(()=>{
        firestore()
            .collection('USERS')
            .where('uid','==',user.uid)
            .get()
            .then(querySanpshot=>{
                querySanpshot.forEach(doc=>{
                    setUserDocID(doc.id);
                })
            }).catch(error=>{
                console.log(error);
            });
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.closeButtonContainer}>
                <IconButton
                icon='close-circle'
                size={36}
                color='#6646ee'
                onPress={() => navigation.goBack()}
                />
            </View>
            <ScrollView contentContainerStyle={styles.innerContainer}>
                <Title style={styles.titleText}>Change Display Name</Title>
                <FormInput
                    labelName='Display Name'
                    value={name}
                    autoCapitalize='none' //react-native TextInput props
                    onChangeText={name => setName(name)}
                />
                <Title style={styles.titleText}>Change Email</Title>
                <FormInput
                    labelName='Email'
                    value={email}
                    keyboardType='email-address'
                    autoCapitalize='none' //react-native TextInput props
                    onChangeText={userEmail => setEmail(userEmail)}
                />
                <Title style={styles.titleText}>Change Password</Title>
                <FormInput
                    labelName='New Password'
                    value={newPassword}
                    autoCapitalize='none'
                    secureTextEntry={true}
                    onChangeText={password=>setNewPassword(password)}
                />
                <FormInput
                    labelName='Re-type New Password'
                    value={rePassword}
                    autoCapitalize='none'
                    secureTextEntry={true}
                    onChangeText={password=>setRePassword(password)}
                />
                <Text>Please enter your password before updating the profile</Text>
                <FormInput
                    labelName='Password'
                    value={oldPassword}
                    autoCapitalize='none'
                    secureTextEntry={true}
                    onChangeText={password=>setOldPassword(password)}
                />
                <FormButton
                    title='Update Profile'
                    modeValue='contained' //button with a background color and elevation shadow
                    labelStyle={styles.updateButtonLabel}
                    disabled={oldPassword.length === 0 || email.length === 0 || name.length === 0 || ((user.email != email) && (newPassword.length > 0)) || ((user.email === email) && (newPassword.length === 0) && (user.displayName === name)) || ((newPassword.length > 0) && (rePassword.length == 0))}
                    onPress={() => {
                        Alert.alert('Update Profile','Are you sure you want to update profile?',
                            [
                                {
                                    text:'Yes',
                                    onPress: () => {
                                        if(user.displayName != name){
                                            user.updateProfile({
                                                displayName:name
                                            }).then(res=>{
                                                firestore()
                                                    .collection('USERS')
                                                    .doc(userDocID)
                                                    .update({
                                                        name:name
                                                    }).then(res=>{
                                                        console.log("User updated");
                                                        Alert.alert('Successful','User updated successfully');
                                                }).catch(error=>{
                                                    console.log(error);
                                                    Alert.alert('Error',error.message);
                                                });
                                            }).catch(error=>{
                                                console.log(error);
                                                Alert.alert('Error',error.message);
                                            });
                                        }
                                        if(user.email != email){
                                            const credential = auth.EmailAuthProvider.credential(user.email,oldPassword);
                                            user.reauthenticateWithCredential(credential)
                                                .then(res=>{
                                                    console.log("User re-authenticated");
                                                    user.updateEmail(email)
                                                        .then(res=>{
                                                            console.log("Email updated successfully");
                                                            firestore()
                                                                .collection('USERS')
                                                                .doc(userDocID)
                                                                .update({
                                                                email:email
                                                            }).then(res=>{
                                                                console.log("User updated");
                                                                
                                                            }).catch(error=>{
                                                                console.log(error);
                                                                Alert.alert('Error',error.message);
                                                            });
                                                            logout();
                                                        }).catch(error=>{
                                                                console.log(error);
                                                                Alert.alert('Error',error.message);
                                                        })
                                                }).catch(error=>{
                                                        console.log(error);
                                                        Alert.alert('Error',error.message);
                                                })
                                        }
                                        if(newPassword.length > 0 && rePassword.length > 0){
                                            if(newPassword != rePassword){
                                                Alert.alert('Error','Re typed password does not match with new Password');
                                            }
                                            else{
                                                const credential = auth.EmailAuthProvider.credential(user.email,oldPassword);
                                                user.reauthenticateWithCredential(credential)
                                                    .then(res=>{
                                                        console.log("User re-authenticated");
                                                        user.updatePassword(newPassword)
                                                            .then(res=>{
                                                                console.log("Password updated successfully");
                                                                logout();
                                                            }).catch(error=>{
                                                                Alert.alert('Error',error.message);
                                                                console.log(error);
                                                            })
                                                    }).catch(error=>{
                                                            console.log(error);
                                                            Alert.alert('Error',error.message);
                                                    })
                                            }
                                        }
                                    }
                                },
                                {
                                    text: 'No'
                                }
                            ],
                            { cancelable: false }
                        )
                    }}
                />
                <Text style={styles.noteText}>Note: You can't update both email and password at the same time. You have to re login to the app once you update either email or password</Text>
            </ScrollView>
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
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 30,
        right: 0,
        zIndex: 1,
    },
    titleText:{
        fontSize: 24,
        marginBottom: 10
    },
    updateButtonLabel:{
        fontSize: 20
    },
    noteText:{
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
});