import ReactPaginate from 'react-paginate'
import { memo } from 'react'
import './pagination.css'


const Pagination =({ className, onPageChange, pageCount = 0}: any) => {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            previousLabel="<"
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

export default memo(Pagination);