import React, { useRef } from "react";
import "./Table.css";

const Table2 = ({ data, page, onDelete }) => {
    console.log(data, "dataTableFromTable2");

    const printRef = useRef();

    // Check if data is not an array or is empty
    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data available.</div>;
    }

    // Calculate the start and end indices based on the page parameter
    const startIndex = (page - 1) * 20;
    const endIndex = Math.min(startIndex + 20, data.length);

    // Display only the data within the calculated indices
    const slicedData = data.slice(startIndex, endIndex);
    console.log(slicedData, "slicedData");

    // Function to handle epoch to formatted date conversion
    const handleEpochToDate = (epoch) => {
        const date = new Date(epoch * 1000);

        // Format tanggal menjadi "dd-MM-yyyy HH:mm:ss"
        const formattedDate = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        console.log(formattedDate, "dataConvert");
        return formattedDate;
    };

    const handleView = (item) => {
    };

    const handleUpdate = (item) => {
    };

    const handleDelete = (item) => {
        if (onDelete) {
            console.log("itemPersonID", item.personId)
            onDelete(item.personId);
        }
    };

    return (
        <div>
            <table className="custom-table">
                <thead>
                    <tr>
                        {/* <th>No</th> */}
                        <th>Date</th>
                        <th>PLB Number</th>
                        <th>No Register</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        console.log(item, "itemDataInginDiTampilkan"),
                        <tr key={index}>
                            {/* <td>{startIndex + index + 1}</td> */}
                            <td>{handleEpochToDate(item.inset_time)}</td>
                            <td>{item.personNum}</td>
                            <td>{item.personId}</td>
                            <td>{item.name}</td>
                            <td>
                                <div style={{
                                    display: "flex",
                                    gap: "10px"
                                }}>
                                    <button onClick={() => handleView(item)}>View</button>
                                    <button onClick={() => handleUpdate(item)}>Update</button>
                                    <button onClick={() => handleDelete(item)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table2;
