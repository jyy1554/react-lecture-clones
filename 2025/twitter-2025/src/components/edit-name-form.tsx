import styled from "styled-components";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useState } from "react";

interface Props {
  userId: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = styled.form`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Input = styled.input``;

const EditButton = styled.input`
  background-color: gray;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
`;

export default function EditNameForm({userId, setEdit}: Props) {
  const user = auth.currentUser;
  const [nickname, setNickname] = useState(user?.displayName ?? "Anonymous");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!user || user.uid !== userId) return;

    try {
      await updateProfile(user, {
        displayName: nickname,
      })
      setEdit(false);
    } catch(e) {
      console.log(e);
    } finally {
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input maxLength={10} onChange={onChange} value={nickname} autoFocus />
      <EditButton type="submit" value="Edit" />
    </Form>
  );
}