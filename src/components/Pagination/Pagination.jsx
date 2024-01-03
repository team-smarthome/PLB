// Pagination.js
import React, { useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const Pagination = ({ onPageChange, pageCount, currentPage }) => {
  const handlePageClick = ({ selected }) => {
    onPageChange(selected + 1);
  };

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  return (
    <div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export default Pagination;
