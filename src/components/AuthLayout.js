import { Link } from "react-router-dom";
import "../assets/AuthLayout.css";
import logo from '../assets/img/logo1.png';
const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-container">
      <div className="auth-left">
      <img src={logo} alt="Logo"  className="auth-logo" />
        <h1 className="auth-title">UDD.Co</h1>
        <p className="auth-subtitle">E-Commerced Customize Clothing System</p>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-heading">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
