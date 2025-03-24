import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // 랜덤 uid를 만들어주는 npm 패키지
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function TweetFactory({ userObj }) {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

    const onSubmit = async (e) => {
        if (tweet === "") {
            return;
        }
        e.preventDefault();
        let attachmentUrl = "";

        if (attachment !== "") {
            const attachmentRef = ref(
                storageService,
                `${userObj.uid}/${uuidv4()}`
            ); //storage에 이미지 폴더 생성하는 코드. uuidv4는 랜덤 uid를 만들어주는 함수
            const response = await uploadString(
                attachmentRef,
                attachment,
                "data_url"
            ); //위에 만든 폴더에 이미지 넣기. return으로 UploadTaskSnapshot을 받음.
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await addDoc(collection(dbService, "tweets"), tweetObj);
        setTweet("");
        setAttachment("");
        fileInput.current.value = "";
    };
    const onChange = (e) => {
        const { value } = e.target;
        setTweet(value);
    };
    const onFileChange = (e) => {
        const { files } = e.target;
        if (files) {
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                //리스너 만들기
                const {
                    currentTarget: { result },
                } = finishedEvent;
                setAttachment(result);
            };
            reader.readAsDataURL(theFile);
        }
    };
    const onClearAttachment = () => {
        setAttachment("");
        fileInput.current.value = "";
    };

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input
                    type="submit"
                    value="&rarr;"
                    className="factoryInput__arrow"
                />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={fileInput}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{ backgroundImage: attachment }}
                    />
                    <div
                        className="factoryForm__clear"
                        onClick={onClearAttachment}
                    >
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
}

export default TweetFactory;
