import React from 'react';
import './tablelog.style.css';

const TableLog = ({
    tHeader,
    tBody,
    handler = () => { },
    isAction = false,
    onEdit = () => { },
    onDelete = () => { },
    rowRenderer = null,
    showIndex = false,
    page = 1,
    perPage = 20 // jumlah data per halaman, default 20
}) => {

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {showIndex && <th>No.</th>} {/* Conditional rendering of the "No." header */}
                        {tHeader.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tBody.length === 0 ? (
                        <tr>
                            <td colSpan={tHeader.length + (showIndex ? 1 : 0)} style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        tBody.map((row, index) => (
                            <tr key={index} onClick={() => handler(row, index)} style={{ cursor: 'pointer' }}>
                                {showIndex && <td>{(page - 1) * perPage + index + 1}</td>} {/* Adjusted index */}
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
