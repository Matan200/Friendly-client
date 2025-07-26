import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyPosts.css"; // עיצוב בסיסי
const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

const MyPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const userEmail = localStorage.getItem("editor"); // המייל של המשתמש
  const storedUser = localStorage.getItem("editor");
  const userEmail = storedUser ? JSON.parse(storedUser).email : null;
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log("🔍 מנסה לשלוף את המשתמש עם המייל:", userEmail);

        // שליפת המשתמש לפי המייל
        const userRes = await axios.get(
          `${API_BASE}/api/users/findByEmail/${userEmail}`
        );
        const user = userRes.data;

        console.log("👤 משתמש שנמצא:", user);

        setUserName(user.userName);
        const postIds = user.posts || [];

        // שליפת כל הפוסטים
        const postsRes = await axios.post(`${API_BASE}/api/posts/byUserType`, {
          email: userEmail,
        });
        const allPosts = postsRes.data;

        console.log("📝 כל הפוסטים שהתקבלו:", allPosts);

        // סינון הפוסטים לפי המשתמש
        const myPosts = allPosts.filter((post) =>
          postIds.some((id) => id.toString() === post._id.toString())
        );

        console.log("✅ הפוסטים של המשתמש:", myPosts);
        alert(myPosts.length);
        setUserPosts(myPosts);
      } catch (error) {
        console.error("❌ שגיאה בשליפת פוסטים:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchUserPosts();
    }
  }, [userEmail]);

  return (
    <div className="main-container">
      <div className="myposts-container">
        <h2>הפוסטים שלי - {userName}</h2>

        {isLoading ? (
          <p>טוען פוסטים...</p>
        ) : userPosts.length === 0 ? (
          <p>לא נמצאו פוסטים.</p>
        ) : (
          userPosts.map((post) => (
            <div key={post._id} className="post-card">
              <h3>{post.subject}</h3>
              <p>{post.postContent}</p>
              <p>
                <strong>תאריך:</strong>{" "}
                {new Date(post.createdAt).toLocaleDateString("he-IL")}
              </p>
              <p>
                <strong>לייקים:</strong> {post.likes}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;
