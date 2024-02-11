import { useCollection } from "react-firebase-hooks/firestore";
import { Firebase } from "../providers/user";
import { collection, QueryDocumentSnapshot } from "@firebase/firestore";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";
import Header from "./header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { podConverter } from "../lib/pods";
import { useState } from "react";



export const Users = () => {
    const { firestore } = Firebase.useContainer();
    const [users, loadingUsers, userError] = useCollection(collection(firestore, `users`));

    const podCollection = collection(firestore, 'pods')
    const [pods, loadingPods, podError] = useCollection(podCollection.withConverter(podConverter))

    const [callbackError, setCallbackError] = useState<Error>()

    const loading = loadingUsers || loadingPods
    const error = userError || podError || callbackError

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
                                        {users?.docs.sort(sortUsersByLastName).map((user, index, array) => (
                                            <tr key={user.id}>
                                        <td>
                                                    <img width={50} height={50} src={user.data().profilePic} />
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                            {user.data().firstName}
                                            {user.data().isAdmin && (" (admin) ")}
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                            {user.data().lastName}
                                        </td>
                                        <td>
                                            {(user.data().pod && podLeader(user.data().pod)?.id == user.id) ?
                                                <>
                                                    <p>Pod Leader</p>
                                                    <Button onClick={event => { event.preventDefault; deletePod(user) }}>Delete Pod</Button>
                                                </> :
                                                <>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button>{user.data().pod == undefined ? "Not Assigned" : podLeader(user.data().pod)?.data().firstName}</Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {
                                                                pods?.docs.filter(pod => pod.data().leader).map((pod, index, array) => (
                                                                    <DropdownMenuItem asChild id={pod.id}>
                                                                        <Button onClick={() => assignToPod(user, pod.ref)}>{podLeader(pod.ref)?.data().firstName}</Button>
                                                                    </DropdownMenuItem>
                                                                ))
                                                            }
                                                            {user.data().pod != undefined && <DropdownMenuItem asChild>
                                                                <Button onClick={() => unassign(user)}>Unassign</Button>
                                                            </DropdownMenuItem>}
                                                            <DropdownMenuItem asChild>
                                                                <Button onClick={event => {
                                                                    event.preventDefault();
                                                                            unassign(user);
                                                                            makePodLeader(user)
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
