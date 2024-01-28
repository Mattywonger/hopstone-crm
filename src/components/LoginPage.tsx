import { useState } from "react";
import { Firebase } from "../providers/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import LoginSignupHeader from "./LoginSignupHeader"; 
import { Button } from "./ui/button"; 
import { Input } from "./ui/input"; 
import { Label } from "./ui/label"; 
import { toast } from "./ui/use-toast";
import { FirebaseError } from "firebase/app";


export const LoginPage = () => {
    const { auth } = Firebase.useContainer();

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [emailError, setEmailError] = useState(false);
    let [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        let hasError = false;

        if (email === "") {
            setEmailError(true);
            hasError = true;
        }

        if (password === "") {
            setPasswordError(true);
            hasError = true;
        }



        if(hasError === true) {
            toast({
                variant: "destructive",
                title: "Sorry! Email or Password is missing/invalid! 🙁",
                description: `Please reenter your correct email and password.`,
            });
            return;
    }
    

    signInWithEmailAndPassword(auth, email, password)
    .then(() => navigate("/"))
    .catch((error: FirebaseError) => {
        if (error.code === 'auth/invalid-credential') {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Incorrect email or password. Please try again.",
            });
            setEmailError(true);
            setPasswordError(true);
        } else {
            // Handle other types of errors
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    });
}

    const inputStyle = (error: boolean) => ({
        borderColor: error ? 'red' : 'black'
    });

    return (
        <div>
            <LoginSignupHeader />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '1.60rem', marginBottom: '35px' }}>Login</p>
                    <form onSubmit={handleSubmit}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="text" style={inputStyle(emailError)} onChange={event => setEmail(event.target.value)} />
                        <br />
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" style={inputStyle(passwordError)} onChange={event => setPassword(event.target.value)} />
                        <br />
                        <Button type="submit" variant="default" style={{ marginTop: '20px' }}>Submit</Button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}
