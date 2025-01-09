import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

import "./style.css";
const PostsPage = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [likes, setLikes] = useState({});
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responsePosts = await axios.get(
          "http://localhost:4000/api/posts"
        );
        setPosts(responsePosts.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);
  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };
  const handleSubjectChange = (e) => {
    setNewSubject(e.target.value); // עדכון נושא הפוסט
  };
  const handlePostsubmit = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/posts", {
        subject: newSubject,
        postContent: newPost,
      });
      console.log(response.data);
      setPosts([response.data, ...posts]);
      setNewPost("");
      setNewSubject("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  // const getLikes = async (postId) => {
  //   const res = await axios.get(
  //     `http://localhost:4000/api/posts/${postId}/like`
  //   );
  //   setLikes(res);
  // };
  const handleClickLike = async (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: (prevLikes[postId] || 0) + 1, // הוספת 1 ללייק
    }));
    try {
      const response = await axios.put(
        `http://localhost:4000/api/posts/${postId}/like`
      );
      console.log("Post liked:", response.data);
      const updatedPost = response.data; // התגובה מהשרת מכילה את הפוסט המעודכן
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <div className="wall-container">
      <div className="upper-post-container">
        <input
          className="subject-field"
          type="text"
          value={newSubject}
          onChange={handleSubjectChange}
          placeholder="Enter subject"
        />
        <textarea
          className="text-erea"
          value={newPost}
          onChange={handlePostChange}
          placeholder="What's happening?"
        />
        <Button className="post-button" onClick={handlePostsubmit}>
          post it!
        </Button>
      </div>
      <div className="posts-container">
        {posts?.map((post, index) => {
          return (
            <div key={index} className="post-item">
              <div className="imageUser">
                {/*<image {post.editor.picture}/>*/}
              </div>
              <h3>{post.subject}</h3> {/* הצגת ה- subject */}
              <p>{post.postContent}</p> {/* הצגת תוכן הפוסט */}
              <p>{post.likes}</p>
              <div className="likeBtn">
                <Button onClick={() => handleClickLike(post._id)}>
                  Like 👍<p>{post.likes}</p>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PostsPage;
