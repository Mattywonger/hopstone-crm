import { doc, updateDoc } from "firebase/firestore";
import { Firebase } from "./user";
import { useDocument } from "react-firebase-hooks/firestore"
import { createContainer } from "unstated-next";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { UserProfile } from "firebase/auth";
import { userConverter } from "../lib/users";




export const useUserProfile = () => {
    const { user, firestore, storage } = Firebase.useContainer();

    const document = doc(firestore, `users/${user?.uid}`).withConverter(userConverter)
    const [snapshot, loading, error] = useDocument(document)

    const profile = snapshot?.data()

    const updateProfile = (newProfile: Partial<UserProfile>) => {
        return updateDoc(document, { newProfile })
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