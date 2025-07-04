import { useContext, useRef, useState } from "react";
import { PostList } from "../store/post-list-store";
import { AuthContext } from "../store/user-auth-store";

const CreatePost = () => {
  const { addPost } = useContext(PostList);
  const { currentUser } = useContext(AuthContext);

  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const reactionsElement = useRef();
  const tagsElement = useRef();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      // Check file size (limit to 2MB for post images)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB. Please choose a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image for posts
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions for post images
          const maxWidth = 800;
          const maxHeight = 600;
          
          let { width, height } = img;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          setImage(compressedDataUrl);
          setImagePreview(compressedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    const reactions = reactionsElement.current.value;
    const tags = tagsElement.current.value.split(" ").filter(tag => tag.trim() !== "");

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    postTitleElement.current.value = "";
    postBodyElement.current.value = "";
    reactionsElement.current.value = "";
    tagsElement.current.value = "";
    setImage(null);
    setImagePreview(null);

    addPost(currentUser.username, postTitle, postBody, reactions, tags, image);
    setIsSubmitting(false);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  if (!currentUser) {
    return (
      <div className="create-post-container">
        <div className="create-post-card">
          <div className="create-post-warning">
            <span className="warning-icon">⚠️</span>
            <p>You must be logged in to create a post.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <div className="create-post-header">
          <div className="create-post-avatar">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" />
            ) : (
              <span>{currentUser.username[0].toUpperCase()}</span>
            )}
          </div>
          <div className="create-post-user-info">
            <h3>Create a Post</h3>
            <p>Share your thoughts with the community, {currentUser.username}!</p>
          </div>
        </div>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              <span className="label-icon">📝</span>
              Post Title
            </label>
            <input
              type="text"
              ref={postTitleElement}
              className="form-control create-input"
              id="title"
              placeholder="What's on your mind today?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body" className="form-label">
              <span className="label-icon">💭</span>
              Post Content
            </label>
            <textarea
              ref={postBodyElement}
              rows="4"
              className="form-control create-textarea"
              id="body"
              placeholder="Tell us more about your thoughts, experiences, or share something interesting..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reactions" className="form-label">
                <span className="label-icon">❤️</span>
                Reactions Count
              </label>
              <input
                type="number"
                ref={reactionsElement}
                className="form-control create-input"
                id="reactions"
                placeholder="0"
                min="0"
                defaultValue="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                <span className="label-icon">🏷️</span>
                Hashtags
              </label>
              <input
                type="text"
                className="form-control create-input"
                id="tags"
                ref={tagsElement}
                placeholder="fun life social"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="postImage" className="form-label">
              <span className="label-icon">📷</span>
              Add Image (Optional)
            </label>
            <div className="image-upload-container">
              <input
                type="file"
                className="form-control create-file-input"
                id="postImage"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`create-post-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating Post...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;