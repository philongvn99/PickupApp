/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-mount-set-state */
import * as React from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {Component} from 'react';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Modal from 'react-native-modal';
import moment from 'moment';

export default class SGPickUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isModalAddOrderVisible: false,
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      modalTableNo: '',
      isShowMessage: false,
      message: '',
      visible: false,
      snapshot: null,
      floorItems: [],
    };
  }

  componentDidMount() {
    let {floorItems} = this.state;

    this.setState({
      visible: true,
    });
    const database = firebase.database();
    const ref = database.ref('/bigstore-sg-current-orders');

    ref.on('value', (snapshot) => {
      floorItems = [];
      snapshot.forEach((childSnapshot) => {
          let child = childSnapshot.val();          
          floorItems.push({
            tableNo: child.tableNo,
          })
        }
    )    
    this.setState({ floorItems, visible: false });    
  })
    
}

  TABLE_STATUS = {
    'AVAILABLE': 0,
    'CHECKED_IN': 1,
    'PICKED_UP': 2,
    "SERVED": 3,
  }

  render() {
    let {visible, selectedTableNo} = this.state;

    return (
      <View style={{flex: 1}}>
        <View>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            animationStyle={this.styles.lottie}
            speed={1}
          />
        </View>

        {/* <Button style={{ flex: 1, margin: 10, padding: 20, fontSize: 20 }}
          onPress={() => {
            this.showModalAddOrderVisible(true)
          }} title="Thêm Order" /> */}
          <TouchableOpacity style={{ flex: 1, margin: 10}}
            onPress={() => {
              this.showModalAddOrderVisible(true)
            }}>
          <View
            style={[
              { borderRadius: 5 },
              { flex: 1 },
              { backgroundColor: 'gray' },
              { alignItems: 'center' },
              { justifyContent: 'center' },
            ]}>
            <Text style={{fontSize: 20, color: '#FFF'}}>Thêm Order</Text>
            </View>
            
          </TouchableOpacity>

        <View style={{flex: 9}}>
            {this.renderFloor('topLeft')}
        </View>

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() =>
            this.setState({
              isModalVisible: false,
              selectedIndex: -1,
              selectedFloor: -1,
            })
          }>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              maxHeight: 200,
              justifyContent: 'center',
              backgroundColor: '#FFF',
            }}>
            <View>
              <Text style={{marginVertical: 10, fontSize: 20}}>
                Thẻ bàn đang chọn: {selectedTableNo}
              </Text>
              <Button
                onPress={() => {
                  this.pickup();
                }}
                title="Pick up"
              />
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalAddOrderVisible}
          onBackdropPress={() => this.setState({ isModalAddOrderVisible: false, selectedIndex: -1, selectedStatus: -1, isShowMessage: false, modalTableNo: '' })}
          onShow={() => {
            this.modalTableNo.focus();
          }
          }
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            maxHeight: 200,
            justifyContent: 'center',
            backgroundColor: '#FFF',
          }}>

            {<View style={{ display: 'flex', flexDirection: 'row', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                onSubmitEditing={() => this.saveNewOrder()}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  borderColor: 'gray',
                  borderWidth: 1,
                  fontSize: 20,
                }}
                ref={(input) => { this.modalTableNo = input; }}
                placeholder="Nhập thẻ bàn"
                onChangeText={value => this.onChangeText(value)}
                value={this.state.modalTableNo}
              />

              <Button style={{ flex: 1 }}
                onPress={() => {
                  this.saveNewOrder();
                }} title="Tạo Order" />
            </View>
            }

            {this.state.isShowMessage && <View><Text style={{ color: 'red', fontSize: 20, margin: 20 }}>{this.state.message}</Text></View>}

          </View>
        </Modal>

      </View>
    );
  }

  onChangeText(text) {
    this.setState({
      modalTableNo: text,
    });
  }

  async showModalAddOrderVisible(value) {
    this.setState({isModalAddOrderVisible: value})
  }

  async saveNewOrder() {
    let { modalTableNo } = this.state;

    const database = firebase.database();
    const rootRef = database.ref('/bigstore-sg-current-orders');
    let found = false;    

    await rootRef.orderByChild("tableNo").once("value", function (snapshot) {
      console.log(snapshot.val())
      snapshot.forEach(childSnapshot => {
        let child = childSnapshot.val();
        if (child.tableNo==modalTableNo && child.isServed==false) {
          found = true
        }        
        
      });
    });

    if (!found) {
      this.setState({
        isModalVisible: false,
        selectedIndex: -1,
        selectedStatus: -1,
        modalTableNo: '',
        isShowMessage: false,
      });
      this.addNewOrder(modalTableNo);
      this.showModalAddOrderVisible(false)
    }
    else {
      this.setState({
        isShowMessage: true,
        message: 'Thẻ bàn đang sử dụng'
      });
    }
  }

  addNewOrder(tableNo) {
    const database = firebase.database();
    const rootRef = database.ref('/bigstore-sg-current-orders');
    rootRef.push({
      tableNo: Number(tableNo),
      isServed: false,
    });
  }

  async pickup() {
    let { selectedTableNo} = this.state;
    let floor = 'StoreSG'
    console.log(selectedTableNo);
     const database = firebase.database();
    const rootRef = database.ref('/bigstore-sg-current');
    await rootRef
      .orderByChild('tableNo')
      .equalTo(selectedTableNo)
      .once('value', function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          let child = childSnapshot.val();
          console.log(childSnapshot.key);
          let keys =
            child.positions != null ? Object.keys(child.positions) : [];
          keys.forEach((key) => {
            let position = child.positions[key];
            if (
              position.floor == floor &&
              position.isCurrentPosition
            ) {
              database.ref('/bigstore-sg-current/' + childSnapshot.key).update({
                //isServed: true,
                isPickedUp: true,
                pickedUpTime: moment().format("DD-MMM-YYYY HH:mm:ss"),
              });
            }
          });
        });
      });

    const rootOrderRef = database.ref('/bigstore-sg-current-orders');
    await rootOrderRef
      .orderByChild('tableNo')
      .equalTo(selectedTableNo)
      .once('value', function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          database.ref('/bigstore-sg-current-orders/' + childSnapshot.key).remove()
      })
    })

    this.setState({
      isModalVisible: false,
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      modalTableNo: '',
    });
  }

  renderFloor(pos) {
    return (
      <View
        style={[
          {flex: 1},
          pos == 'topLeft'
            ? this.styles.topLeftCell
            : pos == 'topRight'
            ? this.styles.topRightCell
            : pos == 'bottomLeft'
            ? this.styles.bottomLeftCell
            : pos == 'bottomRight'
            ? this.styles.bottomRightCell
            : '',
        ]}>
        <View style={{flex: 8.5, flexDirection: 'row', flexWrap: 'wrap'}}>
          {this.renderFloorItems()}
        </View>
      </View>
    );
  }

  renderFloorItems() {    
    let {floorItems} = this.state;    
    return floorItems.map((item) => {
      return (
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            padding: 10,
          }}
          onPress={() => {
            this.showModal();
            this.setState({
              selectedTableNo: item.tableNo,
            });
          }}>
          <View
            style={[
              {borderRadius: 60},
              {flex: 1},
              {backgroundColor: 'blue', color: '#000'},
              {alignItems: 'center'},
              {justifyContent: 'center'},
            ]}>
            <Text style={{textAlign: 'center', color: '#fff', fontSize: 23}}>
              {item.tableNo}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  showModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  borderColor = '#ccc';

  styles = StyleSheet.create({
    lottie: {width: 100, height: 100},
    topLeftCell: {
      marginTop: 10,
      marginLeft: 10,
      borderColor: this.borderColor,
      borderTopWidth: 1,
      borderLeftWidth: 1,
    },
    topRightCell: {
      marginTop: 10,
      marginRight: 10,
      borderColor: this.borderColor,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
    },
    bottomLeftCell: {
      marginLeft: 10,
      marginBottom: 10,
      borderColor: this.borderColor,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
    },
    bottomRightCell: {
      marginRight: 10,
      marginBottom: 10,
      borderColor: this.borderColor,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
    },
    sectionHeader: {
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
