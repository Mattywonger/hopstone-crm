import { useCollection } from "react-firebase-hooks/firestore";
import { Firebase } from "../providers/user";
import { collection, QueryDocumentSnapshot } from "@firebase/firestore";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";
import Header from "./header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { assignToPod, deletePod, findPod, makePodLeader, PodCollectionPath, podConverter, podLeader, unassign, usePods } from "../lib/pods";
import { useState } from "react";
import { findUser, User, UserCollectionPath, useUsers } from "../lib/users";
import { deleteField, updateDoc } from "firebase/firestore";



export const Users = () => {
    const { firestore } = Firebase.useContainer();

    const [users, loadingUsers, userError] = useUsers(firestore, UserCollectionPath)
    const [pods, loadingPods, podError] = usePods(firestore, PodCollectionPath)

    const [callbackError, setCallbackError] = useState<Error>()

    const loading = loadingUsers || loadingPods
    const error = userError || podError || callbackError

    // Function to sort users by last name with explicit types
    const sortUsersByLastName = (a: User, b: User) => {
        const nameA = a.profile.lastName.toUpperCase();
        const nameB = b.profile.lastName.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    };

    const handleDeletePod = (user: User) => {
        if (user.profile.pod == null) return;
        const pod = findPod(user.profile.pod, pods)

        if (pod == null) return;

        Promise.all([
            deletePod(pod),
            updateDoc(user.ref, { pod: deleteField() }),
            ...pod.data.members.map(member => updateDoc(member, { pod: deleteField() }))
        ]).catch(setCallbackError)
    }

    const findPodLeader = (user: User) => {
        if (user.profile.pod == null) return null;
        const pod = findPod(user.profile.pod, pods)

        if (pod == null) return null;
        return findUser(pod.data.leader, users)
    }

    return (
        <div>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', marginTop: '100px' }}>
                {loading ? <LoadingPage /> :
                    (error) ? (
                        <ErrorDisplay error={error} />
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
                                        {users.users.sort(sortUsersByLastName).map((user, index, array) => (
                                            <tr key={user.ref.id}>
                                        <td>
                                                    <img width={50} height={50} src={user.profile.profilePic} />
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                                    {user.profile.firstName}
                                                    {user.profile.isAdmin && (" (admin) ")}
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                                    {user.profile.lastName}
                                        </td>
                                        <td>
                                                    {(user.profile.pod != null && findPod(user.profile.pod, pods)?.data.leader.id == user.ref.id) ?
                                                <>
                                                    <p>Pod Leader</p>
                                                            <Button onClick={event => { event.preventDefault; handleDeletePod(user) }}>Delete Pod</Button>
                                                </> :
                                                <>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                                    <Button>{user.profile.pod == undefined ? "Not Assigned" : findPodLeader(user)?.profile.firstName}</Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {
                                                                        pods.pods.filter(pod => pod.data.leader).map((pod, index, array) => (
                                                                            <DropdownMenuItem asChild id={pod.ref.id}>
                                                                                <Button onClick={() => { if (user.profile.pod) { unassign(user); } assignToPod(user, pod) }}>
                                                                                    {findUser(pod.data.leader, users)?.profile.firstName}
                                                                                </Button>
                                                                    </DropdownMenuItem>
                                                                ))
                                                            }
                                                                    {user.profile.pod != undefined && <DropdownMenuItem asChild>
                                                                <Button onClick={() => unassign(user)}>Unassign</Button>
                                                            </DropdownMenuItem>}
                                                            <DropdownMenuItem asChild>
                                                                <Button onClick={event => {
                                                                    event.preventDefault();
                                                                            unassign(user);
                                                                            makePodLeader(user, pods)
                                                                }
                                                                }>
                                                                    Make Pod Leader
                                                                </Button>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </>}
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
