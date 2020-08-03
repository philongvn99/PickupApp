import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { Component } from 'react';
import firebase from 'firebase';

export default class HomeScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    onPress={() => {
                        this.resetTableData()
                    }} title="Reset bàn" />
            </View >
        );
    }

    resetTableData() {
        const firebaseConfig = {
            apiKey: "AIzaSyBb1WeqLnVcVvPGAqNObH3SN8ZV6JOQWYY",
            authDomain: "eco-giong.firebaseapp.com",
            databaseURL: "https://eco-giong.firebaseio.com",
            projectId: "eco-giong",
            storageBucket: "eco-giong.appspot.com",
            messagingSenderId: "352848277484",
            appId: "1:352848277484:web:a663999123b9cf90291ac9"
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        const database = firebase.database();
        const rootRef = database.ref('tables');
        rootRef.set(null)
    }
}