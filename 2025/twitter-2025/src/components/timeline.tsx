import { collection, limit, onSnapshot, orderBy, query, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null;
    const fetchTweets = async() => {
      // 어떤 트윗을 원하는지 쿼리를 작성해야함
      const tweetsQuery = query(
        collection(db, "tweets"), 
        orderBy("createdAt", "desc"),
        limit(25),
      );
      /* const snapshot = await getDocs(tweetsQuery);
      const tweets = snapshot.docs.map((doc) => { // map 함수에 의해 array로 반환됨
        const {tweet, userId, username, createdAt} = doc.data();
        return {  // 받은 문서마다 객체를 만듦
          tweet,
          userId, 
          username, 
          createdAt,
          id: doc.id,
        };
      }); */
  
      // 실시간 업데이트를 위해, 위의 getDocs가 아닌 onSnapshot을 이용
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => { // map 함수에 의해 array로 반환됨
          const {tweet, userId, username, createdAt} = doc.data();
          return {  // 받은 문서마다 객체를 만듦
            tweet,
            userId, 
            username, 
            createdAt,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();

    // useEffect는 유저가 화면을 보지 않을 때(언마운트), 값을 반환하면서 cleanup을 실시함
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}