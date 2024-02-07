import { DocumentReference, Firestore, QueryDocumentSnapshot, QuerySnapshot, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, updateDoc } from "firebase/firestore"
import { useState } from "react"

const usePods = (firestore: Firestore, pods: QuerySnapshot | undefined, users: QuerySnapshot | undefined) => {
    const [error, setError] = useState<Error>()
    const podCollection = collection(firestore, 'pods')

    const makePodLeader = (user: DocumentReference) => {

        addDoc(podCollection, {
            leader: user,
            members: [],
            deals: []
        }).then(pod =>
            updateDoc(user, { pod: pod }))
            .catch(setError)
    }

    const deletePod = (user: QueryDocumentSnapshot) => {
        const pod = pods?.docs.find(doc => doc.id == user.data().pod.id)

        Promise.all([
            updateDoc(user.ref, { pod: deleteField() }),
            pod?.data().members.map((member: DocumentReference) => (
                updateDoc(member, { pod: deleteField() })
            )),
            (pod != undefined && deleteDoc(pod.ref))
        ]).catch(setError)
    }

    const podLeader = (pod: DocumentReference) => {
        const leaderRef = pods?.docs.find(doc => doc.id === pod.id)?.data().leader
        if (leaderRef == undefined)
            return undefined;

        else return users?.docs.find(doc => doc.id == leaderRef.id)
    }

    const assignToPod = (user: QueryDocumentSnapshot, pod: DocumentReference) => {
        unassign(user)
        Promise.all([
            updateDoc(pod, { members: arrayUnion(user.ref) }),
            updateDoc(user.ref, { pod })
        ]).catch(setError)
    }

    const unassign = (user: QueryDocumentSnapshot) => {
        const pod = user.data().pod
        if (pod == undefined) return;
        Promise.all([
            updateDoc(pod, { members: arrayRemove(user.ref) }),
            updateDoc(user.ref, { pod: deleteField() })
        ])
    }

    return { error, makePodLeader, deletePod, assignToPod, podLeader, unassign }
}

export default usePods;