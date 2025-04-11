import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "./posts.css";

const PostsPage = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [likes, setLikes] = useState({});
  const [newComment, setNewComment] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [expandedPosts, setExpandedPosts] = useState({});

  const [filterCity, setFilterCity] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterMinAge, setFilterMinAge] = useState("");
  const [filterMaxAge, setFilterMaxAge] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // לפופאפ

  // קבלת מזהה המשתמש המחובר מה-LocalStorage
  const userId = localStorage.getItem("editor");

  // טעינת הפוסטים עם המידע של המשתמשים שפרסמו אותם
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/posts");
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // עדכון תוכן הפוסט
  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  // עדכון נושא הפוסט
  const handleSubjectChange = (e) => {
    setNewSubject(e.target.value);
  };

  // פונקציה לשליפת פוסטים מעודכנים
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/posts");
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // פרסום פוסט חדש
  const handlePostsubmit = async () => {
    if (!userId) {
      alert("You must be logged in to create a post.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/api/posts", {
        editor: userId,
        subject: newSubject,
        postContent: newPost,
      });

      alert("Post created successfully!");
      // alert(response.data);
      // עדכון הפוסטים עם קריאה מחדש כדי לוודא שהפוסט יתווסף ויופיע
      fetchPosts();

      // ריקון השדות של הפוסט החדש
      setNewPost("");
      setNewSubject("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // לייק לפוסט
  const handleClickLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/posts/${postId}/like`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };
  const getUserId = async (email) => {
    if (!email) {
      console.error("No user email found in localStorage");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/findByEmail/${email}`
      );
      alert(response);
      const userid = response.data._id; // ה-`_id` של המשתמש

      return userid; // מחזיר את ה-ID של המשתמש
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };
  // הוספת תגובה לפוסט
  const handleAddComment = async (postId) => {
    //const reeees = getUserId(userId);

    const comment = newComment[postId];
    alert(userId);
    if (!comment) return;

    try {
      const response = await axios.post(
        `http://localhost:4000/api/posts/${postId}/comments`,
        { text: comment, email: userId }
      );
      alert(response.data);

      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      setNewComment({ ...newComment, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const fetchFilteredPosts = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/posts/filter", {
      params: {
        city: filterCity,
        school: filterSchool,
        minAge: filterMinAge,
        maxAge: filterMaxAge,
        subject: filterSubject,
        gender: filterGender,
      },
    });
    setPosts(response.data);
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
  }
};

  // תפריט
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFilter = () => {
    alert("Filter options coming soon!");
  };

  const handleDonate = () => {
    alert("Redirecting to Donate page...");
  };

  const handleProfile = () => {
    alert("Opening My Profile...");
  };

  const handleExtraInfo = () => {
    alert("Showing Extra Info...");
  };
  const toggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      {/* אזור הפוסטים */}
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
            Post It!
          </Button>
        </div>



        <Button onClick={() => setIsFilterOpen(true)}>🔍 סינון פוסטים</Button>

{isFilterOpen && (
  <div className="modal-background">
    <div className="modal-content">
      <h3>סינון פוסטים</h3>

      <input
        type="text"
        placeholder="עיר"
        value={filterCity}
        onChange={(e) => setFilterCity(e.target.value)}
      />

      <input
        type="text"
        placeholder="בית ספר"
        value={filterSchool}
        onChange={(e) => setFilterSchool(e.target.value)}
      />

      <input
        type="number"
        placeholder="גיל מינימלי"
        value={filterMinAge}
        onChange={(e) => setFilterMinAge(e.target.value)}
      />

      <input
        type="number"
        placeholder="גיל מקסימלי"
        value={filterMaxAge}
        onChange={(e) => setFilterMaxAge(e.target.value)}
      />

      <input
        type="text"
        placeholder="נושא הפוסט"
        value={filterSubject}
        onChange={(e) => setFilterSubject(e.target.value)}
      />

      <select
        value={filterGender}
        onChange={(e) => setFilterGender(e.target.value)}
      >
        <option value="">בחר מגדר</option>
        <option value="male">MALE</option>
        <option value="female">FEMALE</option>
        <option value="other">OTHER</option>
      </select>

      <div className="filter-buttons-container">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            fetchFilteredPosts();
            setIsFilterOpen(false);
          }}
        >
          סנן
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setIsFilterOpen(false)}
        >
          ביטול
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setFilterCity("");
            setFilterSchool("");
            setFilterMinAge("");
            setFilterMaxAge("");
            setFilterSubject("");
            setFilterGender("");
            fetchPosts(); // שליפה מחדש של כל הפוסטים
            setIsFilterOpen(false); // סגירת הפופאפ
          }}
        >
          איפוס סינון
        </Button>
      </div>
    </div>
  </div>
)}





        <div className="posts-container">
          {posts?.map((post) => (
            <div key={post._id} className="post-item">
              <h3>{post.subject}</h3>
              <p>{post.postContent}</p>
              <p>Posted by: {post.editor?.userName || "Unknown User"}</p>
              <p>
  Posted on:{" "}
  {new Date(post.createdAt).toLocaleString("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  })}
</p>
              <div className="comment-section">
                <textarea
                  className="comment-field"
                  placeholder="Write a comment..."
                  value={newComment[post._id] || ""}
                  onChange={(e) =>
                    setNewComment({ ...newComment, [post._id]: e.target.value })
                  }
                ></textarea>
                <Button onClick={() => handleAddComment(post._id)}>
                  Add Comment
                </Button>

                <div className="likeBtn">
                  <Button onClick={() => handleClickLike(post._id)}>
                    👍 Like
                  </Button>
                  <p>{post.likes} Likes</p>
                </div>
                
                <div className="comments">
                  {post.comments
                    ?.slice(
                      0,
                      expandedPosts[post._id] ? post.comments.length : 2
                    )
                    .map((comment) => (
                      <div
                        key={comment._id || comment.text}
                        className="comment-item"
                      >
                        <p>{comment.text}</p>
                        <p>
                          POSTED BY: {comment.user?.userName || "Unknon User"}
                        </p>
                      </div>
                    ))}
                  {post.comments?.length > 2 && (
                    <Button onClick={() => toggleComments(post._id)}>
                      {expandedPosts[post._id]
                        ? "הסתר תגובות"
                        : "הצג עוד תגובות"}
                    </Button>
                  )}
                </div>
              </div>
              <div className="report-button">
              <Button style={{ color: "red" }}>REPORT</Button>

                  </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
