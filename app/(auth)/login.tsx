import { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleSignIn } from '@/lib/authWithGoogle';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { promptAsync, request } = useGoogleSignIn();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome Back</ThemedText>
      <Input
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <Input
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <Button onPress={handleLogin} style={{ width: '100%', marginTop: 16 }}>
        Login
      </Button>
      <Button onPress={() => promptAsync()} style={{ marginTop: 10 }}>
        Sign in with Google
      </Button>
      <Button variant="ghost" onPress={() => router.push('/(auth)/register')} style={{ marginTop: 8 }}>
        Don't have an account? Register
      </Button>
      <Button variant="ghost" onPress={() => router.push('/(auth)/forgot-password')}>
        Forgot Password?
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
  },
  error: {
    color: '#B00020',
    fontSize: 14,
    marginBottom: 8,
  },
});
