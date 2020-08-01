import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Component } from 'react';
import HomeScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class App extends Component {

  render() {
    let Tab = createBottomTabNavigator();

    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Floor1" 
            component={HomeScreen} 
            options={{
              tabBarLabel: 'Tầng 1',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-1" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="Floor2" 
            component={SettingsScreen} 
            options={{
              tabBarLabel: 'Tầng 2',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-2" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="Floor3"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Tầng 3',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-floor-3" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="TopRoof"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Sân thượng',
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