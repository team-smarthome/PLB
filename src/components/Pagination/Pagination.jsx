import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const Pagination = ({ onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 5; // Number of items per page
  const data = Array.from({ length: 50 }, (_, index) => `Item ${index + 1}`); // Dummy data array

  const pageCount = Math.ceil(data.length / perPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    onPageChange(data.slice(selected * perPage, (selected + 1) * perPage));
  };

  return (
    <div>
      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Pagination;
