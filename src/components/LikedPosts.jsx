import { useContext } from "react";
import { PostList as PostListData } from "../store/post-list-store";
import { AuthContext } from "../store/user-auth-store";
import Post from "./Post";

const LikedPosts = () => {
  const { postList } = useContext(PostListData);
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) return null;
  const likedPosts = postList.filter(
    (post) => post.likedBy && post.likedBy.includes(currentUser.username)
  );
  if (likedPosts.length === 0) {
    return <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>You haven't liked any posts yet.</div>;
  }
  return (
    <>
      {likedPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};

export default LikedPosts; 