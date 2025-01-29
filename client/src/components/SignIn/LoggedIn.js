// import React, { useState, useEffect } from "react";
// import { useAuth } from "oidc-react";

// const LoggedIn = ({ onClickHandler }) => {
//   const [isActive, setIsActive] = useState(false);
//   const [logoutIsActive, setLogoutIsActive] = useState(false);
//   const auth = useAuth();

//   const handleLoginClick = () => {
//     onClickHandler();
//     setIsActive(true);
//   };

//   const handleLogoutClick = () => {
//     setLogoutIsActive(true);
//   };
//   useEffect(() => {
//     if (logoutIsActive) {
//       setTimeout(() => auth.signOut(), 600);
//     }
//   }, [logoutIsActive]);

//   if (auth && auth.userData) {
//     return (
//       <div className="logout-button" onClick={handleLogoutClick}>
//         <img src="/../userimage.png" alt="User" className="user-icon" />
//         <strong>Hello, {auth.userData.profile.given_name}</strong>
//         <span className="separator"> | </span>
//         <span
//           className="logout-text"
//           onClick={() => auth.signOut() && auth.signOutRedirect()}
//         >
//           {" "}
//           Log Out{" "}
//         </span>
//       </div>
//     );
//   } else {
//     // User is logged out, show the Log In button
//     return (
//       <button
//         className={`login-button ${isActive ? "login-button-active" : ""}`}
//         onClick={handleLoginClick}
//       >
//         <img
//           src={isActive ? "/../userimageblue.svg" : "/../userimage.png"}
//           className="user-icon"
//           alt="User Icon"
//         />
//         Log In
//       </button>
//     );
//   }
// };

// export default LoggedIn;
