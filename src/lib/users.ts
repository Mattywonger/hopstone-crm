import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions, WithFieldValue, collection } from "firebase/firestore"
import { ProfilerOnRenderCallback } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const defaultProfilePic = "/unknown-user.png";
const UserCollectionPath = "users"

export type UserCollection = {
    users: Array<User>,
    ref: CollectionReference
}

export type User = {
    profile: UserProfile,
    ref: DocumentReference
}

export type UserProfile = {
    firstName: string,
    lastName: string,
    profilePic: string,
    isAdmin: boolean,
    pod: DocumentReference | null
}

export const useUsers = (firestore: Firestore, path: string): [UserCollection, boolean, Error | null] => {
    const userCollection = collection(firestore, path).withConverter(userConverter)
    const [users, loading, error] = useCollection(userCollection)

    return [{ users: users != undefined ? users.docs.map(user => user.data()) : [], ref: userCollection }, loading, error || null]
}

export const findUser = (ref: DocumentReference, userCollection: UserCollection): User | null => (
    userCollection.users.find(user => user.ref == ref) || null
)

const profileFromDoc = (doc: DocumentData) => {
    const data = doc.data()
    return {
        firstName: data?.firstName,
        lastName: data?.lastName,
        profilePic: data?.profilePic || defaultProfilePic,
        isAdmin: data?.isAdmin || false,
        pod: data?.pod || null
    };
}

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: User): DocumentData {
        return user.profile;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
        return {
            profile: profileFromDoc(snapshot.data(options)),
            ref: snapshot.ref
        }
    }
}

