import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "../../context/auth/authContext";
import ContactContext from "../../context/contact/contactContext";

const Navbar = ({ title, icon }) => {
  const authContext = useContext(AuthContext);
  const contactContext = useContext(ContactContext);

  const { isAuthenticated, logout, user } = authContext;
  const { clearContacts } = contactContext;

  /* Call the logout method in the authContext. */
  const onLogout = () => {
    logout();
    clearContacts();
  };

  /** Navbar links to be shown if the user is authenticated */
  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );

  /** Navbar links to be shown if the user is NOT authenticated */
  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <i className={icon} /> {title}
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
};

Navbar.defaultProps = {
  title: "Contact Manager",
  icon: "far fa-address-card"
};

export default Navbar;
