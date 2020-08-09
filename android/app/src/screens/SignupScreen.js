import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert} from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function SignupScreen({navigation}){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const { register } = useContext(AuthContext);

    return(
        <View style={styles.container}>
            <Title style={styles.titletext}>Register to ChitChat</Title>
            <FormInput
                labelName='Display name'
                value={name}
                onChangeText={name=>setName(name)}
            />
            <FormInput
                labelName='Email'
                value={email}
                autoCapitalize='none'
                keyboardType='email-address'
                onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
                labelName='Password'
                value={password}
                secureTextEntry={true}
                onChangeText={userPassword => setPassword(userPassword)}
            />
            <FormInput
                labelName='Re-Password'
                value={rePassword}
                secureTextEntry={true}
                onChangeText={rePassword => setRePassword(rePassword)}
            />
            <FormButton
                title='Signup'
                modeValue='contained'
                labelStyle={styles.signupButtonLabel}
                disabled={email.length===0 || password.length===0 || rePassword.length===0}
                onPress={() => {
                    if(rePassword==password){
                        register(email, password, name);
                    }
                    else{
                        Alert.alert('Error','Re-Password do not match. Please try again.');
                    }
                }}
            />
            <IconButton
                icon='keyboard-backspace'
                size={30}
                style={styles.navButton}
                color='#6646ee'
                onPress={() => navigation.goBack()}
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
    titletext:{
        fontSize: 24,
        marginBottom: 10
    },
    signupButtonLabel:{
        fontSize: 22
    },
    navButton:{
        marginTop: 10
    }
});