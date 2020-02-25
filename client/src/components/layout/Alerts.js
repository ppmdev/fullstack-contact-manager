import React, { useContext } from "react";

import AlertContext from "../../context/alert/alertContext";

const Alerts = () => {
  const alertContext = useContext(AlertContext);

  return (
    alertContext.alerts.length > 0 &&
    alertContext.alerts.map(alert => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i class="fas fa-info-circle px-1"></i> {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
