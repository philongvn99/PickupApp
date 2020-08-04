import * as React from 'react';
import { Text, View } from 'react-native';
import { Component } from 'react';
import CommonFloor from './CommonFloor';

export default class Floor1Screen extends Component {    
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CommonFloor floor={0}/>
            </View>
        );
    }
}