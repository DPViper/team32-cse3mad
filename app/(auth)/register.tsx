import { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create Account</ThemedText>
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <Input 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <Button onPress={handleRegister} style={{ width: '100%', marginTop: 16 }}>Register</Button>
      <Button variant="ghost" onPress={() => router.push('/(auth)/login')} style={{ marginTop: 8 }}>
        Already have an account? Login
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE7',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#D5BDAF',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans',
    color: '#4A372D',
  },
  error: {
    color: '#B00020',
    fontSize: 14,
    marginBottom: 8,
  },
});
