/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable no-undef */
'use strict';
import {Button} from 'react-native';
import React, { Component } from 'react';
import QRCode from 'react-native-qrcode-generator';
import firebase from 'firebase';
import {
    AppRegistry,
    StyleSheet,
    View,
    TextInput,
    Text,
    SafeAreaView,
} from 'react-native';

export default  class QRgenerator extends Component {
  state = {
    QRString: undefined,
    QRCode: undefined,
  };

  databaseRef = firebase.database().ref('FilongCode');

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Your QR Code"
          style={styles.input}
          onChangeText={(text) => this.setState({QRString: text})}
          value={this.state.text}
        />
        <QRCode
          value={this.state.QRCode}
          size={300}
          bgColor='black'
          fgColor='white'
          />
        <View>
            <Button
                style={styles.buttonstyle}
                onPress={() => {
                    if (this.state.QRString) {
                      this.setState({QRCode: this.state.QRString});
                      this.databaseRef.update({qrCodeGenerated: this.state.QRString});
                    }
                  }
                }
                title='GENERATE'
                />
            </View>
        <View style={styles.bottom}>
          <Text style={styles.bottomtext}>QR Code Scanner</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F29580',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottom: {
      backgroundColor:'#FFE5D8',
      alignContent:'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
    },

    bottomtext: {
        fontSize:44,
    },

    input: {
        height: 80,
        borderColor: 'gray',
        borderWidth: 2,
        margin: 10,
        borderRadius: 5,
        padding: 5,
        backgroundColor:'#F2CEF2',
        fontSize:44,
    },

    buttonstyle: {
      height: 50,
      width: 200,
      borderColor: 'gray',
      borderWidth: 5,
      margin: 10,
      backgroundColor:'#F2CEF2',
  },
});

AppRegistry.registerComponent('HelloWorld', () => HelloWorld);

