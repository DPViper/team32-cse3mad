import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Please enter your email' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({ type: 'success', text1: 'Reset email sent!' });
      router.push('/(auth)/login');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Reset Password</ThemedText>
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button onPress={handleReset}>Send Reset Link</Button>
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
});
