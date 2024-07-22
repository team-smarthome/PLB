import React, { createContext, useState } from 'react';
import { useEffect } from 'react';


const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const dataStatus = localStorage.getItem("dataStatus");
        setData(dataStatus);
    }, []);

    // console.log("DataSaatIni", data);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;