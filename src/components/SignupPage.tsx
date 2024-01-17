import { FormEvent, useState } from 'react';
import { useNavigate } from "react-router"; 
import { Firebase } from "../providers/user";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LoginSignupHeader from './LoginSignupHeader'; 
import { Button } from './ui/button'; 
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 
import { toast } from './ui/use-toast';

export const SignupPage = () => {
    const { auth, firestore } = Firebase.useContainer();
    const navigate = useNavigate(); 

    let [email, setEmail] = useState("");
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [password, setPassword] = useState("");
    let [confPassword, setConfPassword] = useState("");
    let [emailError, setEmailError] = useState(false);
    let [firstNameError, setFirstNameError] = useState(false);
    let [lastNameError, setLastNameError] = useState(false);
    let [passwordError, setPasswordError] = useState(false);
    let [confPasswordError, setConfPasswordError] = useState(false);

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault();
        setEmailError(false);
        setFirstNameError(false);
        setLastNameError(false);
        setPasswordError(false);
        setConfPasswordError(false);
        let hasError = false;

        if (password !== confPassword) {
            setConfPasswordError(true);
            setPasswordError(true);
            hasError = true;
        }

        if (firstName === "") {
            setFirstNameError(true);
            hasError = true;
        }

        if (lastName === "") {
            setLastNameError(true);
            hasError = true;
        }

        if (email === "") {
            setEmailError(true);
            hasError = true;
        }

        if (password === "") {
            setPasswordError(true);
            hasError = true;
        }

        if (confPassword === "") {
            setConfPasswordError(true);
            hasError = true;
        }

        if(!email.includes('@')) {
            setEmailError(true);
            hasError = true;
        }
    

        if(hasError === true) {
            toast({
                variant: "destructive",
                title: "Sorry! One or more fields are missing/invalid! 🙁",
                description: `Please make sure there are no errors in your information.`,
            });
            return;
        
    }
        
    createUserWithEmailAndPassword(auth, email, password).then(user => {
        setDoc(doc(firestore, `users/${user.user?.uid}`), {
            "firstName": firstName,
            "lastName": lastName
        })
        .then(() => {
            navigate("/login"); 
        })
        .catch((error: Error) => {
            
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: error.message,
            });
            
        });   
    }).catch((error: Error) => {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: error.message,
        });
        
    });
}

const inputStyle = (error: boolean) => ({
    borderColor: error ? 'red' : 'black'
});
    return (
        <div>
            <LoginSignupHeader /> 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 70px)' }}>
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '1.60rem', marginBottom: '35px' }}>Sign Up</p>
                    <form onSubmit={handleSubmit}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="text" style={inputStyle(emailError)} onChange={(event) => setEmail(event.target.value)} />
                        <br />
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" type="text" style={inputStyle(firstNameError)} onChange={(event) => setFirstName(event.target.value)} />
                        <br />
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" type="text" style={inputStyle(lastNameError)} onChange={(event) => setLastName(event.target.value)} />
                        <br />
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" style={inputStyle(passwordError)} onChange={(event) => setPassword(event.target.value)} />
                        <br />
                        <Label htmlFor="confPassword">Confirm Password</Label>
                        <Input id="confPassword" type="password" style={inputStyle(confPasswordError)} onChange={(event) => setConfPassword(event.target.value)} />
                        <br />
                        <Button type="submit" variant="default" style={{ marginTop: '20px' }}>Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
