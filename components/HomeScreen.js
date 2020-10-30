/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {View} from 'react-native';
import { Component } from 'react';
import firebase from 'firebase';

export default class HomeScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            </View >
        );
    }

    resetTableData() {
        firebase.database().ref('/current').remove();
    }
}
