import { CollectionReference, DocumentReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, updateDoc } from "firebase/firestore"
import { User } from "../lib/users"
import { useCollection } from "react-firebase-hooks/firestore"

export const PodCollectionPath = 'pods'

type PodCollection = {
    pods: Array<Pod>,
    ref: CollectionReference
}

type Pod = {
    data: PodData,
    ref: DocumentReference
}

type PodData = {
    leader: DocumentReference,
    members: Array<DocumentReference>,
    deals: Array<DocumentReference>
}

export const podConverter: FirestoreDataConverter<Pod> = {
    toFirestore(pod: Pod) {
        return pod.data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Pod {
        const data = snapshot.data(options);
        return {
            data: {
                leader: data.leader,
                members: data.members,
                deals: data.deals
            },
            ref: snapshot.ref
        }
    }
}

export const usePods = (firestore: Firestore, path: string): [PodCollection, boolean, Error | undefined] => {
    const podCollection = collection(firestore, path).withConverter(podConverter)
    const [pods, loading, error] = useCollection(podCollection)

    return [{ pods: pods != undefined ? pods?.docs.map(doc => doc.data()) : [], ref: podCollection }, loading, error]
}

export const makePodLeader = (user: User, podCollection: PodCollection): Promise<void | DocumentReference> => (
    addDoc(podCollection.ref, {
        data: {
            leader: user.ref,
            members: [],
            deals: []
        }
    }).then(pod =>
        updateDoc(user.ref, { pod: pod }))
)

export const findPod = (ref: DocumentReference, podCollection: PodCollection): Pod | null => (
    podCollection.pods.find(pod => (pod.ref.id == ref.id)) || null
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

export const addDeal = (pod: DocumentReference, deal: DocumentReference): Promise<void> => (
    updateDoc(pod, { deals: arrayUnion(deal) })
)

// Unassigns a user as a member of a pod
// Removes the reference to the pod from the user if deleteRef is true
export const unassign = (user: User): Promise<[] | [void, void]> => {
    const pod = user.profile.pod
    return Promise.all(
        pod == undefined ? [] : [
            updateDoc(pod, { members: arrayRemove(user.ref) }),
            updateDoc(user.ref, { pod: deleteField() })
        ])
}

