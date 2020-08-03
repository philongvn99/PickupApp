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
import tableConfig from '../config/tableConfig.json'

export default class CommonFloor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            modalTableNo: '',
            tables: []
        }
    }

    STATUS = {
        'CHECKEDIN': 2,
        'AVAILABLE': 1,
        'INACTIVE': 0
    }

    componentDidMount() {
        let tables = []        
        for(let i=0; i< tableConfig.tables[this.props.floor-1].length; i++) {
            tables.push({
                tableNo: '',
                status: tableConfig.tables[this.props.floor-1][i]
            })
        }

        this.setState({tables}, () => {
            const firebaseConfig = {
                apiKey: "AIzaSyBb1WeqLnVcVvPGAqNObH3SN8ZV6JOQWYY",
                authDomain: "eco-giong.firebaseapp.com",
                databaseURL: "https://eco-giong.firebaseio.com",
                projectId: "eco-giong",
                storageBucket: "eco-giong.appspot.com",
                messagingSenderId: "352848277484",
                appId: "1:352848277484:web:a663999123b9cf90291ac9"
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            this.readTableData(this.props.floor)
        })      
    }

    writeTableData(floor, tableIndex, tableNo, status) {
        const database = firebase.database();
        const rootRef = database.ref('tables');
        rootRef.child(floor).child(tableIndex).set({
            tableNo,
            status
        }).then((data) => {
            //success callback
            //console.log('data ', data)
        }).catch((error) => {
            //error callback
            console.log('error ', error)
        })
    }

    readTableData(floor) {
        const database = firebase.database();
        const rootRef = database.ref('tables');
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

    checkDuplicatedTableNo(floor, selectedIndex, tableNo) {
        const database = firebase.database();
        const rootRef = database.ref('tables/'+floor);
        rootRef.child(selectedIndex).once('value', snapshot => {
            var dbTableNo = (snapshot.val() && snapshot.val().username) || '';
            if (dbTableNo==tableNo) {
                return true
            }
        })
        return false
    }

    checkin() {
        let {tables, selectedIndex, modalTableNo} = this.state       
        var found = this.checkDuplicatedTableNo(this.props.floor, selectedIndex, modalTableNo) 
        if(!found) {
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
    }

    checkout() {
        console.log('checked out');
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
                    item.status == this.STATUS.CHECKEDIN ? { backgroundColor: 'red' } : (item.status == this.STATUS.AVAILABLE ? { backgroundColor: "green"} : { backgroundColor: "#ccc" }),
                    {alignItems: "center"},
                    {justifyContent: "center"}
                ]}>                    
                    <Text style={{ textAlign: 'center', color: '#fff' }}>{item.tableNo}</Text>
                </View>
            </TouchableOpacity>          
        );
    }
}