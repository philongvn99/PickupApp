/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Component } from 'react';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import moment from 'moment';
import { Container, Content, InputGroup, Input } from 'native-base';

export default class PickupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
        };
    }

    componentDidMount() {

    }

    createTwoButtonAlert() {
        Alert.alert(
            'ECO Gióng',
            'Lưu dữ liệu thành công',
            [
                { text: 'Đóng' },
            ],
            { cancelable: false }
        );
    }

    render() {
        let {visible} = this.state;

        return (
            <Container>
                <View>
                    <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={this.styles.lottie} speed={1} />
                </View>

                <Content style={this.styles.contentWrapper}>
                    <InputGroup borderType="regular">
                        <Input
                            placeholder="Họ và tên"
                            onChangeText={(text) => {
                                this.setState({ hoten: text });
                            }}
                            value={this.state.hoten}
                        />
                    </InputGroup>

                    <InputGroup borderType="regular">
                        <Input
                            keyboardType="numeric"
                            placeholder="Số điện thoại"
                            onChangeText={(text) => {
                                this.setState({ sodienthoai: text });
                            }}
                            value={this.state.sodienthoai}
                        />
                    </InputGroup>

                    <InputGroup borderType="regular">
                        <Input
                            placeholder="Email"
                            onChangeText={(text) => {
                                this.setState({ email: text });
                            }}
                            value={this.state.email}
                        />
                    </InputGroup>

                    <InputGroup borderType="regular">
                        <Input
                            placeholder="Tên công ty"
                            onChangeText={(text) => {
                                this.setState({ tencongty: text });
                            }}
                            value={this.state.tencongty}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Input
                            placeholder="Địa chỉ công ty"
                            onChangeText={(text) => {
                                this.setState({ diachicongty: text });
                            }}
                            value={this.state.diachicongty}
                        />
                    </InputGroup>

                    <InputGroup style={{marginBottom: 20}}>
                        <Input
                            placeholder="Mã số thuế"
                            onChangeText={(text) => {
                                this.setState({masothue: text});
                            }}
                            value={this.state.masothue}
                            keyboardType="numeric"
                        />
                    </InputGroup>

                    <Button
                        onPress={this.submit}
                        title="Submit"
                    />
                </Content>
            </Container>
        );
    }

    submit = () => {
        let {hoten, diachicongty, email, sodienthoai, tencongty, masothue} = this.state;

        const database = firebase.database();
        const rootRef = database.ref('/invoice');
        const pushedPostRef = rootRef.push({
            hoten,
            sodienthoai,
            email,
            tencongty,
            diachicongty,
            masothue,
            createdDateTime: moment().format('DD MMM YYYY HH:mm:ss'),
        });
        this.setState({
            hoten:'',
            sodienthoai: '',
            email: '',
            tencongty: '',
            diachicongty: '',
            masothue: '',
        });
        this.createTwoButtonAlert();
    }

    showModal = () => {
        this.setState({
            isModalVisible: true,
        });
    }

    borderColor = '#ccc'

    styles = StyleSheet.create({
        contentWrapper: { padding: 10 },
        lottie: { width: 100, height: 100 },
        topLeftCell: {
            marginTop: 10,
            marginLeft: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderLeftWidth: 1,
        },
        topRightCell: {
            marginTop: 10,
            marginRight: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderLeftWidth: 1,
        },
        bottomLeftCell: {
            marginLeft: 10,
            marginBottom: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderBottomWidth: 1,
        },
        bottomRightCell: {
            marginRight: 10,
            marginBottom: 10,
            borderColor: this.borderColor,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
        },
        sectionHeader: {
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
}
