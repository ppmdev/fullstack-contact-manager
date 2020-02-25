import React, { useContext, useEffect } from "react";
import Contacts from "../contacts/Contacts";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContactFilter";
import AuthContext from "../../context/auth/authContext";

const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    /** When the main dashboard component (Home) mounts, the load user mehtod will run and validate the
     *  authenticated user and store the user object in the state.
     */
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="grid-2">
      <div>
        <ContactForm />
      </div>
      <div>
        <h2>Contacts</h2>
        <ContactFilter />
        <Contacts />
      </div>
    </div>
  );
};

export default Home;
