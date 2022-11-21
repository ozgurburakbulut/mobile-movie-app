import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View, Image, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
require('whatwg-fetch')
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();


const App = () => {

  const [filmID, setFilmID] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const Home = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState('');

    useEffect(() => {
      setLoading(true);

      fetch(('https://www.omdbapi.com/?apikey=6f9d1d73&s=' + searchData), {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => { setData(responseJson?.Search) })
        .catch(console.error)
        .finally(() => setLoading(false));

    }, [searchData])

    const press = (id) => {
      navigation.navigate('Details')
      setFilmID(id);
    }

    const filmList = ({ item }) => {

      return (
        <View>
          <TouchableOpacity style={styles.itemContainer}
            onPress={() => { press(item.imdbID) }}>
            <Image source={{ uri: item.Poster }} style={styles.image} />
            <Text style={{ fontSize: 15, fontWeight: 'bold', paddingLeft: 10 }}>{item.Title}</Text>
          </TouchableOpacity>
        </View>
      )
    }


    return (
      <View style={styles.container}>
        <SafeAreaView>
          <TextInput
            style={styles.textInput}
            value={searchData}
            placeholder='Search Films'
            onChangeText={(text) => {
              setSearchData(text);
            }} />
          {
            loading > 0 ? <ActivityIndicator /> : (
              <FlatList
                data={data}
                renderItem={filmList}
                keyExtractor={item => item.imdbID}
                ListEmptyComponent={<Text>There is nothing to shown.</Text>}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            )
          }
        </SafeAreaView>
      </View>
    )
  }

  const Details = ({ navigation }) => {
    const [detailData, setDetailData] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
      setDetailLoading(true);

      fetch("https://www.omdbapi.com/?apikey=6f9d1d73&i=" + filmID, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((responseJson) => { setDetailData(responseJson); })
        .catch(console.error)
        .finally(() => setDetailLoading(false));
    }, []);


    return (
      setDetailLoading > 0 ? <ActivityIndicator /> : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View>
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.detailTitle}>{detailData.Title}</Text>
              <Image source={{ uri: detailData.Poster }} style={{ height: 400, width: 230, alignSelf: 'center' }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.detailSubs}>IMDb Rating</Text>
                <Text>{detailData.imdbRating}</Text>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.detailSubs}>Year</Text>
                <Text>{detailData.Year}</Text>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.detailSubs}>Time</Text>
                <Text>{detailData.Runtime}</Text>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.detailSubs}>Released</Text>
                <Text>{detailData.Released}</Text>
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 14, fontStyle: 'italic' }}>{detailData.Plot}</Text>
              <Text style={{ paddingTop: 10 }}>Director: <Text style={{ fontWeight: 'bold' }}>{detailData.Director}</Text></Text>
              <Text style={{ paddingTop: 10 }}>Writer(s): <Text style={{ fontWeight: 'bold' }}>{detailData.Writer}</Text></Text>
              <Text style={{ paddingTop: 10 }}>Stars: <Text style={{ fontWeight: 'bold' }}>{detailData.Actors}</Text></Text>
            </View>
          </View>
        </ScrollView>
      )
    )
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Movies' component={Home} />
        <Stack.Screen name={'Details'} component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '10%',
  },

  textInput: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 5,
    borderColor: 'black',
    backgroundColor: 'white',
  },

  image: {
    height: 80,
    width: 50,
    borderRadius: 10,
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 10,
  },

  detailSubs: {
    fontSize: 12,
    color: 'grey'
  }
})