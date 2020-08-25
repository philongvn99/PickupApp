import React, { Component, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    TextInput 
} from "react-native";
import SquareGrid from "react-native-square-grid";
import Modal from 'react-native-modal';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import moment from 'moment';

export default class CommonFloor extends Component {
    constructor(props) {
        super(props)
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
        }
    }

    TABLE_STATUS = {
        'SERVED': 3,
        'CHECKED_IN': 2,        
        'AVAILABLE': 1,
        'INACTIVE': 0
    }

    componentDidMount() {
        this.setState({
            visible: true
        })  
        const database = firebase.database();
        const ref = database.ref('/config/tables');
        ref.child(this.props.floor).once('value', snapshot => {
            let tables = []   
            let defaultTables = snapshot.val()
            for (let i = 0; i < defaultTables.length; i++) {
                tables.push({
                    tableNo: '',
                    status: defaultTables[i]
                })                              
            }                                 
            this.setState({ tables, visible: false }, () => {
                this.readCurrent()
            })  
        })                  
    }

    addCurrent(floor, tableIndex, tableNo) {
        const database = firebase.database()
        const rootRef = database.ref('/current')
        rootRef.push({
            tableNo,
            isServed: false,
            positions: [
                {
                    floor: floor,
                    index: tableIndex,
                    checkinTime: moment().format("HH:mm:ss"),
                    checkoutTime: null,
                    isCurrentPosition: true
                }
            ],
        })
    }

    readCurrent() {
        const database = firebase.database();
        const rootRef = database.ref('/current');
        rootRef.on('value', snapshot => {            
            this.setTable(snapshot)
        })
    }

    setTable(snapshot) {             
        let {tables} = this.state        
        if (snapshot && typeof snapshot !=='undefined') {
            tables.forEach((table, index) => {
                if(table.status!=this.TABLE_STATUS.INACTIVE) {
                    snapshot.forEach(childSnapshot => {
                        let child = childSnapshot.val()
                        child.positions.forEach(position=>{
                            if(position.isCurrentPosition) {
                                if (position.floor== this.props.floor && position.index == index) {
                                    table.tableNo = child.tableNo
                                    table.status = child.isServed==true ? this.TABLE_STATUS.SERVED : this.TABLE_STATUS.CHECKED_IN
                                }
                            }
                            else {
                                if (position.floor == this.props.floor && position.index == index) {
                                    table.tableNo = ''
                                    table.status = this.TABLE_STATUS.AVAILABLE
                                }
                            }
                        })                        
                    })                          
                }                
            })
            this.setState({tables})
        }
    }    

    render() {
        let { visible, tables} = this.state
        const styles = StyleSheet.create({lottie: { width: 100, height: 100, }, });

        return (
            <View>
                <View>
                    <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} />
                </View>

                <View>
                <SquareGrid rows={12} columns={12} items={tables} renderItem={this.renderItem} />

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
                            backgroundColor: '#FFF'
                            }}>
                                
                            {this.state.selectedStatus == this.TABLE_STATUS.AVAILABLE && <View style={{display: 'flex', flexDirection: 'row', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
                                <TextInput
                                    keyboardType='numeric'
                                    style={{
                                        flex: 1,
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        fontSize: 20
                                    }}
                                    ref={(input) => { this.modalTableNo = input; }}
                                    placeholder='Nhập thẻ bàn'
                                    onChangeText={value => this.onChangeText(value)}
                                    value={this.state.modalTableNo}
                                />
                            
                                <Button style={{flex: 1}}
                                    onPress={() => {
                                        this.checkin()
                                    }} title="Check in" />     
                            </View>         
                            }
                            {this.state.isShowMessage && <View><Text style={{ color: 'red', fontSize: 20, margin: 20 }}>{this.state.message}</Text></View>}

                            {(this.state.selectedStatus == this.TABLE_STATUS.CHECKED_IN || this.state.selectedStatus == this.TABLE_STATUS.SERVED) && <View>
                            <Text style={{marginVertical: 10, fontSize: 20}}>Thẻ bàn đang chọn: {this.state.selectedTableNo}</Text>
                                <Button
                                    onPress={() => {
                                        this.checkout()
                                    }} title="Check out" />     
                                    </View>
                                }                          
                        </View>                   
                    </Modal>
                </View>
            </View>
        );
    }

    onChangeText(text) {
        this.setState({
            modalTableNo: text
        })
    }

    showModal = (status) => {
        if(status!=this.TABLE_STATUS.INACTIVE) {
            this.setState({
                isModalVisible: true
            })
        }        
    }

    async checkDuplicatedTableNo() {
        let { modalTableNo } = this.state 
        const database = firebase.database();
        const rootRef = database.ref('/current');
        let result = -1
        await rootRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {                
                let child = childSnapshot.val()
                if(!child.isServed && child.tableNo==modalTableNo) {
                    child.positions.forEach(position => {
                        if(position.isCurrentPosition) {
                            result = position.floor
                        }
                    })
                }
            })
        })
        return result
    }

    async checkin() {
        let {tables, selectedIndex, modalTableNo} = this.state       
        let found = await this.checkDuplicatedTableNo()

        if (found<0) {
            tables[selectedIndex].tableNo = modalTableNo
            tables[selectedIndex].status = this.TABLE_STATUS.CHECKED_IN
            this.setState({
                isModalVisible: false,
                selectedIndex: -1,
                selectedStatus: -1,
                modalTableNo: ''
            })
            this.addCurrent(this.props.floor, selectedIndex, modalTableNo)
        }
        else {
            this.setState({
                isShowMessage: true,
                message: 'Thẻ bàn đang sử dụng ở tầng ' + parseInt(found+1)
            })
        }
    }

    async checkout() {
        let { selectedIndex, selectedTableNo } = this.state     
        const database = firebase.database();
        const rootRef = database.ref('/current');
        await rootRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                let child = childSnapshot.val()
                if (child.tableNo == selectedTableNo) {
                    child.positions.forEach((position, i) => {
                        if (position.floor==this.props.floor && position.index==selectedIndex && position.isCurrentPosition) {
                            database.ref('/current/' + childSnapshot.key + '/positions/' + i).update({
                                isCurrentPosition: false,
                                checkoutTime: moment().format("HH:mm:ss")
                            }) 
                        }
                    })
                }
            })
        })

        this.setState({
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            selectedTableNo: '',
            modalTableNo: ''
        })
    }

    renderItem = (item, index) => {
        return (
            <TouchableOpacity style={{
                flex: 1,
                alignSelf: "stretch",
                padding: 5
                }} onPress={() => {                    
                    this.showModal(item.status)
                    this.setState({selectedIndex: index, selectedStatus: item.status, selectedTableNo: item.tableNo})
                }}>
                <View style={[{borderRadius: 50},
                    {flex: 1},
                    item.status == this.TABLE_STATUS.CHECKED_IN ? { backgroundColor: 'blue' } : (item.status == this.TABLE_STATUS.AVAILABLE ? { backgroundColor: "#4C0013" } : (item.status == this.TABLE_STATUS.SERVED ? { backgroundColor: '#42692f'} : { display: "none" })),
                    {alignItems: "center"},
                    {justifyContent: "center"}
                ]}>                    
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold' }}>{item.tableNo}</Text>
                </View>                
            </TouchableOpacity>          
        );
    }
}