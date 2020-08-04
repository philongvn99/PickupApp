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

export default class CommonFloor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            modalTableNo: '',
            tables: [], 
            defaultTables: []
        }
    }

    STATUS = {
        'CHECKEDIN': 2,
        'AVAILABLE': 1,
        'INACTIVE': 0
    }

    componentDidMount() {
        let tables = []   
        const database = firebase.database();
        const ref = database.ref('/tables');
        ref.child(this.props.floor).once('value', snapshot => {
            let defaultTables = snapshot.val()
            for (let i = 0; i < defaultTables.length; i++) {
                tables.push({
                    tableNo: '',
                    status: defaultTables[i]
                })
            }

            this.setState({ tables, defaultTables }, () => {
                this.readTableData(this.props.floor)
            })    
        })
          
    }

    writeTableData(floor, tableIndex, tableNo, status) {
        const database = firebase.database();
        const rootRef = database.ref('/current/tables');
        rootRef.child(floor).child(tableIndex).set({
            tableNo,
            status
        })
    }

    readTableData(floor) {
        const database = firebase.database();
        const rootRef = database.ref('/current/tables');
        rootRef.child(floor).on('value', snapshot => {
            this.setState({
                data: snapshot.val()
            }, () => {
                this.renderTableData()
            })
        })
    }

    renderTableData() {                
        let {data, tables} = this.state
        if(data && typeof data !=='undefined') {
            tables.forEach((table, index) => {
                let t = data[index]
                if(t && typeof t !=='undefined') {
                    table.status = t.status,
                    table.tableNo = t.tableNo
                }
            })
            this.setState({tables})
        }
    }

    render() {
        return (
            <View>
                <SquareGrid rows={8} columns={6} items={this.state.tables} renderItem={this.renderItem} />

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ flex: 1,
                        alignItems: 'center',
                        maxHeight: 200,
                        justifyContent: 'center',
                        backgroundColor: '#FFF'
                        }}>
                            
                        {this.state.selectedStatus == this.STATUS.AVAILABLE && <View>
                            <TextInput
                                keyboardType='numeric'
                                style={{
                                    height: 40,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    width: 100,
                                    marginBottom: 20,
                                }}
                                placeholder='Nhập thẻ bàn'
                                onChangeText={value => this.onChangeText(value)}
                                value={this.state.modalTableNo}
                            />
                        
                            <Button
                                onPress={() => {
                                    this.checkin()
                                }} title="Check in" />     
                        </View>         
                        }

                        {this.state.selectedStatus==this.STATUS.CHECKEDIN && 
                            <Button
                                onPress={() => {
                                    this.checkout()
                                }} title="Check out" />     
                            }  
                            
                    </View>
                </Modal>
            </View>
        );
    }

    onChangeText(text) {
        this.setState({
            modalTableNo: text
        })
    }

    showModal = (status) => {
        if(status!=this.STATUS.INACTIVE) {
            this.setState({
                isModalVisible: true
            })
        }        
    }

    checkin() {
        let {tables, selectedIndex, modalTableNo} = this.state       
        const database = firebase.database();
        const rootRef = database.ref('/current/tables/' + this.props.floor);
        let found = false
        rootRef.child(selectedIndex).once('value', snapshot => {
            var dbTableNo = snapshot.val()==null ? 0 : snapshot.val().tableNo
            console.log(this.props.floor)
            if (dbTableNo == modalTableNo) {
                found = true
            }

            if (!found) {
                tables[selectedIndex].tableNo = modalTableNo
                tables[selectedIndex].status = this.STATUS.ACTIVE
                this.setState({
                    isModalVisible: false,
                    selectedIndex: -1,
                    selectedStatus: -1,
                    modalTableNo: ''
                })
                this.writeTableData(this.props.floor, selectedIndex, modalTableNo, this.STATUS.CHECKEDIN)
            }
            else {
                console.log('table no found, can not write')
            }
        })  
    }

    checkout() {
        let { tables, selectedIndex, modalTableNo } = this.state     
        const database = firebase.database();
        const rootRef = database.ref('/current/tables');
        rootRef.child(this.props.floor).child(selectedIndex).set(null)
        tables[selectedIndex].status = 1
        tables[selectedIndex].tableNo = ''
        this.setState({
            tables,
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
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
                    this.setState({selectedIndex: index, selectedStatus: item.status})
                }}>
                <View style={[
                    {flex: 1},
                    item.status == this.STATUS.CHECKEDIN ? { backgroundColor: 'red' } : (item.status == this.STATUS.AVAILABLE ? { backgroundColor: "green"} : { backgroundColor: "#ddd" }),
                    {alignItems: "center"},
                    {justifyContent: "center"}
                ]}>                    
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>{item.tableNo}</Text>
                </View>
            </TouchableOpacity>          
        );
    }
}