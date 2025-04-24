import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import Toast from 'react-native-toast-message';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { updateDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!auth.currentUser) return;

    if (!uid) return;

    await updateDoc(doc(db, 'users', uid), {
      displayName: name,
      phone,
    });
  
    await updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&rounded=true&size=256`,
    });
  
    Toast.show({ type: 'success', text1: 'Profile updated!' });
    refreshProfile();

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&rounded=true&size=256`;

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatarUrl,
      });

      Toast.show({
        type: 'success',
        text1: 'Profile updated!',
      });
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: e.message,
      });
    }
  };

  const fetchProfile = async () => {
    const docRef = doc(db, 'users', auth.currentUser!.uid);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log('User data:', docSnap.data());
    }
  };

  return (
    <View style={styles.container}>
      {name && (
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&rounded=true&size=256` }}
          style={styles.avatar}
        />
      )}
      <TextInput
        placeholder="Display Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F5EFE7',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5BDAF',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans',
    color: '#4A372D',
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
});
