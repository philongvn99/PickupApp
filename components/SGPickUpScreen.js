/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-mount-set-state */
import * as React from 'react';
import {Text, View, Button, TouchableOpacity, StyleSheet} from 'react-native';
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
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      modalTableNo: '',
      isShowMessage: false,
      message: '',
      visible: false,
      snapshot: null,
      floorItems: {
        'StoreSG': [],
      },
    };
  }

  componentDidMount() {
    let {floorItems} = this.state;

    this.setState({
      visible: true,
    });
    const database = firebase.database();
    const ref = database.ref('/bigstore-sg-current');
    const refRFID = database.ref('/rfid-reader');

    ref.on('value', (snapshot) => {
      floorItems = {
        'StoreSG': []
      };
      snapshot.forEach((childSnapshot) => {
        let child = childSnapshot.val();
        let keys = child.positions != null ? Object.keys(child.positions) : [];

        if (!child.isServed && !child.isPickedUp) {
          keys.forEach((key) => {
            let position = child.positions[key];
            if (position.isCurrentPosition) {
              floorItems[position.floor].push({
                index: position.index,
                tableNo: child.tableNo,
              });
            }
          });
        }
      });
      this.setState({floorItems, visible: false});
    });
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

        <View style={{flex: 1}}>
            {this.renderFloor(0, 'topLeft')}
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
      </View>
    );
  }

  async pickup() {
    let {selectedFloor, selectedIndex, selectedTableNo} = this.state;
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
              position.index == selectedIndex &&
              position.isCurrentPosition
            ) {
              database.ref('/bigstore-sg-current/' + childSnapshot.key).update({
                isServed: true,
                isPickedUp: true,
                pickedUpTime: moment().format('HH:mm:ss'),
              });
            }
          });
        });
      });

    this.setState({
      isModalVisible: false,
      selectedIndex: -1,
      selectedFloor: -1,
      selectedTableNo: '',
      modalTableNo: '',
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
            {flex: 1.5, backgroundColor: '#ddd'},
            this.styles.sectionHeader,
          ]}>
          <Text>Store Saigon</Text>
        </View>
        <View style={{flex: 8.5, flexDirection: 'row', flexWrap: 'wrap'}}>
          {this.renderFloorItems('0')}
        </View>
      </View>
    );
  }

  renderFloorItems(floor) {
    let {floorItems} = this.state;
    let currentFloorItems = floorItems['StoreSG'];
    return currentFloorItems.map((item) => {
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
              selectedIndex: item.index,
              selectedTableNo: item.tableNo,
              selectedFloor: floor,
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
