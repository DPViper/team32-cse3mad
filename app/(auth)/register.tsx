import { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { updateDoc } from 'firebase/firestore';


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm();

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

  const onSubmit = async (data: any) => {
    if (data.password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password too short' });
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      const uid = auth.currentUser?.uid;

      await setDoc(doc(db, 'users', uid!), {
        userID: uid,
        displayName: email.split('@')[0],
        phone: '',
        activeLevel: 'New',
      });
      if (!uid) return;

      await updateDoc(doc(db, 'users', uid), {
        phone: '+123456789',
        activeLevel: 'Explorer',
      });

      router.replace('/(tabs)');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create Account</ThemedText>
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Email" value={value} onChangeText={onChange} />
        )}
      />
      {errors.email && <Text style={{ color: 'red' }}>Email is required</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: true, minLength: 6 }}
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Password" secureTextEntry value={value} onChangeText={onChange} />
        )}
      />
      {errors.password && (
        <Text style={{ color: 'red' }}>
          {errors.password.type === 'minLength' ? 'Min 6 characters' : 'Password is required'}
        </Text>
      )}
      <Button onPress={handleSubmit(onSubmit)}>Register</Button>
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
