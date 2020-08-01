import * as React from 'react';
import { Text, View } from 'react-native';
import { Component } from 'react';

export default class HomeScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Home!</Text>
            </View >
        );
    }
}