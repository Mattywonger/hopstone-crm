import { useCollection } from "react-firebase-hooks/firestore"
import { Firebase } from "../providers/user";
import { collection } from "@firebase/firestore";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";

export const Users = () => {
    const { firestore } = Firebase.useContainer();
    const [snapshot, loading, error] = useCollection(collection(firestore, `users`));

    return (
        <div>
            {loading ?
                <LoadingPage /> :

                (
                    error ?
                        <ErrorDisplay error={error} /> :
                        snapshot?.docs.map(doc =>
                            <div key={doc.id}>
                                <p>{doc.data().firstName} {doc.data().lastName}</p>
                            </div>)
                )
            }
        </div>
    )
}