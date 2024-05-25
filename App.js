import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '1993e977'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Busca de Filmes</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Buscar Filme" onPress={handleSearch} color="#007BFF" />
      </View>

      {movieData && (
        <View style={styles.movieContainer}>
          <Text style={styles.sectionTitle}>{movieData.Title}</Text>
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Prêmios: {movieData.Awards}</Text>
        </View>
      )}

{location && (
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#343a40',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  locationContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  movieContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
});

export default App;