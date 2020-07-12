import React, {useContext} from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function HomeScreen({navigation}){
    const { user, logout } = useContext(AuthContext);
 
    return(
        <View style={styles.container}>
            <Title>Home Screen</Title>
            <Title>Welcome {user.uid}</Title>
            <FormButton 
                modeValue='contained' 
                title='Logout'
                onPress={()=>logout()}
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
    } 
});