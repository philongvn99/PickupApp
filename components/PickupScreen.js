import * as React from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {Component} from 'react';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Modal from 'react-native-modal';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class PickupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalAddOrderVisible: false,
      isModalProduceVisible: false,
      isModalPickupVisible: false,
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      selectedTableIsProduced: '',
      selectedTableProducedTime: '',
      selectedOrderCreatedTime: '',
      modalTableNo: '',
      isShowMessage: false,
      message: '',
      visible: false,
      snapshot: null,
      checkedInItems: {
        'floor-1': [],
        'floor-2': [],
        'floor-3': [],
        'floor-4': [],
      },
      waitingItems: [],
      producedItems: [],
    };
  }

  componentDidMount() {
    let { waitingItems, producedItems, checkedInItems} = this.state;

    this.setState({
      visible: true,
    });
    const database = firebase.database();
    const ref = database.ref('/current-orders');

    ref.on('value', (snapshot) => {
      waitingItems = []
      producedItems = []      
      checkedInItems = {
        'floor-1': [],
        'floor-2': [],
        'floor-3': [],
        'floor-4': [],
      };
      // snapshot.forEach((childSnapshot) => {
      //   let child = childSnapshot.val();
      //   let keys = child.positions != null ? Object.keys(child.positions) : [];

      //   if (!child.isServed && !child.isPickedUp) {
      //     keys.forEach((key) => {
      //       let position = child.positions[key];
      //       if (position.isCurrentPosition) {
      //         floorItems[position.floor].push({
      //           index: position.index,
      //           tableNo: child.tableNo,
      //         });
      //       }
      //     });
      //   }
      // });

      snapshot.forEach((childSnapshot) => {
        let child = childSnapshot.val();

        if (child.isCheckedIn) {
          checkedInItems[child.checkinFloor].push({
            tableNo: child.tableNo,
            isProduced: child.isProduced,
            producedTime: child.producedTime,
            orderCreatedTime: child.orderCreatedTime,
            tableIndex: child.tableIndex
          })
        }
        else {
          if (!child.isProduced)
            waitingItems.push({
              tableNo: child.tableNo,
              isProduced: child.isProduced,
              producedTime: child.producedTime,
              orderCreatedTime: child.orderCreatedTime
            })
          else {
            producedItems.push({
              tableNo: child.tableNo,
              isProduced: child.isProduced,
              producedTime: child.producedTime,
              orderCreatedTime: child.orderCreatedTime
            })
          }
        }
      })

      this.setState({ waitingItems, checkedInItems, producedItems, visible: false});
    });
  }

  TABLE_STATUS = {
    'AVAILABLE': 0,
    'CHECKED_IN': 1,
    'PICKED_UP': 2,
    "SERVED": 3,
  }

  render() {
    let { visible, selectedTableNo, selectedTableIsProduced } = this.state;

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

        <View style={{ flex: 1, backgroundColor: '#6d2b18', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color:'#FFF' }}>CHỜ RA NƯỚC</Text>
        </View>
        <View style={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
          {this.renderWaitingItems()}
        </View>

        <View style={{ flex: 1, backgroundColor: '#6d2b18', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color:'#FFF' }}>ĐÃ RA NƯỚC</Text>
        </View>
        <View style={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
          {this.renderProducedItems()}
        </View>

        <View style={{ flex: 1, backgroundColor: '#6d2b18', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color:'#FFF' }}>CHỜ PICKUP (KHÁCH ĐÃ CHECKIN)</Text>
        </View>

        <View style={{flex: 4}}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            {this.renderFloor(0, 'topLeft')}
            {this.renderFloor(1, 'topRight')}
          </View>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            {this.renderFloor(2, 'bottomLeft')}
            {this.renderFloor(3, 'bottomRight')}
          </View>
        </View>

        <TouchableOpacity style={{ flex: 1, margin: 10 }}
          onPress={() => {
            this.showModalAddOrderVisible(true)
          }}>
          <View
            style={[
              { borderRadius: 2 },
              { flex: 1 },
              { backgroundColor: '#e0af51' },
              { alignItems: 'center' },
              { justifyContent: 'center' },
            ]}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="plus" size={40} />
              <Text style={{ fontSize: 20 }}>NHẬP ORDER</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* <Modal
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
        </Modal> */}

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
                }} title="Nhập" />
            </View>
            }

            {this.state.isShowMessage && <View><Text style={{ color: 'red', fontSize: 20, margin: 20 }}>{this.state.message}</Text></View>}

          </View>
        </Modal>

        <Modal
          isVisible={this.state.isModalProduceVisible}
          onBackdropPress={() =>
            this.setState({
              isModalProduceVisible: false,
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
              <Text style={{ marginVertical: 10, fontSize: 20 }}>
                Thẻ bàn đang chọn: {selectedTableNo}
              </Text>
              <Button
                onPress={() => {
                  this.produce();
                }}
                title="Ra nước"
              />
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isModalPickupVisible}
          onBackdropPress={() =>
            this.setState({
              isModalPickupVisible: false,
              selectedIndex: -1,
              selectedFloor: -1,
              selectedTableIsProduced: '',
              selectedTableProducedTime: '',
              selectedOrderCreatedTime: '',
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
              <Text style={{ marginVertical: 10, fontSize: 20 }}>
                Thẻ bàn đang chọn: {selectedTableNo}
              </Text>
              <Button
                onPress={() => {
                  this.pickup();
                }}
                title={selectedTableIsProduced == true ? "Pick up" : "Ra nước và pick up"}
              />
            </View>
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

  renderWaitingItems() {
    let { waitingItems } = this.state;
    return waitingItems.map((item) => {
      return (
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            padding: 10,
          }}
          onPress={() => {
            this.showProduceModal();
            this.setState({
              selectedTableNo: item.tableNo,
            });
          }}>
          <View
            style={[
              { borderRadius: 60 },
              { flex: 1 },
              { backgroundColor: 'blue', color: '#000' },
              { alignItems: 'center' },
              { justifyContent: 'center' },
            ]}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 23 }}>
              {item.tableNo}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  renderProducedItems() {
    let { producedItems } = this.state;
    return producedItems.map((item) => {
      return (
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            padding: 10,
          }}>
          <View
            style={[
              { borderRadius: 60 },
              { flex: 1 },
              { backgroundColor: 'pink', color: '#000' },
              { alignItems: 'center' },
              { justifyContent: 'center' },
            ]}>
            <Text style={{ textAlign: 'center', color: '#000', fontSize: 23 }}>
              {item.tableNo}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  showModalAddOrderVisible(value) {
    this.setState({ isModalAddOrderVisible: value })
  }

  showProduceModal = () => {
    this.setState({
      isModalProduceVisible: true,
    });
  };

  showPickupModal = () => {
    this.setState({
      isModalPickupVisible: true,
    });
  };

  async saveNewOrder() {
    let { modalTableNo } = this.state;

    const database = firebase.database();
    const rootRef = database.ref('/current-orders');
    let found = false;

    await rootRef.orderByChild("tableNo").once("value", function (snapshot) {
      snapshot.forEach(childSnapshot => {
        let child = childSnapshot.val();
        if (child.tableNo == modalTableNo && child.isServed == false) {
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
    const rootRef = database.ref('/current-orders');
    rootRef.push({
      tableNo: Number(tableNo),
      orderCreatedTime: moment().format("DD-MMM-YYYY HH:mm:ss"),
      isProduced: false,
      isCheckedIn: false
    });
  }

  async produce() {
    let { selectedTableNo, waitingItems, producedItems } = this.state;
    const database = firebase.database();
    const rootRef = database.ref('/current-orders');
    await rootRef
      .orderByChild('tableNo')
      .equalTo(parseInt(selectedTableNo))
      .once('value', function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          let child = childSnapshot.val();
          // if(child.tableNo==selectedTableNo) {
          database.ref('/current-orders/' + childSnapshot.key).update({
            isProduced: true,
            producedTime: moment().format("DD-MMM-YYYY HH:mm:ss"),
          });
          //}                          
        });
      });

    for (var i = 0; i < waitingItems.length; i++) {
      if (waitingItems[i].tableNo == selectedTableNo) {
        waitingItems.splice(i, 1);
        producedItems.push({
          tableNo: selectedTableNo
        })
      }
    }

    this.setState({
      isModalProduceVisible: false,
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      modalTableNo: '',
      waitingItems
    });
  }

  async pickup() {
    let { selectedIndex, selectedTableNo, selectedTableProducedTime, selectedOrderCreatedTime, selectedFloor } = this.state;
    let floor = 'floor-' + selectedFloor;
    const database = firebase.database();
    const rootRef = database.ref('/current');
    await rootRef
      .orderByChild('tableNo')
      .equalTo(parseInt(selectedTableNo))
      .once('value', function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          let child = childSnapshot.val();
          let keys =
            child.positions != null ? Object.keys(child.positions) : [];
          keys.forEach((key) => {
            let position = child.positions[key];
            if (
              position.floor == floor &&
              position.index == selectedIndex &&
              position.isCurrentPosition
            ) {
              database.ref('/current/' + childSnapshot.key).update({
                isPickedUp: true,
                pickedUpTime: moment().format('DD-MMM-YYYY HH:mm:ss'),
                isProduced: true,
                producedTime: (selectedTableProducedTime == null || selectedTableProducedTime == '') ? moment().format("DD-MMM-YYYY HH:mm:ss") : selectedTableProducedTime,
                orderCreatedTime: selectedOrderCreatedTime
              });
            }
          });
        });
      });

    const rootOrderRef = database.ref('/current-orders');
    await rootOrderRef
      .orderByChild('tableNo')
      .equalTo(parseInt(selectedTableNo))
      .once('value', function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          database.ref('/current-orders/' + childSnapshot.key).remove()
        })
      })

    this.setState({
      isModalPickupVisible: false,
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      modalTableNo: '',
      selectedTableIsProduced: '',
      selectedTableProducedTime: '',
      selectedOrderCreatedTime: ''
    });
  }

  renderFloor(floor, pos) {
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
        <View
          style={[
            { flex: 1.5, backgroundColor: 'aqua'},
            this.styles.sectionHeader,
          ]}>
          <Text>Tầng {parseInt(floor + 1)}</Text>
        </View>
        <View style={{flex: 8.5, flexDirection: 'row', flexWrap: 'wrap'}}>
          {this.renderFloorCheckedInItems(parseInt(floor + 1))}
        </View>
      </View>
    );
  }

  renderFloorCheckedInItems(floor) {
    let {checkedInItems} = this.state;
    let currentCheckedInItems = checkedInItems['floor-' + floor];
    return currentCheckedInItems.map((item) => {
      return (
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            padding: 10,
          }}
          onPress={() => {
            this.showPickupModal();
            this.setState({
              selectedIndex: item.tableIndex,
              selectedTableNo: item.tableNo,
              selectedFloor: floor,
              selectedTableIsProduced: item.isProduced,
              selectedTableProducedTime: item.producedTime,
              selectedOrderCreatedTime: item.orderCreatedTime
            });
          }}>
          <View
            style={[
              item.isProduced == false ? { backgroundColor: 'blue' } : { backgroundColor: 'orange' },
              {borderRadius: 60},
              {flex: 1},
              {color: '#000'},
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
