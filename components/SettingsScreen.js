import * as React from 'react';
import { Text, View } from 'react-native';
import { Component } from 'react';
import SquareGridExample from './SquareGridExample';

export default class SettingsScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <SquareGridExample />
            </View>
        );
    }
}