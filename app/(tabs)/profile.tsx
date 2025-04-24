import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '@/lib/firebaseConfig';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
