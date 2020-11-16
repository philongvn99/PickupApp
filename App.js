/* eslint-disable prettier/prettier */
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Component } from 'react';
import MenuScreen       from './components/MenuScreen';
import SGStore          from './components/SGStore';
import Floor1Screen     from './components/Floor1Screen';
import Floor2Screen     from './components/Floor2Screen';
import Floor3Screen     from './components/Floor3Screen';
import Floor4Screen     from './components/Floor4Screen';
import PickupScreen     from './components/PickupScreen';
import SGPickUpScreen   from './components/SGPickUpScreen';
import ScanScreen       from './components/QRcodeScanner';
import QRgenerator      from './components/QRcodeGenerator';
import BarcodeGenerator from './components/BarcodeGenerator'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';
import { firebaseConfig} from './config/config'

export default class App extends Component {
  constructor(props) {
    super(props)
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.state = { visible: false }; 
  }

  componentDidMount() {
    //this.generateConfig()
  }

  generateConfig() {
    const database = firebase.database();
    const ref = database.ref('/config/tables/floor-1');
    for(let i=0; i<6; i++) {
      ref.push({
        "id": 0,
        "shape": "circle",
        "radius": 40,
        "x1": 100,
        "y1": 25,
        "prefill": "gray",
        "fill": "blue"
      })
    }    
  }

  render() {
    let Tab = createBottomTabNavigator();

    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Menu"
            component={MenuScreen}
            options={{
              tabBarLabel: 'Menu',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="menu" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="SGPickUp"
            component={SGPickUpScreen}
            options={{
              tabBarLabel: 'SaiGon Pickup',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="transfer" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="SGStore" 
            component={SGStore} 
            options={{
              tabBarLabel: 'SGStore',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-0" color={color} size={size} />
              ),
            }}
          />

          {/* <Tab.Screen name="Floor1" 
            component={Floor1Screen} 
            options={{
              tabBarLabel: 'Tầng 1',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-1" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="Floor2" 
            component={Floor2Screen} 
            options={{
              tabBarLabel: 'Tầng 2',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-2" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="Floor3"
            component={Floor3Screen}
            options={{
              tabBarLabel: 'Tầng 3',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-3" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="TopRoof"
            component={Floor4Screen}
            options={{
              tabBarLabel: 'Sân thượng',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-roof" color={color} size={size} />
              ),
            }}
          /> */}

          <Tab.Screen name="QR Scanner"
            component={ScanScreen}
            options={{
              tabBarLabel: 'QR Scanner',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-roof" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="QR Generator"
            component={QRgenerator}
            options={{
              title: 'My home',
              tabBarLabel: 'QR Generator',
              tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-roof" color={color} size={size} />
              ),
            }}
           />
          <Tab.Screen name="Barcode Generator"
            component={BarcodeGenerator}
            options={{
              tabBarLabel: 'Barcode Generator',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-roof" color={color} size={size} />
              ),
            }}
          />

        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
         

{/* <Tab.Screen
            name="BarCodeScanner"
            component={BarCodeScreen}
            options={{
              tabBarLabel: 'Barcode Scanner',
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="home-roof"
                  color={color}
                  size={size}
                />
              ),
            }}
          /> */}
