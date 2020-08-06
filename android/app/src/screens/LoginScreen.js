import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function LoginScreen({navigation}){
    const [email, setEmail] = useState(''); // const [] - destructuring assignment (array) 
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); // const {} - destructuring assignment (object)
    
    return(
        <View style={styles.container}>
            <Title style={styles.titleText}>Welcome to ChitChat</Title>
            <FormInput
                labelName='Email'
                value={email}
                autoCapitalize='none' //react-native TextInput props
                onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
                labelName='Password'
                value={password}
                secureTextEntry={true} //react-native TextInput props
                onChangeText={userPassword=> setPassword(userPassword)}
            />
            <FormButton
                title='Login'
                modeValue='contained' //button with a background color and elevation shadow
                labelStyle={styles.loginButtonLabel}
                onPress={() => login(email, password)}
                disabled={email.length===0 || password.length===0}
            />
            <FormButton
                title='New User? Join here'
                modeValue='text' //flat button without background or outline 
                uppercase={false} //By default, this prop of react native paper is true, therefore we have to make it false
                labelStyle={styles.navButtontext}
                onPress={() => navigation.navigate('Signup')}
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
    loginButtonLabel:{
        fontSize: 22
    },
    navButtontext:{
        fontSize: 16
    }
});