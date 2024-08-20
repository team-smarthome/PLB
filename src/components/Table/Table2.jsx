import React, { useRef } from "react";
import "./Table.css";

const Table2 = ({ data, page }) => {
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

    return (
        <div>
            <table className="custom-table">
                <thead>
                    <tr>
                        {/* <th>No</th> */}
                        <th>Tanggal</th>
                        <th>PLB Number</th>
                        <th>No Register</th>
                        <th>Nama</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table2;
