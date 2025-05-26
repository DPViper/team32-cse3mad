// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock firebase
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

// Mock Firebase config
jest.mock("@/lib/firebaseConfig", () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

// Mock ThemeContext
jest.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    primary: "#fff",
    secondary: "#666",
    textDark: "#000",
  }),
}));
