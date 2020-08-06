import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Text } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';

export default function ProfileScreen(){
    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const [email, setEmail] = useState(currentUser.email);
    const [oldPassword, setOldPassword] = useState('');

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
                                                    }).catch(error=>{
                                                        console.log("Account delete error "+ {error});
                                                    })
                                            }).catch(error=>{
                                                Alert.alert('Error',"Couldn't re authenticate. Please retype the password and try again.");
                                                console.log("Re-Authenticate error "+ {error});
                                            })
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