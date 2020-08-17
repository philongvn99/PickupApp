import * as React from 'react';
import { Text, View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Component } from 'react';
import CommonFloor from './CommonFloor';

const APP_SCREEN_HEIGHT = Dimensions.get('window').height
export default class Floor1Screen extends Component {    
    render() {
        return (
            <View style={styles.wrapper}>                
                <ImageBackground source={require("../assets/images/tang1.png")} imageStyle=
                    {{ opacity: 0.3 }} style={styles.image}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <CommonFloor floor={0} />
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    image: {
        flex: 1,
        height: APP_SCREEN_HEIGHT
    },
    text: {
        color: "red",
        fontSize: 30,
        fontWeight: "bold"
    }
});
