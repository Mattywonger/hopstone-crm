import { doc, updateDoc } from "firebase/firestore";
import { Firebase } from "./user";
import { useDocument } from "react-firebase-hooks/firestore"
import { createContainer } from "unstated-next";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

type UserProfile = {
    firstName: string,
    lastName: string,
    profilePic: string
}

const defaultProfilePic = "/unknown-user.png";

export const useUserProfile = () => {
    const { user, firestore, storage } = Firebase.useContainer();

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
        return updateDoc(document, newProfile)
    }

    const updateProfilePic = (newPic: File) => {
        const path = `profilePics/${user?.uid}`
        // TODO: Make sure that this doesn't overwrite other user's file and to delete images when appropriate
        let fileRef = ref(storage, path)

        // TODO: make sure to check error handling in updating the profile
        return uploadBytes(fileRef, newPic).then((_) => { getDownloadURL(fileRef).then(url => { updateProfile({ profilePic: url }) }) })
    }

    return { loading, error, profile, updateProfile, updateProfilePic }
}

export const Profile = createContainer(useUserProfile)