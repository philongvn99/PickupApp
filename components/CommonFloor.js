/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    TextInput,
    Dimensions,
} from "react-native";
import Modal from 'react-native-modal';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import moment from 'moment';
import ImageMapper from 'react-native-image-mapper';

export default class CommonFloor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            selectedTableNo: '',
            modalTableNo: '',
            tables: [],
            isShowMessage: false,
            message: '',
            visible: false,
            snapshot: null,
        };
    }

    TABLE_STATUS = {
        'AVAILABLE': 0,
        'CHECKED_IN': 1,
        'PICKED_UP': 2,
        "SERVED": 3,
    }

    a = 1;

    APP_SCREEN_HEIGHT = Dimensions.get('window').height
    APP_SCREEN_WIDTH = Dimensions.get('window').width

    componentDidMount() {
        this.setState({
            visible: true,
        });
        const database = firebase.database();
        const ref = database.ref('/config/tables');
        ref.child(this.props.floor).once('value', snapshot => {
            let tables = [];
            snapshot.forEach(t=>{
                let table = t.val();
                tables.push({
                    tableNo: '',
                    tableNoForDisplay: '',
                    status: this.TABLE_STATUS.AVAILABLE,
                    id: table.id,
                    radius: table.radius,
                    shape: table.shape,
                    fill: table.fill,
                    prefill: table.prefill,
                    x1: table.x1,
                    y1: table.y1,
                });
            });

            this.setState({ tables, visible: false }, () => {
                this.readCurrent();
            });
        });
        const refRFID = database.ref('/rfid-reader');
        refRFID.on('child_changed', snapshot => {
            const listVal = snapshot.val();
            if (listVal >= 0){
                database.ref('/table-card-info/' + listVal + '/index').once('value', indexServed =>{
                    console.log('state0 ', listVal);
                        this.setState({
                            selectedIndex: indexServed.val(),
                            selectedTableNo: listVal,
                            });
                        this.serve();
                        refRFID.update({'table-no':-1});
                    });
                }
            });
    }


    addCurrent(floor, tableIndex, tableNo) {
        const database = firebase.database();
        const rootRef = database.ref('/current');
        const pushedPostRef = rootRef.push({
            tableNo: Number(tableNo),
            isServed: false,
        });
        const newId = pushedPostRef.getKey();
        rootRef.child(newId + '/positions').push(
            {
                floor: floor,
                index: tableIndex,
                checkinTime: moment().format("HH:mm:ss"),
                checkoutTime: null,
                isCurrentPosition: true,
            }
        );

        const rootRefTable = database.ref('/table-card-info/' + tableNo);
        const pushedPostRefTable = rootRefTable.update({
              floor:floor,
              index:tableIndex,
              updateTime: moment().format("HH:mm:ss"),
        });

    }

    readCurrent() {
        const database = firebase.database();
        const rootRef = database.ref('/current');
        rootRef.on('value', snapshot => {
            this.setTable(snapshot);
        });
    }

    setTable(snapshot) {
        let {tables} = this.state;

        if (snapshot && typeof snapshot !== 'undefined') {
            tables.forEach(table => {
                snapshot.forEach(childSnapshot => {
                    let child = childSnapshot.val();
                    let keys = child.positions != null ? Object.keys(child.positions) : [];
                    keys.forEach(key => {
                        let position = child.positions[key];
                        if (position.isCurrentPosition) {
                            if (position.floor == this.props.floor && position.index == table.id) {
                                table.tableNo = child.tableNo;
                                if (child.isServed) {
                                    table.prefill = 'green';
                                    table.status = this.TABLE_STATUS.SERVED;
                                    table.tableNoForDisplay = '';
                                }
                                else if (child.isPickedUp) {
                                    table.prefill = 'orange';
                                    table.status = this.TABLE_STATUS.PICKED_UP;
                                    table.tableNoForDisplay = table.tableNo;
                                }
                                else {
                                    table.prefill = 'red';
                                    table.status = this.TABLE_STATUS.CHECKED_IN;
                                    table.tableNoForDisplay = table.tableNo;
                                }
                            }
                        }
                        else {
                            if (position.floor == this.props.floor && position.index == table.id) {
                                table.tableNo = '';
                                table.tableNoForDisplay = '';
                                table.prefill = 'gray';
                                table.status = this.TABLE_STATUS.AVAILABLE;
                            }
                        }
                    });
                });
            });

            this.setState({tables});
        }
        // else {
        //     this.setState({tables: []})
        // }
    }

    mapperAreaClickHandler(item, idx, event) {
        this.showModal(item.status);
        this.setState({ selectedIndex: item.id, selectedStatus: item.status, selectedTableNo: item.tableNo });
    }

    render() {
        const database = firebase.database();
        const rootRef = database.ref('/current');
        let { visible, tables} = this.state;
        const styles = StyleSheet.create({lottie: { width: 100, height: 100 } });
        return (
            <View>
                <View>
                    <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} />
                </View>

                <View style={{ flex: 1, alignItems: 'center', padding: 0 }}>
                    <ImageMapper
                        imgHeight={1064}
                        imgWidth={600}
                        imgSource={this.props.floor == 'floor-1' ? require("../assets/images/floor-1.png") : (this.props.floor == 'floor-2' ? require("../assets/images/floor-2.png") : (this.props.floor == 'floor-3' ? require("../assets/images/floor-3.png") : require("../assets/images/floor-4.png")))}
                        imgMap={tables}
                        onPress={(item, idx, event) => this.mapperAreaClickHandler(item, idx, event)}
                        containerStyle={{ top: 0 }}
                    />
                </View>

                <View>
                    <Modal isVisible={this.state.isModalVisible}
                        onBackdropPress={() => this.setState({ isModalVisible: false, selectedIndex: -1, selectedStatus: -1, isShowMessage: false, modalTableNo: '' })}
                        onShow={() => {
                                this.state.selectedStatus == this.TABLE_STATUS.AVAILABLE && this.modalTableNo.focus();
                            }
                        }
                    >
                        <View style={{ flex: 1,
                            alignItems: 'center',
                            maxHeight: 200,
                            justifyContent: 'center',
                            backgroundColor: '#FFF',
                            }}>

                            {this.state.selectedStatus == this.TABLE_STATUS.AVAILABLE && <View style={{display: 'flex', flexDirection: 'row', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
                                <TextInput
                                    onSubmitEditing={() => this.checkin()}
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

                                <Button style={{flex: 1}}
                                    onPress={() => {
                                        this.checkin();
                                    }} title="Check in" />
                            </View>
                            }
                            {this.state.isShowMessage && <View><Text style={{ color: 'red', fontSize: 20, margin: 20 }}>{this.state.message}</Text></View>}

                            {(this.state.selectedStatus == this.TABLE_STATUS.CHECKED_IN || this.state.selectedStatus == this.TABLE_STATUS.SERVED ) && <View>
                            <Text style={{marginVertical: 10, fontSize: 20}}>Thẻ bàn đang chọn: {this.state.selectedTableNo}</Text>
                                <Button
                                    onPress={() => {
                                        this.checkout();
                                    }} title="Check out" />
                                </View>
                            }

                            {(this.state.selectedStatus == this.TABLE_STATUS.PICKED_UP) && <View>
                                <Text style={{ marginVertical: 10, fontSize: 20 }}>Thẻ bàn đang chọn: {this.state.selectedTableNo}</Text>
                                <View style={{marginBottom: 20}}>
                                    <Button
                                        onPress={() => {
                                            this.serve();
                                        }} title="Phục vụ nước" />
                                </View>
                                <View>
                                    <Button
                                        onPress={() => {
                                            this.checkout();
                                        }} title="Check out" />
                                </View>
                            </View>
                            }
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }

    async serve() {
        let { selectedIndex, selectedTableNo } = this.state;
        const database = firebase.database();
        const rootRef = database.ref('/current');
        await rootRef.orderByChild("tableNo").equalTo(selectedTableNo).once("value", snapshot => {
            snapshot.forEach(childSnapshot => {
                let child = childSnapshot.val();
                if (!child.isServed) {
                    let keys = child.positions != null ? Object.keys(child.positions) : [];
                    keys.forEach(key => {
                        let position = child.positions[key];
 //                       if (position.isCurrentPosition) {
                            database.ref('/current/' + childSnapshot.key).update({
                                isServed: true,
                                servedTime: moment().format("HH:mm:ss"),
                            });
  //                      }
                    });
                }
            });
        });

        this.setState({
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            selectedTableNo: '',
            modalTableNo: '',
        });
    }

    onChangeText(text) {
        this.setState({
            modalTableNo: text,
        });
    }

    showModal = (status) => {
        this.setState({
            isModalVisible: true,
        });
    }

    async checkDuplicatedTableNo() {
        let { modalTableNo } = this.state;
        const database = firebase.database();
        const rootRef = database.ref('/current');
        let result = -1;

        await rootRef.orderByChild("tableNo").equalTo(modalTableNo).once("value", function (snapshot) {
            snapshot.forEach(childSnapshot => {
                let child = childSnapshot.val();
                if (!child.isServed) {
                    let keys = child.positions != null ? Object.keys(child.positions) : [];

                    keys.forEach(key => {
                        let position = child.positions[key];
                        if (position.isCurrentPosition) {
                            result = position.floor.replace('floor-', '');
                        }
                    });
                }
            });
        });

        return result;
    }

    async checkin() {
        let {tables, selectedIndex, modalTableNo} = this.state;
        let found = await this.checkDuplicatedTableNo();
        if (found <= 0) {
            this.setState({
                isModalVisible: false,
                selectedIndex: -1,
                selectedStatus: -1,
                modalTableNo: '',
                isShowMessage: false,
            });
            this.addCurrent(this.props.floor, selectedIndex, modalTableNo);
        }
        else {
            this.setState({
                isShowMessage: true,
                message: 'Thẻ bàn đang sử dụng ở tầng ' + found,
            });
        }
    }

    async checkout() {
        let { selectedIndex, selectedTableNo } = this.state;
        let floor = this.props.floor;
        const database = firebase.database();
        const rootRef = database.ref('/current');
        await rootRef.orderByChild("tableNo").equalTo(selectedTableNo).once("value", snapshot => {
            snapshot.forEach(childSnapshot => {
                let child = childSnapshot.val();
                let keys = child.positions != null ? Object.keys(child.positions) : [];
                keys.forEach(key => {
                    let position = child.positions[key];
                    if (position && position.floor && position.floor == floor && position.index == selectedIndex && position.isCurrentPosition) {
                        database.ref('/current/' + childSnapshot.key + '/positions/' + key).update({
                            isCurrentPosition: false,
                            checkoutTime: moment().format("HH:mm:ss"),
                        });
                    }
                });
            });
        });

        this.setState({
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            selectedTableNo: '',
            modalTableNo: '',
        });
    }

//    async changeState() {
//        const database = firebase.database();
//        const rootRef = database.ref('/rfid-reader');
//        console.log(1);
//        rootRef.on('value', snapshot => {
//                        listVal = snapshot.val();
//                        console.log('state0 ', listVal.state[0]);
//                        console.log('state1 ', listVal.state[1]);
//                        console.log('time0 ', listVal.time[0]);
//                        console.log('time1 ', listVal.time[1]);
//                    });
}
