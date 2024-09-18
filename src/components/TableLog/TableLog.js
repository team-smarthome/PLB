import React from 'react';
import './tablelog.style.css';

const TableLog = ({ tHeader, tBody, handler = () => { }, isAction = false, onEdit = () => { }, onDelete = () => { }, rowRenderer = null }) => {

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {tHeader.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tBody.length === 0 ? (
                        <tr>
                            <td colSpan={tHeader.length} style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                    ) : (
                        tBody.map((row, index) => (
                            <tr key={index} onClick={() => handler(row)} style={{ cursor: 'pointer' }}>
                                <td>{index + 1}</td>
                                {rowRenderer ? rowRenderer(row) : (
                                    <>
                                        {Object.keys(row).map((key, cellIndex) => (
                                            key === "profile_image" ? (
                                                <td key={cellIndex}>
                                                    <img
                                                        src={row[key]}
                                                        alt="Profile"
                                                        width={100}
                                                        height={100}
                                                        style={{ borderRadius: "50%" }}
                                                    />
                                                </td>
                                            ) : (
                                                <td key={cellIndex}>{row[key]}</td>
                                            )
                                        ))}
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableLog;
