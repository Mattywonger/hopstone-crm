import { CollectionReference, DocumentReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { User } from "../lib/users"
import { useCollection } from "react-firebase-hooks/firestore"

type Pod = {
    data: PodData,
    ref: DocumentReference
}

type PodData = {
    leader: DocumentReference,
    members: Array<DocumentReference>
}

const podConverter: FirestoreDataConverter<Omit<Pod, "ref">> = {
    toFirestore(pod: Pod) {
        return pod.data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Pod {
        const data = snapshot.data(options);
        return {
            data: {
                leader: data.leader,
                members: data.members
            },
            ref: snapshot.ref
        }
    }
}

export const makePodLeader = (user: User, podCollection: CollectionReference): Promise<void | DocumentReference> => (
    addDoc(podCollection, {
        data: {
            leader: user.ref,
            members: [],
        }
    }).then(pod =>
        updateDoc(user.ref, { pod: pod }))
)

// Deletes a pod: does not remove users
export const deletePod = (pod: Pod): Promise<void> => (
    deleteDoc(pod.ref)
)

export const podLeader = (pod: Pod): DocumentReference => (
    pod.data.leader
)

// Assigned a user to a pod
// Note: unassign the user first
export const assignToPod = (user: User, pod: Pod): Promise<[... void[], void, void]> => (
    Promise.all([
        ...user.profile.pod != null ? [updateDoc(user.profile.pod, { members: arrayRemove(user.ref) })] : [],
        updateDoc(pod.ref, { members: arrayUnion(user.ref) }),
        updateDoc(user.ref, { pod: pod.ref })
    ])
)

// Unassigns a user from a pod
// Removes the reference to the pod from the user if deleteRef is true
export const unassign = (user: User): Promise<[] | [void, void]> => {
    const pod = user.profile.pod
    return Promise.all(
        pod == undefined ? [] : [
            updateDoc(pod, { members: arrayRemove(user.ref) }),
            updateDoc(user.ref, { pod: deleteField() })
        ])
}

