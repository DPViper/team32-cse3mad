import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import StarRating from '../components/StarRating';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useAuth } from '@/hooks/useAuth';

// Define route params type
type ReviewRouteParams = {
  params: {
    poiId: string;
    imageUrl: string;
  };
};

type Navigation = {
  navigate: (screen: string, params: any) => void;
  goBack: () => void;
};

export default function ReviewScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<ReviewRouteParams, 'params'>>();
  const { poiId, imageUrl } = route.params;
  const { user } = useAuth();

  const [ratings, setRatings] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to submit a review.');
      return;
    }
    if (ratings === 0 || comment.trim() === '') {
      Alert.alert('Error', 'Please provide a rating and comment.');
      return;
    }
    try {
      await addDoc(collection(db, `pois/${poiId}/comments`), {
        userId: user.uid,
        ratings,
        comment,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Review submitted.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to submit review. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Review</Text>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={{ padding: 20 }}>
      <Text>Rate this item:</Text>

      <StarRating 
        rating={ratings} 
        itemId={poiId}
        userId={user.uid}
        onChange={(newRating) => setRatings(newRating)} 
      />

      <Text>Your rating: {ratings}</Text>
    </View>
      <TextInput
        style={styles.textInput}
        placeholder="Write your review..."
        placeholderTextColor="#999"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageWrapper: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: width - 32,
    height: (width - 32) * 0.4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginVertical: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#f08a24',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
