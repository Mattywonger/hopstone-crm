import { Firebase } from "../providers/user"
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { ref as storageRef } from 'firebase/storage'
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";

export const PitchDeck = (props: { address: string }) => {
    const { firestore, storage } = Firebase.useContainer()

    const [imageURL, loading, error] = useDownloadURL(storageRef(storage, props.address))

    return (
        loading ? <LoadingPage /> : (error ? <ErrorDisplay error={error} /> : <img src={imageURL} />)
    )
}