import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase"; // firebase.ts 파일 안에 있음
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  /* type이 submit이면 */
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
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
    </Wrapper>
  );
}