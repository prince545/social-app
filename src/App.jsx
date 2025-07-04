import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import { useState, useContext } from "react";
import PostListProvider from "./store/post-list-store";
import AuthProvider, { AuthContext } from "./store/user-auth-store";
import Login from "./components/Login";
import Signup from "./components/Signup";
import socialIllustration from "./assets/social-illustration.png";
import images1 from "./assets/images (1).png";
import Navbar from "./components/Navbar";
import LikedPosts from "./components/LikedPosts";
import Profile from "./components/Profile";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <AuthGate
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        showSignup={showSignup}
        setShowSignup={setShowSignup}
      />
    </AuthProvider>
  );
}

function AuthGate({ selectedTab, setSelectedTab, showSignup, setShowSignup }) {
  const { currentUser } = useContext(AuthContext);
  const [justSignedUp, setJustSignedUp] = useState(false);
  if (!currentUser) {
    return (
      <div className="auth-bg-dark">
        <div className="auth-card-row">
          <div className="auth-phone auth-phone-left">
            <img src={socialIllustration} alt="People using social media app" className="auth-phone-img" />
          </div>
          <div className="auth-card auth-card-3d" style={{ width: "100%", maxWidth: 400 }}>
            <div className="auth-flip-container">
              {showSignup ? (
                <div className="auth-form signup">
                  <Signup onSuccess={() => { setShowSignup(false); setJustSignedUp(true); }} />
                  <div className="auth-divider"><span>OR</span></div>
                  <p className="mt-3 text-center">Already have an account? <button className="btn btn-link p-0 auth-switch-btn" onClick={() => setShowSignup(false)}>Login</button></p>
                </div>
              ) : (
                <div className="auth-form login">
                  <Login onSuccess={() => { setShowSignup(false); setJustSignedUp(false); }} justSignedUp={justSignedUp} />
                  <div className="auth-divider"><span>OR</span></div>
                  <p className="mt-3 text-center">Don't have an account? <button className="btn btn-link p-0 auth-switch-btn" onClick={() => setShowSignup(true)}>Sign Up</button></p>
                </div>
              )}
            </div>
          </div>
          <div className="auth-phone auth-phone-right">
            <img src={images1} alt="3D social media illustration" className="auth-phone-img" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PostListProvider>
      <div className="app-container">
        <div className="content">
          <Navbar onNav={setSelectedTab} currentTab={selectedTab} />
          <main className="main-content">
            {selectedTab === "Home" ? (
              <PostList />
            ) : selectedTab === "Explore" ? (
              <LikedPosts />
            ) : selectedTab === "Create" ? (
              <CreatePost />
            ) : selectedTab === "Profile" ? (
              <Profile />
            ) : (
              <PostList />
            )}
          </main>
          <Footer />
        </div>
      </div>
    </PostListProvider>
  );
}

export default App;