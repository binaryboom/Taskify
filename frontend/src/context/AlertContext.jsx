import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();


export const useAlert = () => useContext(AlertContext);


export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, backgroundColor = '#f44336', duration = 3000) => {
    setAlert({ message, backgroundColor });
    setTimeout(() => {
      setAlert(null);
    }, duration); 
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="alert" style={{ backgroundColor: alert.backgroundColor }}>
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
  );
};
