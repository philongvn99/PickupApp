import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Component } from 'react';
import HomeScreen from './components/HomeScreen';
import Floor1Screen from './components/Floor1Screen'; 
import Floor2Screen from './components/Floor2Screen'; 
import Floor3Screen from './components/Floor3Screen'; 
import Floor4Screen from './components/Floor4Screen'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class App extends Component {

  render() {
    let Tab = createBottomTabNavigator();

    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Quản lý',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="database-settings" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen name="Floor1" 
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
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}