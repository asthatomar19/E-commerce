import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import LoginModal from "../Components/LoginModal";
import SignupModal from "../Components/SignupModal";

function Profile() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const openSignupModal = () => setShowSignupModal(true);
    const closeSignupModal = () => setShowSignupModal(false);
    return (
        <>
            <Navbar openLogin={openLoginModal} />

            {showLoginModal && (
                <LoginModal
                    closeModal={closeLoginModal}
                    openSignupModal={() => {
                        closeLoginModal();
                        openSignupModal();
                    }}
                />
            )}

            {showSignupModal && (
                <SignupModal
                    closeModal={closeSignupModal}
                    openLoginModal={() => {
                        closeSignupModal();
                        openLoginModal();
                    }}
                />
            )}
            <div style={{marginTop:"150px"}}>
                Profile
            </div>
        </>
    )
}

export default Profile