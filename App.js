import React, {useEffect, useState} from 'react';
import LogoImg from './assets/logo/galleryimg1.svg'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Button
} from 'react-native';

const Stack = createNativeStackNavigator();

const apiLink = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'


const HomePage = ()=>{
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const response = await fetch(apiLink);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      if (!data || !data.photos || !data.photos.photo) {
        throw new Error('Invalid response from API');
      }
      const fetchedImages = data.photos.photo.map(photo => ({
        id: photo.id,
        url: photo.url_s
      }));
      await AsyncStorage.setItem('cachedImages', JSON.stringify(fetchedImages));
      setImages(fetchedImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images initially
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchImages();
  };

  return(
     <View style={{ flex: 1, paddingTop: 50 }}>
       <Button title="Refresh" onPress={handleRefresh} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url }}
              style={{ width: 400, height: 300, margin: 5 }}
            />
          )}
          numColumns={1}
        />
      )}
    </View>
  );
}

const LandingPage = ({navigation})=> {
  function navigateToHomePage(){
    navigation.navigate('HomePage')
  }
  return (
    <SafeAreaView  style={styles.homeText} >
        <View>
          <Text style={styles.textHead}>Gallery</Text>
        </View>
        <View style={styles.homeText}>
        <LogoImg style={styles.logoimg} ></LogoImg>
        </View>
        <TouchableOpacity style={styles.buttonBegin} onPress={navigateToHomePage} >
          <Text style={styles.buttonFont}>Let's Begin </Text>
          <MaterialIcons name="arrow-forward-ios" size={32} color='#fff'></MaterialIcons>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const App = ()=> {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={LandingPage} name='Welcome' ></Stack.Screen>
        <Stack.Screen component={HomePage} name="HomePage"></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeText : {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },
  textHead :{
    fontFamily:"Inter-Bold",
    fontSize: 40,
    color: '#20315f',
    marginTop:20
  },
  buttonBegin:{
    borderRadius:50,
    backgroundColor: "#AD40AF",
    padding:20,
    width:"90%",
    flexDirection:"row",
    justifyContent: "space-between",
    marginBottom:50
  },
  buttonFont:{
    fontFamily:'Roboto-MediumItalic',
    fontSize:20,
    color:"#fff",
  },
  logoimg:{
    transform:[{rotate: "-10deg"}]
  }
})

export default App;
