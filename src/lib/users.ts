import { DocumentData, DocumentReference, DocumentSnapshot, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions, WithFieldValue, collection } from "firebase/firestore"
import { ProfilerOnRenderCallback } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const defaultProfilePic = "/unknown-user.png";
const UserCollectionPath = "users"

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

