import { useState } from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/button';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome Back</ThemedText>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#7A5C4A"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#7A5C4A"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      <Button onPress={handleLogin} style={{ width: '100%', marginTop: 16 }}>
        Login
      </Button>
      <Button variant="ghost" onPress={() => router.push('/(auth)/register')} style={{ marginTop: 8 }}>
        Don't have an account? Register
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE7', // Soft beig
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
  }
});
