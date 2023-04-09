import React, {createContext, useContext, useEffect, useState} from 'react';
export const ErrContext = createContext();

export const ErrProvider = ({children}) => {
    const [errCode, setErrCode] = useState("0");
    const [errMessage, setErrMessage] = useState("null")
    const [alertShow, setAlert] = useState(false);
    
    return (
        <ErrContext.Provider value={{errCode, setErrCode, alertShow, setAlert, errMessage, setErrMessage}}>
            {children}
        </ErrContext.Provider>
    )
}