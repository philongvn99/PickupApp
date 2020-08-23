import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { Component } from 'react';
import firebase from 'firebase';

export default class PickupScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                
            </View >
        );
    }

    resetTableData() {
        firebase.database().ref('/current').remove()
    }
}