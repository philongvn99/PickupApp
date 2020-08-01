import React, { Component, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import SquareGrid from "react-native-square-grid";
import Modal from 'react-native-modal';


export default class SquareGridExample extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         isModalVisible: false
    //     }
    // }

    state = {
        isModalVisible: false,
        data:''
    }

    // const [isModalVisible, setIsModalVisible]

    NUMBERS = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ];

    render() {
        return (
            <View>
                <SquareGrid rows={8} columns={6} items={this.NUMBERS} renderItem={this.renderItem} />

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ flex: 1 }}>
        <Text style={{ color: 'white'}}>This is the modal content for now! {this.state.data}</Text>
                    </View>
                </Modal>
            </View>
        );
    }

    showModal = () => {
        this.setState({
            isModalVisible: true
        })
    }

    renderItem = (item, index) => {
        return (
            <TouchableOpacity style={{
                flex: 1,
                alignSelf: "stretch",
                padding: 5
            }} onPress={() => {
                this.showModal()
                this.setState({data: index})
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: "#ccc",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    
                        <Text style={{ textAlign: 'center' }}>{index}</Text>
                </View>
            </TouchableOpacity>          
        );
    }
}