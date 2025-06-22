import ReactPaginate from 'react-paginate';
import './pagination.css'


interface PaginationProps {
    onPageChange: (event: { selected: number }) => void;
    pageCount: number;
    currentPage?: number
    className?: string;
}

function Pagination({
    className,
    onPageChange,
    currentPage = 1,
    pageCount = 0,
}: PaginationProps) {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            previousLabel="< Previous"
            forcePage={currentPage - 1}
            onPageChange={onPageChange}
            pageRangeDisplayed={5}
            className={className}
            pageCount={Math.ceil(pageCount)}
            renderOnZeroPageCount={null}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            containerClassName={"pagination"}
            activeClassName={"active"}
        />
    )
}

export default Pagination
