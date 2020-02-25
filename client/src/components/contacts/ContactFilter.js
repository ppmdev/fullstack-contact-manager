import React, { useContext, useRef, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  const text = useRef(null);

  const {
    filterContacts,
    clearFilter,
    filtered,
    contacts,
    loading
  } = contactContext;

  useEffect(() => {
    if (text.current && filtered === null) {
      text.current.value = "";
    }
  });

  const onChange = e => {
    if (text.current.value !== "") {
      filterContacts(e.target.value);
    } else {
      clearFilter();
    }
  };

  if (contacts !== null && contacts.length === 0 && !loading) {
    return null;
  } else {
    return (
      <form>
        <input
          ref={text}
          type="text"
          placeholder="Search Contacts..."
          onChange={onChange}
        />
      </form>
    );
  }
};

export default ContactFilter;
