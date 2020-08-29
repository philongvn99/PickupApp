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
import PickupScreen from './components/PickupScreen'; 
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
    const ref = database.ref('/config/tables/firstFloor');
    ref.push({
      "id": "0",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    ref.push({
      "id": "1",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    ref.push({
      "id": "2",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    ref.push({
      "id": "0",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    ref.push({
      "id": "1",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    ref.push({
      "id": "2",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    ref.push({
      "id": "2",
      "shape": "circle",
      "radius": 30,
      "x1": 100,
      "y1": 25,
      "prefill": "gray",
      "fill": "blue"
    })
    
  }

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

          <Tab.Screen name="Pickup"
            component={PickupScreen}
            options={{
              tabBarLabel: 'Pickup',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="transfer" color={color} size={size} />
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


/* Image Mapper in React Native to Create Clickable Areas on Image */
/* https://aboutreact.com/react-native-image-mapper/ */

//Import React
// import React, { useState } from 'react';
// import { View, Text, Dimensions } from 'react-native';

// //Import ImageMapper Component
// import ImageMapper from 'react-native-image-mapper';

// const APP_SCREEN_HEIGHT = Dimensions.get('window').height
// const APP_SCREEN_WIDTH = Dimensions.get('window').width

// const getRandomColor = () => {
//   //Function to return random color
//   //To highlight the mapping area
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
//   return color;
// };

// const App = () => {
//   console.log('width', APP_SCREEN_WIDTH)
//   console.log('height', APP_SCREEN_HEIGHT)
//   //State for the selected area
//   let [selectedAreaId, setSelectedAreaId] = useState([]);

//   let mapperAreaClickHandler = async (item, idx, event) => {
//     const currentSelectedAreaId = selectedAreaId;
//     if (Array.isArray(currentSelectedAreaId)) {
//       const indexInState = currentSelectedAreaId.indexOf(item.id);
//       if (indexInState !== -1) {
//         console.log('Removing id', item.id);
//         setSelectedAreaId([
//           ...currentSelectedAreaId.slice(0, indexInState),
//           ...currentSelectedAreaId.slice(indexInState + 1),
//         ]);
//       } else {
//         alert(`Clicked Item Id: ${item.id}`);
//         console.log('Setting Id', item.id);
//         setSelectedAreaId([...currentSelectedAreaId, item.id]);
//       }
//     } else {
//       if (item.id === currentSelectedAreaId) {
//         setSelectedAreaId(null);
//       } else {
//         setSelectedAreaId(item.id);
//       }
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: 'center', padding: 0 }}>
//       <ImageMapper
//         imgHeight={APP_SCREEN_HEIGHT}
//         imgWidth={APP_SCREEN_WIDTH}
//         imgSource={require("./assets/images/tang1.png")}
//         imgMap={RECTANGLE_MAP}
//         onPress={(item, idx, event) => mapperAreaClickHandler(item, idx, event)}
//         containerStyle={{ top: 0 }}
//         selectedAreaId={selectedAreaId}
//         multiselect
//       />
//     </View>
//   );

// };

// export default App;

// //Maps to Create Clickable Areas
// const RECTANGLE_MAP = [
//   {
//     id: '0',
//     shape: 'circle',
//     radius: 30,
//     x1: 20,
//     y1: 25,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   },
//   {
//     id: '1',
//     shape: 'circle',
//     radius: 30,
//     x1: 60,
//     y1: 25,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   },
//   {
//     id: '2',
//     shape: 'circle',
//     radius: 30,
//     x1: 100,
//     y1: 25,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   },
//   {
//     id: '3',
//     shape: 'circle',
//     radius: 30,
//     x1: 150,
//     y1: 60,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   },
//   {
//     id: '4',
//     shape: 'circle',
//     radius: 30,
//     x1: 165,
//     y1: 105,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   },
//   {
//     id: '5',
//     shape: 'circle',
//     radius: 30,
//     x1: 180,
//     y1: 150,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   },
//   {
//     id: '6',
//     shape: 'circle',
//     radius: 30,
//     x1: 195,
//     y1: 195,
//     prefill: getRandomColor(),
//     fill: 'blue',
//   }
// ];