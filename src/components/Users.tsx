import { useCollection } from "react-firebase-hooks/firestore";
import { Firebase } from "../providers/user";
import { collection, QueryDocumentSnapshot } from "@firebase/firestore";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";
import Header from "./header";
import { defaultProfilePic } from "../providers/userProfile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { addDoc, arrayUnion, deleteDoc, deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } from "firebase/messaging/sw";



export const Users = () => {
    const { firestore } = Firebase.useContainer();
    const [snapshot, loadingUsers, error] = useCollection(collection(firestore, `users`));
    const podCollection = collection(firestore, 'pods')
    const [pods, loadingPods, podError] = useCollection(podCollection)
    const [createPodError, setCreatePodError] = useState<Error>()

    // Function to sort users by last name with explicit types
    const sortUsersByLastName = (a: QueryDocumentSnapshot, b: QueryDocumentSnapshot) => {
        const nameA = a.data().lastName.toUpperCase();
        const nameB = b.data().lastName.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    };

    const makePodLeader = (uid: string) => {

        // TODO: Should have a consistent system for referncing other documents
        // IF not using firestore references can unchain

        addDoc(podCollection, {
            leader: uid,
            members: []
        }).then(pod =>
            updateDoc(doc(firestore, `users/${uid}`), { pod: pod.id }))
            .catch(setCreatePodError)
    }

    // Careful: this takes the UID of the pod leader
    const deletePod = (uid: string) => {
        const podid = snapshot?.docs.find(doc => doc.id == uid)?.data().pod
        const members = pods?.docs.find(doc => doc.id == podid)?.data().members

        Promise.all([
            updateDoc(doc(firestore, `users/${uid}`), { pod: deleteField() }),
            members.map((memberid: string) => (
                updateDoc(doc(firestore, `users/${memberid}`), { pod: deleteField() })
            )),
            deleteDoc(doc(firestore, `pods/${podid}`))
        ]).catch(setCreatePodError)
    }

    const podLeader = (podid: string) => {
        const leaderUid = pods?.docs.find(doc => doc.id === podid)?.data().leader
        if (leaderUid == undefined)
            return undefined;

        else return snapshot?.docs.find(doc => doc.id == leaderUid)

    }

    const assignToPod = (uid: string, podid: string) => {
        Promise.all([
            updateDoc(doc(firestore, `pods/${podid}`), { members: arrayUnion(uid) }),
            updateDoc(doc(firestore, `users/${uid}`), { pod: podid })
        ]).catch(setCreatePodError)
    }

    return (
        <div>
            <Header />
            {createPodError && <ErrorDisplay error={createPodError} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', marginTop: '100px' }}>
                {(loadingUsers || loadingPods) ? (
                    <LoadingPage />
                ) : (error || podError) ? (
                    <ErrorDisplay error={error || podError} />
                ) : (
                    <>
                        <h1 style={{ marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold' }}>Users</h1>
                        <table style={{ width: '80%', textAlign: 'center', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                            <th style={{ padding: '2px' }}></th>
                                    <th style={{ padding: '8px' }}>First Name</th>
                                    <th style={{ padding: '8px' }}>Last Name</th>
                                            <th style={{ padding: '8px' }}>Pod Leader</th>
                                    {/* Add other headers if needed */}
                                </tr>
                            </thead>
                            <tbody>
                                        {snapshot?.docs.sort(sortUsersByLastName).map((user, index, array) => (
                                            <tr key={user.id}>
                                        <td>
                                                    <img width={50} height={50} src={user.data().profilePic || defaultProfilePic} />
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                                    {user.data().firstName}
                                                    {user.data().isAdmin && (" (admin) ")}
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                                    {user.data().lastName}
                                                </td>
                                                <td>
                                                    {podLeader(user.data().pod)?.id == user.id ?
                                                        <>
                                                            <p>Pod Leader</p>
                                                            <Button onClick={event => { event.preventDefault; deletePod(user.id) }}>Delete Pod</Button>
                                                        </> :
                                                        <>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <p>{user.data().pod == undefined ? "Not Assigned" : podLeader(user.data().pod)?.data().firstName}</p>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    {
                                                                        pods?.docs.filter(pod => pod.data().leader).map((pod, index, array) => (
                                                                            <DropdownMenuItem asChild id={pod.id}>
                                                                                <Button onClick={() => assignToPod(user.id, pod.id)}>{podLeader(pod.id)?.data().firstName}</Button>
                                                                            </DropdownMenuItem>
                                                                        ))
                                                                    }
                                                                    <DropdownMenuItem asChild>
                                                                        <Button onClick={() => updateDoc(
                                                                            doc(firestore, `users/${user.id}`), { pod: deleteField() })
                                                                            .catch(setCreatePodError)}>Unassign</Button>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                            <Button onClick={event => { event.preventDefault(); makePodLeader(user.id) }}>Make Pod Leader</Button></>}
                                        </td>
                                        {/* Add other data cells if needed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default Users;
