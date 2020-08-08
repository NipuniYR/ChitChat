import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Text } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ProfileScreen(){
    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const [email, setEmail] = useState(currentUser.email);
    const [oldPassword, setOldPassword] = useState('');
    const [userDocID, setUserDocID] = useState([]);

    useEffect(()=>{
        firestore()
            .collection('USERS')
            .where('email','==',user.email)
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
                onPress={() => {
                    if(oldPassword.length==0){
                        Alert.alert('Error','You should enter your password to delete this profile')
                    }
                    else if(oldPassword.length>0){
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
                                                        docRef = firestore()
                                                            .collection('USERS')
                                                            .doc(userDocID)
                                                            
                                                        docRef.delete()
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
    },
    navButtontext:{
        fontSize: 16
    }
});