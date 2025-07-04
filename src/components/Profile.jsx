import { useContext, useState } from "react";
import { AuthContext } from "../store/user-auth-store";
import "../App.css";

const Profile = () => {
  const { currentUser, users, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(currentUser?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || null);
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || "");
  const [bio, setBio] = useState(currentUser?.bio || "");

  if (!currentUser) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        alert("Image size must be less than 1MB. Please choose a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions
          const maxWidth = 150;
          const maxHeight = 150;
          
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setAvatar(compressedDataUrl);
          setAvatarPreview(compressedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      avatar: avatarPreview,
      birthDate,
      bio,
    });
    setEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-avatar">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" />
        ) : (
          <span>{currentUser.username[0].toUpperCase()}</span>
        )}
      </div>
      <div className="profile-info">
        <div className="profile-username">{currentUser.username}</div>
        {editing ? (
          <form className="profile-edit-form" onSubmit={handleSave}>
            <div className="mb-2">
              <label className="profile-label">Avatar:</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="mb-2">
              <label className="profile-label">Birth Date:</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="profile-input"
              />
            </div>
            <div className="mb-2">
              <label className="profile-label">Bio:</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="profile-input"
                rows={2}
                placeholder="Tell us about yourself..."
              />
            </div>
            <button className="profile-edit-btn" type="submit">Save</button>
            <button className="profile-edit-btn cancel" type="button" onClick={() => setEditing(false)} style={{ marginLeft: 12, background: '#eee', color: '#6d28d9', opacity: 1, cursor: 'pointer' }}>Cancel</button>
          </form>
        ) : (
          <>
            <div className="profile-detail">
              <span className="profile-label">Birth Date:</span> <span className="profile-value muted">{currentUser.birthDate || "Add"}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-label">Bio:</span> <span className="profile-value muted">{currentUser.bio || "Add"}</span>
            </div>
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile; 