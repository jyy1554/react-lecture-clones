import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase"; // firebase.ts 파일 안에 있음
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";
import styled from "styled-components";

// const errors = {
//   "auth/email-already-in-use": "That email already exists.",
// };

const Error = styled.div`
`;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: {name, value} } = e;

    if(name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // 입력값이 비어있으면
    if(isLoading || name === "" || email === "" || password === "") {
      return; // kill the function
    }
    try {
      setIsLoading(true);
      // create an account
      const credentials = await createUserWithEmailAndPassword(auth, email, password);  // test, test@test.com, 1234qwer!
      console.log(credentials.user);
      // set the name of the user at Profile
      await updateProfile(credentials.user, {
        displayName: name,
      });
      
      // redirect to the home page
      navigate("/");
    } catch(e) {
      // setError
      if(e instanceof FirebaseError) {  // FirebaseError는 클래스임
        // console.log(e.code, e.message); // e.message만 봐도 되나 e.code를 이용하여 사용자에게 친절한 메세지를 줄수도 있음 (최상단 errors 객체 참고)
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join X</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required />
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
        <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account?{" "}
        <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}