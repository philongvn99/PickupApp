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
import { floor } from "react-native-reanimated";

export default class CommonFloor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            modalTableNo: '',
            tables: [], 
            defaultTables: [],
            isShowMessage: false,
            message: '',
            visible: false
        }
    }

    STATUS = {
        'CHECKEDIN': 2,
        'AVAILABLE': 1,
        'INACTIVE': 0
    }

    componentDidMount() {
        this.setState({
            visible: true
        })
        let tables = []   
        const database = firebase.database();
        const ref = database.ref('/tables');
        ref.child(this.props.floor).on('value', snapshot => {
            let defaultTables = snapshot.val()
            for (let i = 0; i < defaultTables.length; i++) {
                tables.push({
                    tableNo: '',
                    status: defaultTables[i],
                    defaultStatus: defaultTables[i],
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
        console.log('in render table data')           
        console.log(tables)
        console.log(data)
        
        if(data && typeof data !=='undefined') {
            tables.forEach((table, index) => {
                let t = data[index]
                if(t && typeof t !=='undefined') {
                    table.status = t.status,
                    table.tableNo = t.tableNo
                }
                else {
                    table.status = table.defaultStatus,
                    table.tableNo = ''
                }
            })
            this.setState({tables})
        }
        this.setState({visible: false })
    }    

    render() {
        let { visible} = this.state
        const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', }, lottie: { width: 100, height: 100, }, });

        return (
            <View>
                <View style={styles.container}>
                    <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} />
                </View>

                <View>
                <SquareGrid rows={12} columns={12} items={this.state.tables} renderItem={this.renderItem} />

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
                        <View style={{height: 10}}>

                        </View>
                        <Button
                            onPress={() => {
                                this.setState({
                                    isShowMessage: false,
                                    message: '',
                                    isModalVisible: false
                                })
                            }} title="Đóng" />  

                        {this.state.isShowMessage && <Text style={{color: 'red', fontSize: 18, marginTop: 10}}>{this.state.message}</Text>}
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
        if(status!=this.STATUS.INACTIVE) {
            this.setState({
                isModalVisible: true
            })
        }        
    }

    async checkDuplicatedTableNo() {
        let { modalTableNo } = this.state 

        const database = firebase.database();
        const rootRef = database.ref('/current/tables');

        let result = false
        
        await rootRef.once('value', snapshot => {
            let floors = snapshot.val()
            if(floors && Array.isArray(floors) && floors.length>0) {
                floors.forEach(floor => {
                    Object.values(floor).forEach(table => {                
                        if (modalTableNo.trim() == table.tableNo.trim()) {
                            result = true
                        }
                    })
                })
            }
        })

        return result
    }

    async checkin() {
        let {tables, selectedIndex, modalTableNo} = this.state       
        let found = await this.checkDuplicatedTableNo()
        console.log('here ',found)
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
            this.setState({
                isShowMessage: true,
                message: 'Thẻ bàn đã sử dụng.'
            })
        }
    }

    checkout() {
        let { tables, selectedIndex, modalTableNo } = this.state     
        const database = firebase.database();
        const rootRef = database.ref('/current/tables');
        rootRef.child(this.props.floor).child(selectedIndex).remove()
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
                <View style={[{borderRadius: 50},
                    {flex: 1},
                    item.status == this.STATUS.CHECKEDIN ? { backgroundColor: 'red' } : (item.status == this.STATUS.AVAILABLE ? { backgroundColor: "#42692f"} : { display: "none" }),
                    {alignItems: "center"},
                    {justifyContent: "center"}
                ]}>                    
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold' }}>{item.tableNo}</Text>
                </View>                
            </TouchableOpacity>          
        );
    }
}