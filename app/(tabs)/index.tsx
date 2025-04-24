import { View, Image, StyleSheet, Platform } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ThemedText } from '@/components/ThemedText';


export default function HomeScreen() {
  const { name, avatar } = useUserProfile();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={{ uri: avatar }}
      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
    />
    <ThemedText>Welcome back, {name}!</ThemedText>
  </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
