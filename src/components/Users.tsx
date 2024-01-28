import { useCollection } from "react-firebase-hooks/firestore";
import { Firebase } from "../providers/user";
import { collection, QueryDocumentSnapshot } from "@firebase/firestore";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";
import Header from "./header";



export const Users = () => {
    const { firestore } = Firebase.useContainer();
    const [snapshot, loading, error] = useCollection(collection(firestore, `users`));

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
                {loading ? (
                    <LoadingPage />
                ) : error ? (
                    <ErrorDisplay error={error} />
                ) : (
                    <>
                        <h1 style={{ marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold' }}>Users</h1>
                        <table style={{ width: '80%', textAlign: 'center', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '8px' }}>First Name</th>
                                    <th style={{ padding: '8px' }}>Last Name</th>
                                    {/* Add other headers if needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {snapshot?.docs.sort(sortUsersByLastName).map((doc, index, array) => (
                                    <tr key={doc.id}>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                            {doc.data().firstName}
                                        </td>
                                        <td style={{ borderBottom: array.length - 1 === index ? 'none' : '1px solid #ddd', padding: '8px' }}>
                                            {doc.data().lastName}
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
