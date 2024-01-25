import { doc, setDoc } from "firebase/firestore";
import { Firebase } from "./user";
import { useDocument } from "react-firebase-hooks/firestore"
import { createContainer } from "unstated-next";

type UserProfile = {
    firstName: string,
    lastName: string,
    profilePic: string
}

const defaultProfilePic = "/unknown-user.png";

export const useUserProfile = () => {
    const { user, firestore } = Firebase.useContainer();

    const document = doc(firestore, `users/${user?.uid}`)
    const [snapshot, loading, error] = useDocument(document)

    let profile: UserProfile | null | undefined

    if (snapshot) {
        const data = snapshot.data()
        profile = {
            firstName: data?.firstName,
            lastName: data?.lastName,
            profilePic: data?.profilePic || defaultProfilePic
        }
    }

    const updateProfile = (newProfile: Partial<UserProfile>) => {
        return setDoc(document, newProfile)
    }

    return { loading, error, profile, updateProfile }
}

export const Profile = createContainer(useUserProfile)