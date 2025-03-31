import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
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

export default function Tweet({username, tweet, userId, id}: ITweet) {
  const user = auth.currentUser;
  const [edit, setEdit] = useState(false);
  const onDelete = async() => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if(!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch(e) {  
      console.log(e);
    } finally {
    }
  };
  const onEdit = () => setEdit((prev) => !prev);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {!edit ? <Payload>{tweet}</Payload> : <EditTweetForm tweet={tweet} userId={userId} id={id} setEdit={setEdit} />}
        {user?.uid === userId && !edit ? 
          <>
            <EditButton onClick={onEdit}>Edit</EditButton>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </> : null
        }
      </Column>
      <Column>
        <Photo src="/github-logo.svg" />
      </Column>
    </Wrapper>
  );
}