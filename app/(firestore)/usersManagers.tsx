import { useEffect, useState } from "react";
import { db } from '@/lib/firebaseConfig';
import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

//Define the shape of a User document
interface User {
    id: string;
    displayName: string;
    phone: string;
    activeLevel: string;
}

const UsersManager: React.FC = () => {

    const [userList, setUserList] = useState<User[]>([]);
  
    //State for the new user form inputs
    const [newUserName, setNewUserName] = useState<string>('');
    const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');
    const [newActiveLevel, setNewActiveLevel] = useState<string>('');

    // Reference to the 'users' collection in Firestore
    const usersCollectionRef = collection(db, 'users');
  
    // Fetch all users from Firestore and update state
    const getUserList = async (): Promise<void> => {
      try {
        const snapshot = await getDocs(usersCollectionRef);
        const filteredData: User[] = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<User, 'id'>;
          return {
            ...data,
            id: doc.id,
          };
        });
        setUserList(filteredData);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    
    //Run getUserList once when the component mounts
    useEffect(() => {
      getUserList();
    }, []);
  
    //Add a new user document to Firestore, then refresh the list
    const addUserInformation = async (): Promise<void> => {
      try {
        await addDoc(usersCollectionRef, {
          displayName: newUserName,
          phone: newPhoneNumber,
          activeLevel: newActiveLevel,
        });
  
        // reload the states
        await getUserList();
  
        //Clear the form inputs
        setNewUserName('');
        setNewPhoneNumber('');
        setNewActiveLevel('');
      } catch (err) {
        console.error('Error adding user:', err);
      }
    };

    //Update an existing user document by its ID
    const updateUserInformation = async (
      id: string,
      updatedFields: Partial<Omit<User, 'id'>>
    ): Promise<void> => {
      try {
        const userDocRef = doc(db, 'users', id);
        await updateDoc(userDocRef, updatedFields);
        console.log(`User ${id} successfully updated.`);
        // Refresh the list after updating
        await getUserList();
      } catch (error) {
        console.error(`Error updating user ${id}:`, error);
      }
    };

    //Delete a user document by its ID
    const deleteUserInformation = async (id: string): Promise<void> => {
      try {
        const userDocRef = doc(db, 'users', id);
        await deleteDoc(userDocRef);
        console.log(`User ${id} successfully deleted.`);
        // Refresh the list after deleting
        await getUserList();
      } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
      }
    };

    //Handler to prompt for new values and call update
    const handleEditUser = (user: User) => {
      const newName = window.prompt('New display name:', user.displayName);
      const newPhone = window.prompt('New phone number:', user.phone);
      const newLevel = window.prompt('New active level:', user.activeLevel);
      if (newName && newPhone && newLevel) {
        updateUserInformation(user.id, {
          displayName: newName,
          phone: newPhone,
          activeLevel: newLevel,
        });
      }
    };
  
    return (
      <div>
        <h2>User Management</h2>
  
        {/* New User Form */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Display Name"
            value={newUserName}
            onChange={e => setNewUserName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newPhoneNumber}
            onChange={e => setNewPhoneNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Active Level"
            value={newActiveLevel}
            onChange={e => setNewActiveLevel(e.target.value)}
          />
          <button onClick={addUserInformation}>Add User</button>
        </div>
  
        {/* User List */}
        <ul>
          {userList.map(user => (
            <li key={user.id}>
              <strong>{user.displayName}</strong> — {user.phone} — {user.activeLevel}
              {' '}
              <button onClick={() => handleEditUser(user)}>Edit</button>
              {' '}
              <button onClick={() => deleteUserInformation(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default UsersManager;