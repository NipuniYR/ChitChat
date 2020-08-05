import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';

export default function ProfileScreen({navigation}){
    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const [email, setEmail] = useState(currentUser.email)

    return(
        <View style={styles.container}>
            <FormInput
                labelName='Email'
                value={email}
                autoCapitalize='none' //react-native TextInput props
                //onChangeText={userEmail => setEmail(userEmail)}
                editable={false}
            />
            <FormButton
                title='Delete Profile'
                modeValue='contained' //button with a background color and elevation shadow
                labelStyle={styles.deleteButtonLabel}
                onPress={() => {
                    console.log("Password"+user.password);
                    Alert.alert(
                        'Delete Account Permanently',
                        'Are you sure you want to delete this Account? Once deleted there is no way back!',
                        [
                            {
                                text: 'Yes',
                                onPress: () => {
                                    // const credential = auth.EmailAuthProvider.credential();
                                    // user.reauthenticateWithCredential(credential)
                                    //     .then(res=>{
                                    //         console.log("User re-authenticated");
                                            user.delete()
                                                .then(res=>{
                                                    console.log("User deleted successfully");
                                                    navigation.navigate('Signup');
                                                }).catch(error=>{
                                                    console.log("Account delete error "+ {error});
                                                })
                                        // }).catch(error=>{
                                        //     console.log("Re-Authenticate error "+ {error});
                                        // })
                                }
                            },
                            {
                                text: 'No'
                            }
                        ],
                        { cancelable: false }
                    );
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