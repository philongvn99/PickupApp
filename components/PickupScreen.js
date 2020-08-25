import * as React from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Component } from 'react';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Modal from 'react-native-modal';
import moment from 'moment';

export default class PickupScreen extends Component {
    constructor(props) {
        super(props)
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
            floorItems: [
                [],
                [],
                [],
                []
            ]
        }
    }

    componentDidMount() {
        let {floorItems} = this.state

        this.setState({
            visible: true
        })
        const database = firebase.database();
        const ref = database.ref('/current');

        ref.on('value', snapshot => {           
            floorItems = [
                [],
                [],
                [],
                []
            ]
            snapshot.forEach(childSnapshot=>{                
                let child = childSnapshot.val()
                if (!child.isServed) {                    
                    child.positions.forEach(position=>{
                        if(position.isCurrentPosition) {
                            floorItems[position.floor].push({
                                index: position.index,
                                tableNo: child.tableNo
                            })
                        }
                    })
                }
            })     
            console.log(floorItems) 
            this.setState({ floorItems, visible: false })
        })      
    }

    render() {
        let {visible, selectedTableNo} = this.state        

        return (    
            <View style={{ flex: 1 }}>
                <View>
                    <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={this.styles.lottie} speed={1} />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flex: .5, flexDirection: 'row' }}>
                        {this.renderFloor(0, 'topLeft')}
                        {this.renderFloor(1, 'topRight')}
                    </View>
                    <View style={{ flex: .5, flexDirection: 'row' }}>
                        {this.renderFloor(2, 'bottomLeft')}
                        {this.renderFloor(3, 'bottomRight')}
                    </View>
                </View>

                <Modal isVisible={this.state.isModalVisible}
                    onBackdropPress={() => this.setState({ isModalVisible: false, selectedIndex: -1, selectedFloor: -1 })}                 
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        maxHeight: 200,
                        justifyContent: 'center',
                        backgroundColor: '#FFF'
                    }}>

                        <View>
                            <Text style={{ marginVertical: 10, fontSize: 20 }}>Thẻ bàn đang chọn: {selectedTableNo}</Text>
                            <Button
                                onPress={() => {
                                    this.serve()
                                }} title="Giao Nước" />
                        </View>                       
                    </View>
                </Modal>
            </View> 
        );
    }

    async serve() {
        let {selectedFloor, selectedIndex, selectedTableNo} = this.state
        const database = firebase.database();
        const rootRef = database.ref('/current');
        await rootRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                let child = childSnapshot.val()
                if (child.tableNo == selectedTableNo) {
                    child.positions.forEach((position, i) => {
                        if (position.floor == selectedFloor && position.index == selectedIndex && position.isCurrentPosition) {
                            database.ref('/current/' + childSnapshot.key).update({
                                isServed: true,
                                servedTime: moment().format("HH:mm:ss")
                            })
                        }
                    })
                }
            })
        })

        this.setState({
            isModalVisible: false,
            selectedIndex: -1,
            selectedFloor: -1,
            selectedTableNo: '',
            modalTableNo: ''
        })
    }

    renderFloor(floor, pos) {
        return (
            <View style={[{ flex: 1 }, 
                pos == 'topLeft' ? this.styles.topLeftCell : (pos == 'topRight' ? this.styles.topRightCell : (pos == 'bottomLeft' ? this.styles.bottomLeftCell : (pos == 'bottomRight' ? this.styles.bottomRightCell : '')))]}>
                <View style={[{ flex: 1.5, backgroundColor: '#ddd' }, this.styles.sectionHeader]}>
                    <Text>Tầng {parseInt(floor+1)}</Text>
                </View>    
                <View style={{ flex: 8.5, flexDirection: 'row' }}>
                    {this.renderFloorItems(floor)}
                </View>
            </View>            
        )
    }

    renderFloorItems(floor) {
        let {floorItems} = this.state
        let currentFloorItems = floorItems[floor]
        return(
            currentFloorItems.map(item => {
                return (
                    <TouchableOpacity style={{
                        width: 40,
                        height: 40,
                        padding: 5
                    }} onPress={() => {
                        this.showModal()
                        this.setState({ selectedIndex: item.index, selectedTableNo: item.tableNo, selectedFloor: floor })
                    }}>
                        <View style={[{ borderRadius: 50 },
                        { flex: 1 },
                        { backgroundColor: 'blue', color: '#000'},
                        { alignItems: "center" },
                        { justifyContent: "center" }
                        ]}>
                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold' }}>{item.tableNo}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    }

    showModal = () => {
        this.setState({
            isModalVisible: true
        })        
    }

    borderColor = '#ccc'
    
    styles = StyleSheet.create({ 
        lottie: { width: 100, height: 100, }, 
        topLeftCell: {
            marginTop: 10,
            marginLeft: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderLeftWidth: 1
        },
        topRightCell: {
            marginTop: 10,
            marginRight: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderLeftWidth: 1
        },
        bottomLeftCell: {   
            marginLeft: 10,                     
            marginBottom: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,            
            borderLeftWidth: 1,
            borderBottomWidth: 1
        },
        bottomRightCell: {
            marginRight: 10,
            marginBottom: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1
        },
        sectionHeader: {
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

}