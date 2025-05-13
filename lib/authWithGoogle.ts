import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '811335863494-nu0hdt30u4b79dejfjbm1offebvk40dn.apps.googleusercontent.com',
    androidClientId: '811335863494-vdqa7kaddi516ftsslsr2oebh60ca4vr.apps.googleusercontent.com',
    iosClientId: '811335863494-2fav9p7un0tfra3huhna9ggjqptv6480.apps.googleusercontent.com',
    webClientId: '811335863494-nu0hdt30u4b79dejfjbm1offebvk40dn.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return { promptAsync, request };
}
