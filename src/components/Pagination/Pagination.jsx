import React from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const Pagination = ({ onPageChange, pageCount }) => {
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
        onPageChange={(selected) => onPageChange(selected.selected + 1)}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Pagination;
