import { useState } from "react";
import { auth } from "../firebase"; // firebase.ts 파일 안에 있음
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: {name, value} } = e;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // 입력값이 비어있으면
    if(isLoading || email === "" || password === "") {
      return; // kill the function
    }
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
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
    console.log(email, password);
  };

  return (
    <Wrapper>
      <Title>Log into X</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
        <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}