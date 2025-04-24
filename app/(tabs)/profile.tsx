import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || '');

  const handleSave = async () => {
    if (!auth.currentUser) return;

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
