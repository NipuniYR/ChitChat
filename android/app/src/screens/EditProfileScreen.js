import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { IconButton, Title, Text } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';

export default function EditProfileScreen({navigation}){
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [email, setEmail] = useState(user.email)
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

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
            <Title style={styles.titleText}>Change Email</Title>
            <FormInput
                labelName='Email'
                value={email}
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
                disabled={oldPassword.length === 0 || email.length === 0 || ((user.email != email) && (newPassword.length > 0)) || ((user.email == email) && (newPassword.length == 0)) || ((newPassword.length > 0) && (rePassword.length == 0))}
                onPress={() => {
                    Alert.alert('Update Profile','Are you sure you want to update profile?',
                        [
                            {
                                text:'Yes',
                                onPress: () => {
                                    if(user.email != email){
                                        const credential = auth.EmailAuthProvider.credential(user.email,oldPassword);
                                        user.reauthenticateWithCredential(credential)
                                            .then(res=>{
                                                console.log("User re-authenticated");
                                                user.updateEmail(email)
                                                    .then(res=>{
                                                        console.log("Email updated successfully");
                                                        logout();
                                                    }).catch(error=>{
                                                        if (error.code === 'auth/invalid-email') {
                                                            console.log('That email address is invalid!');
                                                            Alert.alert('Error','Invalid email. Please try again.');
                                                        }
                                                        else if (error.code === 'auth/email-already-in-use') {
                                                            console.log('Email alredy in use');
                                                            Alert.alert('Error','That email is already in use. Please login or try again using another email.');
                                                        }
                                                        else{
                                                            console.log('An error occured');
                                                            console.log(error);
                                                            Alert.alert('Error',"Oops... An error occured. Couldn't update email.");
                                                        }
                                                    })
                                            }).catch(error=>{
                                                if (error.code === 'auth/wrong-password') {
                                                    console.log('That password is incorrect');
                                                    Alert.alert('Error',"Re-authentication failed. Incorrect Password. Please try again.");
                                                }
                                                else{
                                                    Alert.alert('Error','Re-authentication Failed.');
                                                    console.log(error);
                                                }
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
                                                            Alert.alert('Error',"Couldn't update password. Please try again.");
                                                            console.log(error);
                                                        })
                                                }).catch(error=>{
                                                    if (error.code === 'auth/wrong-password') {
                                                        console.log('That password is incorrect');
                                                        Alert.alert('Error',"Re-authentication failed. Incorrect Password. Please try again.");
                                                    }
                                                    else{
                                                        Alert.alert('Error','Re-authentication Failed.');
                                                        console.log(error);
                                                    }
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
    navButtontext:{
        fontSize: 16
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