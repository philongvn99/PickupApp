/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable jsx-quotes */

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    SafeAreaView,
    Button
} from 'react-native';
import Barcode from 'react-native-barcode-builder';
import firebase from 'firebase';

export default class BarCodeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barcodevalue: undefined,
            inputbarcode: undefined,
        };
        this.databaseRef = firebase.database().ref('FilongCode');
        }


  onBarCodeRead = () => {
    if (this.state.inputbarcode){    
        this.setState({barcodevalue: this.state.inputbarcode}); 
        this.databaseRef.update({barCodeGenerated: this.state.inputbarcode});
    }
  }

  onBarCodeInput = (e) => {
    this.setState({inputbarcode: e});
  }
  
  render() {
    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="Your Barcode"
                style={styles.input}
                onChangeText={this.onBarCodeInput}
                value={this.inputbarcode}
            />
            <Barcode
                value={this.state.barcodevalue ? this.state.barcodevalue : '0'}
                format='CODE128'
                width={4}
                height={200}
                flat
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
            <View  style={styles.bottom}>
                <Text style={styles.bottomtext}>Barcode Generator</Text>
            </View>
        </SafeAreaView>
        
        );
    }
}

const styles = StyleSheet.create(
    {
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F29580',
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
        fontSize: 44,
    },

    buttonstyle: {
        backgroundColor:'darkcyan',
    },
    });
