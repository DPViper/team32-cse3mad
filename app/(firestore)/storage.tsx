import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { TextInput, Button, View, Image, Text } from 'react-native';

interface LocationData {
    name: string;
    description: string;
    rating: number;
    imageUrl: string; // URL of the image or filename
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }

  const FirestoreData: React.FC = () => {
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [newLocation, setNewLocation] = useState<LocationData>({
      name: '',
      description: '',
      rating: 0,
      imageUrl: '',
      coordinates: { latitude: 0, longitude: 0 },
    });

    useEffect(() => {
      // Fetch location data from Firestore
      const unsubscribe = onSnapshot(collection(db, 'locations'), snapshot => {
        setLocations(snapshot.docs.map(doc => doc.data() as LocationData));
      });

      return () => unsubscribe();
    }, []);

    const handleAddLocation = async () => {
      if (newLocation.name) {
        // Store the location data in Firestore
        await addDoc(collection(db, 'locations'), {
          ...newLocation,
        });

        // Reset values after adding the location
        setNewLocation({
          name: '',
          description: '',
          rating: 0,
          imageUrl: '', // If you're only storing image URL
          coordinates: { latitude: 0, longitude: 0 },
        });
      }
    };

    return (
      <View>
        <TextInput
          placeholder="Location Name"
          value={newLocation.name}
          onChangeText={(text) => setNewLocation({ ...newLocation, name: text })}
        />
        <TextInput
          placeholder="Description"
          value={newLocation.description}
          onChangeText={(text) => setNewLocation({ ...newLocation, description: text })}
        />
        <TextInput
          placeholder="Rating"
          keyboardType="numeric"
          value={newLocation.rating.toString()}
          onChangeText={(text) => setNewLocation({ ...newLocation, rating: parseFloat(text) })}
        />
        <TextInput
          placeholder="Image URL"
          value={newLocation.imageUrl}
          onChangeText={(text) => setNewLocation({ ...newLocation, imageUrl: text })}
        />
        <Button title="Add Location" onPress={handleAddLocation} />

        <View>
          <Text>Locations:</Text>
          {locations.map((location, index) => (
            <View key={index}>
              <Text>{location.name}</Text>
              <Text>{location.description}</Text>
              <Text>Rating: {location.rating}</Text>
              {location.imageUrl && <Image source={{ uri: location.imageUrl }} style={{ width: 100, height: 100 }} />}
              <Text>Coordinates: {location.coordinates.latitude}, {location.coordinates.longitude}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  export default FirestoreData;