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
            modalTableNo: '',
            tables: []
        }
    }

    STATUS = {
        'ACTIVE': 1,
        'INACTIVE': 0
    }

    componentDidMount() {
        let tables = []
        for(let i=0; i< 48; i++) {
            tables.push({
                tableNo: '',
                status: this.STATUS.INACTIVE
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
            console.log('data ', data)
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
                        justifyContent: 'center',
                        backgroundColor: '#FFF'
                        }}>
                            
                        <TextInput
                            keyboardType='numeric'
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 100, marginBottom: 10 }}
                            onChangeText={value => this.onChangeText(value)}
                            value={this.state.modalTableNo}
                        />

                        <Button 
                            onPress={() => {                                
                                this.submit()
                        }} title="Submit" />
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

    showModal = () => {
        this.setState({
            isModalVisible: true
        })
    }

    submit() {
        let {tables, selectedIndex, modalTableNo} = this.state        
        tables[selectedIndex].tableNo = modalTableNo
        tables[selectedIndex].status = this.STATUS.ACTIVE
        this.setState({
            isModalVisible: false,
            selectedIndex: -1,
            modalTableNo: ''            
        })

        this.writeTableData(this.props.floor, selectedIndex, modalTableNo, this.STATUS.ACTIVE)
    }

    renderItem = (item, index) => {
        return (
            <TouchableOpacity style={{
                flex: 1,
                alignSelf: "stretch",
                padding: 5
                }} onPress={() => {
                    this.showModal()
                    this.setState({selectedIndex: index})
                }}>
                <View style={[
                    {flex: 1},
                    item.status == this.STATUS.ACTIVE ? {backgroundColor: 'green'} : {backgroundColor: "#ccc"},
                    {alignItems: "center"},
                    {justifyContent: "center"}
                ]}>                    
                    <Text style={{ textAlign: 'center', color: '#fff' }}>{item.tableNo}</Text>
                </View>
            </TouchableOpacity>          
        );
    }
}