import * as React from 'react';
import { Text, View, ImageBackground, StyleSheet, Dimensions   } from 'react-native';
import { Component } from 'react';
import CommonFloor from './CommonFloor';

const APP_SCREEN_HEIGHT = Dimensions.get('window').height
export default class Floor4Screen extends Component {
    render() {
        return (
            <CommonFloor floor={'floor-4'} />
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    text: {
        color: "red",
        fontSize: 30,
        fontWeight: "bold"
    }
});