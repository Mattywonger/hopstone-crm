import { FormEvent, useState } from 'react'
import { Firebase } from "../providers/user";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ErrorDisplay } from './Error';

export const SignupPage = () => {
    const { auth, firestore } = Firebase.useContainer()

    let [email, setEmail] = useState("")
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [confPassword, setConfPassword] = useState("")
    let [error, setError] = useState<Error>()

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault()

        //check that the information in the forms is valid
        if (password !== confPassword) {
            setError(new Error('Passwords do not match'))
            return
        }

        if (username === "") {
            setError(new Error('Username cannot be empty'))
            return
        }

        createUserWithEmailAndPassword(auth, email, password).then(user => {
            console.log(user)
            console.log(user.user?.uid)
            setDoc(doc(firestore, `users/${user.user?.uid}`), {
                "username": username
            }).catch(setError)
        }).catch(setError)

    }

    return (
        <div>
            <p>Sign Up</p>
            {error && <ErrorDisplay error={error} />}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type={"text"} onChange={event => setEmail(event.target.value)} />
                </label>
                <label>
                    Username:
                    <input type={"text"} onChange={event => setUsername(event.target.value)} />
                </label>
                <label>
                    Password:
                    <input type={"password"} onChange={event => setPassword(event.target.value)} />
                </label>
                <label>
                    Confirm Password:
                    <input type={"password"} onChange={event => setConfPassword(event.target.value)} />
                </label>
                <input type={"submit"} />
            </form>
        </div>
    )
}