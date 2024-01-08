import { useState } from "react"
import { User } from "../providers/user"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router"

export const LoginPage = () => {
    const { auth } = User.useContainer()

    let [error, setError] = useState<Error | null>()
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (event: any) => {
        event.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigate("/"))
            .catch((error: Error) => {
                setError(error)
            })
    }

    return (
        <div>
            <p>Login</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type={"text"} onChange={event => setEmail(event.target.value)} />
                </label>
                <label>
                    Password:
                    <input type={"password"} onChange={event => setPassword(event.target.value)} />
                </label>
                <input type={"submit"} />
            </form>
            {error ?
                <p>An error occurred: {error.message}</p> :
                <p>All is good</p>
            }
        </div>
    )
}