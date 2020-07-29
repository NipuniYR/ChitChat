import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import auth from '@react-native-firebase/auth';
import { AuthContext } from './AuthProvider';
import Loading from '../components/Loading';


export default function Routes(){
    const {user, setUser} = useContext(AuthContext); //Accepts a context object and returns the current context value (Provider's value prop) for that context
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
        setLoading(false);
    }


    //useEffect - Accepts a function that contains imperative, possibly effectful code
    //The function passed to useEffect will run after the render is committed to the screen
    //By default, effects run after every completed render, but you can choose to fire them only when certain values have changed
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount (resources that needs to be cleaned up before leaving the screen must be unsubscribed)
    }, []);
    //Second argument of useEffect - The default behavior for effects is to fire the effect after every completed render. That way an effect is always recreated if one of its dependencies changes
    //If we don't wanna create a subscription unless some props have changed, just pass those props as the second argument so that a subcription will be recreated only if those props changed

    if(loading){
        return <Loading/>;
    }

    return(
        <NavigationContainer>
            {user ? <HomeStack/> : <AuthStack/>}
        </NavigationContainer>
    );
}