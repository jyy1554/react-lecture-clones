import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import EditNameForm from "../components/edit-name-form";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const EditButton = styled.button`
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

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(null); // firebase storage 유료화되어 이미지 업로드는 생략
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [edit, setEdit] = useState(false);
  const [nickname, setNickname] = useState(user?.displayName ?? "");

  const fetchTweets = async() => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25),
    );

    const snapshot = await getDocs(tweetQuery); // 이것은 실시간 변경이 불필요하여 getDocs로 구현
    const tweets = snapshot.docs.map((doc) => {
      const {tweet, userId, username, createdAt} = doc.data();

      return {
        tweet,
        userId,
        username,
        createdAt,
        id: doc.id,
      };
    });

    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const onEdit = () => setEdit((prev) => !prev);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar) ? <AvatarImg src={avatar} /> : <svg dataSlot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
        </svg>}
      </AvatarUpload>
      <AvatarInput id="avatar" type="file" accept="image/*" />
      <NameWrapper>
        {edit ? 
        <EditNameForm userId={user?.uid ?? ""} setEdit={setEdit} /> 
        : 
        <>
          <Name>{user?.displayName ?? "Anonymous"}</Name>
          <EditButton onClick={onEdit}>Edit</EditButton>
        </>
        }
      </NameWrapper>
      <Tweets>
        {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
      </Tweets>
    </Wrapper>
  );
}