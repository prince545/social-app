import { useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

import { PostList } from "../store/post-list-store";
import { AuthContext } from "../store/user-auth-store";

const Post = ({ post }) => {
  const { deletePost, toggleLikePost } = useContext(PostList);
  const { currentUser } = useContext(AuthContext);
  const [burst, setBurst] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }
    toggleLikePost(post.id);
  };

  const isLiked = post.likedBy && currentUser && post.likedBy.includes(currentUser.username);
  const canDelete = currentUser && post.userId === currentUser.username;
  const userInitial = post.userId ? post.userId[0].toUpperCase() : "U";

  return (
    <div className="card post-card">
      <div className="card-body">
        <div className="user-row">
          <div className="avatar">{userInitial}</div>
          <span>Posted by <b>{post.userId}</b></span>
        </div>
        <h5 className="card-title">
          {post.title}
          {canDelete && (
            <span
              className="btn position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              onClick={handleDelete}
              style={{ cursor: "pointer" }}
              aria-label={`Delete post titled "${post.title}"`}
            >
              {/* Delete icon can be added here */}
            </span>
          )}
        </h5>
        {post.image && (
          <div className="post-image-preview mb-3">
            <img src={post.image} alt="Post" style={{ maxWidth: 320, maxHeight: 220, borderRadius: 14, boxShadow: "0 2px 8px #6d28d922" }} />
          </div>
        )}
        <p className="card-text">{post.body}</p>
        {post.tags.map((tag) => (
          <span key={tag} className="badge text-bg-primary hashtag">
            {tag}
          </span>
        ))}
        <div className="alert alert-success reactions d-flex align-items-center justify-content-between" role="alert">
          <span>This post has been reacted by {post.reactions} people.</span>
          <span className="like-heart-container">
            <button
              className="like-heart-btn"
              onClick={handleLike}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              disabled={!currentUser}
            >
              <span className={`like-heart-icon small${isLiked ? " liked" : ""}`}>{isLiked ? "❤️" : "🤍"}</span>
              <span className="like-label">Like</span>
            </button>
            {burst && <span className="heart-burst">
              {[...Array(6)].map((_, i) => (
                <span key={i} className={`burst-heart burst-heart-${i}`}>❤️</span>
              ))}
            </span>}
          </span>
        </div>
      </div>
    </div>
  );
};

// Define prop types for the component
Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    reactions: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Post;
