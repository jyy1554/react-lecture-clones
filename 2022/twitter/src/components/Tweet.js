import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Tweet({ tweetObj, isOwner }) {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm(
            "Are you sure you want to delete this tweet?"
        );

        if (ok) {
            //delete tweet
            await deleteDoc(doc(dbService, "tweets", `${tweetObj.id}`));
            tweetObj.attachmentUrl &&
                (await deleteObject(
                    ref(storageService, tweetObj.attachmentUrl) //안의 내용을 따로 변수로 뺄 경우 정상동작하나 계속 오류 뱉음
                ));
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (e) => {
        e.preventDefault();
        const TweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`); //리터럴
        await updateDoc(TweetTextRef, {
            text: newTweet,
        });
        setEditing(false);
    };
    const onChange = (e) => {
        const { value } = e.target;
        setNewTweet(value);
    };
    return (
        <div className="tweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container tweetEdit">
                        <input
                            onChange={onChange}
                            type="text"
                            placeholder="Edit your tweet"
                            value={newTweet}
                            required
                            autoFocus
                            className="formInput"
                        />
                        <input
                            type="submit"
                            value="Update Tweet"
                            className="formBtn"
                        />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{tweetObj.text}</h4>
                    {tweetObj.attachmentUrl && (
                        <img src={tweetObj.attachmentUrl} />
                    )}
                    {isOwner && (
                        <div className="tweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Tweet;
