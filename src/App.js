import './App.css';
import { Button, Form, NavLink, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase-init';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";

const auth = getAuth(app)

function App() {
  const [validated, setValidated] = useState(false);
  const [resigter, setresigter] = useState(false);
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const emailHandeler = (e) => {
    setEmail(e.target.value);
    console.log(email);
  }
  const passwordHandeler = (e) => {
    setPassword(e.target.value)
    console.log(password);
  }
  const checkdHandeler = (e) => {
    setresigter(e.target.checked)
  }

  const fromHandaler = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    e.preventDefault();
    if (resigter) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setError("")
        })
        .catch((error) => {
          setError("Please type reight Password or email");
        });

    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setError("")
          console.log(user);
          verify()
        })
        .catch((error) => {
          setError("Please type reight Password or email");
        });
    }
  };
  const verify = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log("yes");
      });
  }
  const chengeP = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("yes chenge");
      })
  }
  return (
    <div className='mt-5'>
      <Row xl={4}>
      <Form noValidate validated={validated} onSubmit={fromHandaler} className='border p-3 m-auto'>
        {resigter ? <h2 className='text-primary text-center'>Please Login</h2> : <h2 className='text-primary text-center'>Please Register</h2>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" onBlur={emailHandeler} placeholder="Enter email" required />
          <Form.Control.Feedback type="invalid">
            Please provide your Email.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={passwordHandeler} type="password" placeholder="Password" required />
          <Form.Control.Feedback type="invalid">
            Please provide  your password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onClick={checkdHandeler} type="checkbox" label="Allrady register" />
        </Form.Group>
        <Button variant="primary" type="submit">
          {resigter ? "Login" : "Submit"}
        </Button> 
       {resigter && <a className='texr-center text-danger' onClick={chengeP}>reset password</a>}
        <p className='text-danger mt-3 text-center'>{error}</p>
      </Form>
      </Row>
    </div>
  );
}

export default App;
