/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Button,
} from 'react-native';
import firebase from 'firebase';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import axios from 'axios';
//import PopUp from './PopUp';
import PopUp from './PopUp.js'
export default class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productCode: undefined,
      itemBarcode: 'HI',
      isDialogVisible: false,
    };
    this.databaseRef = firebase.database().ref('FilongCode');
  }

  sendInput = (e) => {alert(e);}
  showDialog = (isShow) => {
    this.setState({isDialogVisible: isShow});
  }

  onSuccess = (e) => {
    Linking.openURL(e.data).catch(() => {
      this.databaseRef.update({latestCode: e.data});
      console.log(e.data);
      axios.get('https://eco-giong.azurewebsites.net/api/stocktake/GetStockInfo?itemBarCode=' + e.data)
        .then( (response) => {
          console.log(response.data.data);
            this.setState({
              productCode: e.data,
              isDialogVisible: true,
              itemBarcode: response.data.data.itemBarCode,
            });
          })
        .catch((error) => {console.log(error); });
      });
    }

  postData = (inputQC, quantity) =>
    {
      let data = {
        itemBarcode: this.state.itemBarcode,
        warehouseId:  2,
        uomId: inputQC,
        quantity: parseInt(quantity)
      };
      console.log(data)
      axios.post('https://eco-giong.azurewebsites.net/api/stocktake', data)
      .then(function (response) {
         let returndata = response.data.data
         console.log(returndata);
         alert('MESSAGE: ' + returndata.message
          + '\nBarcode: ' + returndata.itemBarCode
          + '\nQuantity: '+ returndata.quantity
          + '\nwarehouseID: ' + returndata.warehouseId);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

  resetCode = () => {this.setState({productCode: undefined});}

    render() {
    return (
      <QRCodeScanner
        containerStyle={{backgroundColor: '#fff'}}
        onRead={this.onSuccess}
        //flashMode={RNCamera.Constants.FlashMode.torch}
        reactivate={true}
        permissionDialogMessage="Need Permission to Access Camera"
        reactivateTimeout={10}
        showMarker={true}
        markerStyle={{borderColor: '#FFF', borderRadius: 10}}
        topContent={
          <TouchableOpacity style={styles.buttonTouchable}>
              <PopUp
                isDialogVisible={this.state.isDialogVisible}
                title={this.state.itemBarcode}
                hintInput ={'Number Only'}
                submitInput={
                  (selection, inputText) => {this.postData(selection, inputText);}
                }
                closeDialog={() => {this.showDialog(false);}}/>
              <Button
                style={styles.buttonstyle}
                onPress={() => {
                      this.resetCode();
                  }
                }
                title="RESET"
                />
          </TouchableOpacity>}
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.codeDisplay}>
              {this.state.productCode}
            </Text>
            <Text style={styles.footerScanner}>CODE SCANNER</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  codeDisplay: {
    color: '#F54363',
    fontWeight: 'bold',
    backgroundColor: '#FFE5D8',
    marginVertical: 10,
    alignContent:'center',
    fontSize: 44,
  },
  footerScanner: {
    backgroundColor: '#FFE5D8',
    fontSize: 44,
    alignContent: 'space-around',
  }
});

AppRegistry.registerComponent('default', () => ScanScreen);
