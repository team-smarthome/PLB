import React from 'react';
import './style.css'
const LoadingScan = () => {
    const loadingStyle = {
        height: '50px',
        width: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'progress',
        borderRadius: '50%',
        borderTop: '5px solid gold',
        borderBottom: '5px solid transparent',
        borderLeft: '5px solid gold',
        borderRight: '5px solid transparent',
        animation: 'loading 1s linear infinite',
    };

    return (
        <div className="loading" style={loadingStyle}></div>
    );
};

export default LoadingScan;
