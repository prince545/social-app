import { createContext, useReducer, useEffect, useContext } from "react";
import { AuthContext } from "./user-auth-store";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
  toggleLikePost: () => {},
});

const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  } else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList];
  } else if (action.type === "LIKE_POST") {
    newPostList = currPostList.map((post) => {
      if (post.id === action.payload.postId) {
        const likedBy = post.likedBy || [];
        const alreadyLiked = likedBy.includes(action.payload.username);
        return {
          ...post,
          likedBy: alreadyLiked
            ? likedBy.filter((u) => u !== action.payload.username)
            : [...likedBy, action.payload.username],
          reactions: alreadyLiked ? post.reactions - 1 : post.reactions + 1,
          liked: !alreadyLiked,
        };
      }
      return post;
    });
  }
  return newPostList;
};

const getInitialPostList = () => {
  const stored = localStorage.getItem("postList");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_POST_LIST;
    }
  }
  return DEFAULT_POST_LIST;
};

// eslint-disable-next-line react/prop-types
const PostListProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [postList, dispatchPostList] = useReducer(
    postListReducer,
    getInitialPostList()
  );

  // Persist postList to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("postList", JSON.stringify(postList));
    } catch (error) {
      console.warn("Failed to save post list to localStorage:", error);
    }
  }, [postList]);

  const addPost = (userId, postTitle, postBody, reactions, tags, image) => {
    if (!currentUser) return;
    dispatchPostList({
      type: "ADD_POST",
      payload: {
        id: String(Date.now()),
        title: postTitle,
        body: postBody,
        reactions: Number(reactions) || 0,
        userId: currentUser.username,
        tags: tags,
        liked: false,
        likedBy: [],
        image: image || null,
        comments: [],
      },
    });
  };

  const deletePost = (postId) => {
    const post = postList.find((p) => p.id === postId);
    if (!currentUser || !post || post.userId !== currentUser.username) return;
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  const toggleLikePost = (postId) => {
    if (!currentUser) return;
    dispatchPostList({
      type: "LIKE_POST",
      payload: { postId, username: currentUser.username },
    });
  };

  return (
    <PostList.Provider value={{ postList, addPost, deletePost, toggleLikePost }}>
      {children}
    </PostList.Provider>
  );
};

const DEFAULT_POST_LIST = [
  {
    id: "1",
    title: "MY HAPPY BIRTHDAY",
    body: "Hi Friends, My Birthday is on 22 October ,I will become 20 years old.",
    reactions: 2,
    userId: "user-9",
    tags: ["BIrthday", "Fun", "Enjoying"],
    liked: false,
    likedBy: [],
    image: null,
    comments: [],
  },
  {
    id: "2",
    title: "learning react",
    body: "i am learning react from youtube channel",
    reactions: 15,
    userId: "user-12",
    tags: ["learnng", "react"],
    liked: false,
    likedBy: [],
    image: null,
    comments: [],
  },
];

export default PostListProvider;