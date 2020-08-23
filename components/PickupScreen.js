import * as React from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { Component } from 'react';
import firebase from 'firebase';
import SquareGrid from "react-native-square-grid";

export default class PickupScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            selectedIndex: -1,
            selectedStatus: -1,
            selectedTableNo: '',
            modalTableNo: '',
            isShowMessage: false,
            message: '',
            visible: false,
            snapshot: null,
            tables: [
                [1,2,3],
                [4,5],
                [6,7,9,8],
                []
            ]
        }
    }

    render() {
        let { tables} = this.state
        return (
            <SquareGrid rows={2} columns={2} items={tables} renderItem={this.renderItem} />
        );
    }

    resetTableData() {
        firebase.database().ref('/current').remove()
    }

    renderItem = (section, index) => {
        return (
            section.map(item=>{
                return (
                    <TouchableOpacity style={{
                        flex: 1,
                        alignSelf: 'flex-start',
                        padding: 5
                    }} onPress={() => {
                        //this.showModal(item.status)
                        //this.setState({ selectedIndex: index, selectedStatus: item.status, selectedTableNo: item.tableNo })
                    }}>
                        <View style={[{ borderRadius: 50 },
                        { flex: 1 },
                        {backgroundColor: "#42692f"},
                        { alignItems: "center" },
                        { justifyContent: "center" }
                        ]}>
                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold' }}>{item}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        );
    }
}