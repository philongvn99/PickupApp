import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
} from "react-native";
import SquareGrid from "react-native-square-grid";

var NUMBERS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "30",
    "40",
    "50",
    "60",
    "",
    "72",
    "73",
    "74",
    "75",
    "76",
    "72",
    "73",
    "74",
    "75",
    "76",
];

var styles = StyleSheet.create({
    item: {
        flex: 1,
        alignSelf: "stretch",
        padding: 10
    },
    content: {
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "white",
        fontSize: 32
    }
});


// Best viewed in landscape
export default function SquareGridExample(props) {
    return (
        <SquareGrid rows={7} columns={5} items={NUMBERS} renderItem={renderItem} />
    );
}

function renderItem(item) {
    return (
        <View style={styles.item}>
            <View style={styles.content}>
                <Text style={styles.text}>{item}</Text>
            </View>
        </View>
    );
}