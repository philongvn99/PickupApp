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
                    }} title="Reset bàn hàng ngày" />
            </View >
        );
    }

    resetTableData() {
        firebase.database().ref('/current').remove()
    }
}