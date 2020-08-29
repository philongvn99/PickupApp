import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    TextInput,
    Dimensions
} from "react-native";
import SquareGrid from "react-native-square-grid";
import Modal from 'react-native-modal';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import moment from 'moment';
import ImageMapper from 'react-native-image-mapper';



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
        'AVAILABLE': 0,        
        'CHECKED_IN': 1,
        'PICKED_UP': 2,
        "SERVED": 3
    }

    APP_SCREEN_HEIGHT = Dimensions.get('window').height
    APP_SCREEN_WIDTH = Dimensions.get('window').width

    componentDidMount() {
        this.setState({
            visible: true
        })  
        const database = firebase.database();
        const ref = database.ref('/config/tables');
        ref.child(this.props.floor).once('value', snapshot => {
            let tables = []   
            snapshot.forEach(t=>{
                let table = t.val() 
                tables.push({
                    tableNo: '',
                    status: this.TABLE_STATUS.AVAILABLE,
                    id: table.id,
                    radius: table.radius,
                    shape: table.shape,
                    fill: table.fill,
                    prefill: table.prefill,
                    x1: table.x1,
                    y1: table.y1
                })                              
            })
                                                               
            this.setState({ tables, visible: false }, () => {
                this.readCurrent()
            })  
            
        })                  
    }

    addCurrent(floor, tableIndex, tableNo) {
        console.log('in add current')
        const database = firebase.database()
        const rootRef = database.ref('/current')
        const pushedPostRef = rootRef.push({
            tableNo,
            isServed: false            
        })
        const newId = pushedPostRef.getKey();
        rootRef.child(newId + '/positions').push(
            {
                floor: floor,
                index: tableIndex,
                checkinTime: moment().format("HH:mm:ss"),
                checkoutTime: null,
                isCurrentPosition: true
            }
        )
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
            tables.forEach(table => {
                snapshot.forEach(childSnapshot => {
                    let child = childSnapshot.val()
                    let keys = child.positions!=null ? Object.keys(child.positions) : []
                    keys.forEach(key => {
                        let position = child.positions[key]
                        if (position.isCurrentPosition) {
                            if (position.floor == this.props.floor && position.index == table.id) {
                                table.tableNo = child.tableNo                                
                                if(child.isServed) {                                    
                                    table.prefill = 'green'
                                    table.status = this.TABLE_STATUS.SERVED
                                }
                                else if(child.isPickedUp) {                                    
                                    table.prefill = 'orange'
                                    table.status = this.TABLE_STATUS.PICKED_UP
                                }
                                else {                                    
                                    table.prefill = 'red'
                                    table.status = this.TABLE_STATUS.CHECKED_IN
                                }
                            }
                        }
                        else {
                            if (position.floor == this.props.floor && position.index == table.id) {
                                table.tableNo = ''
                                table.prefill = 'gray'
                                table.status = this.TABLE_STATUS.AVAILABLE                                
                            }
                        }
                    })
                })                
            })

            this.setState({tables})
        }
        // else {
        //     this.setState({tables: []})
        // }
    }    

    mapperAreaClickHandler(item, idx, event) {
        this.showModal(item.status)
        this.setState({ selectedIndex: item.id, selectedStatus: item.status, selectedTableNo: item.tableNo })
    };

    render() {
        let { visible, tables} = this.state
        const styles = StyleSheet.create({lottie: { width: 100, height: 100, }, });
        return (
            <View>
                <View>
                    <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} />
                </View>

                <View style={{ flex: 1, alignItems: 'center', padding: 0 }}>
                    <ImageMapper
                        imgHeight={this.APP_SCREEN_HEIGHT}
                        imgWidth={this.APP_SCREEN_WIDTH}
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
                            backgroundColor: '#FFF'
                            }}>
                                
                            {this.state.selectedStatus == this.TABLE_STATUS.AVAILABLE && <View style={{display: 'flex', flexDirection: 'row', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
                                <TextInput
                                    onSubmitEditing={() => this.checkin()}
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

                            {(this.state.selectedStatus == this.TABLE_STATUS.CHECKED_IN || this.state.selectedStatus == this.TABLE_STATUS.SERVED ) && <View>
                            <Text style={{marginVertical: 10, fontSize: 20}}>Thẻ bàn đang chọn: {this.state.selectedTableNo}</Text>
                                <Button
                                    onPress={() => {
                                        this.checkout()
                                    }} title="Check out" />     
                                </View>
                            }      

                            {(this.state.selectedStatus == this.TABLE_STATUS.PICKED_UP) && <View>
                                <Text style={{ marginVertical: 10, fontSize: 20 }}>Thẻ bàn đang chọn: {this.state.selectedTableNo}</Text>
                                <View style={{marginBottom: 20}}>
                                    <Button
                                        onPress={() => {
                                            this.serve()
                                        }} title="Phục vụ nước" />
                                </View>
                                <View>
                                    <Button
                                        onPress={() => {
                                            this.checkout()
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
        let { selectedIndex, selectedTableNo } = this.state
        const database = firebase.database();
        const rootRef = database.ref('/current');
        await rootRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                let child = childSnapshot.val()
                if (child.tableNo == selectedTableNo) {
                    database.ref('/current/' + childSnapshot.key).update({
                        isServed: true,
                        isPickedUp: false,
                        servedTime: moment().format("HH:mm:ss")
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
    

    onChangeText(text) {
        this.setState({
            modalTableNo: text
        })
    }

    showModal = (status) => {
        this.setState({
            isModalVisible: true
        })           
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
                    let keys = child.positions != null ? Object.keys(child.positions) : []
                    keys.forEach(key => {
                        let position = child.positions[key]
                        if (position.isCurrentPosition) {
                            result = position.floor.replace('floor-', '')
                        }
                    })                    
                }
            })
        })
        return result
    }

    async checkin() {
        console.log('in checkin()')
        let {tables, selectedIndex, modalTableNo} = this.state             
        let found = await this.checkDuplicatedTableNo()        
        if (found<=0) {            
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
                message: 'Thẻ bàn đang sử dụng ở tầng ' + found
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
                    let keys = child.positions != null ? Object.keys(child.positions) : []
                    keys.forEach(key => {
                        let position = child.positions[key]
                        if (position.floor == this.props.floor && position.index == selectedIndex && position.isCurrentPosition) {
                            database.ref('/current/' + childSnapshot.key + '/positions/' + key).update({
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