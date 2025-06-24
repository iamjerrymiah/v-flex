import ReactPaginate from 'react-paginate';
import './pagination.css';
import { useEffect, useState } from 'react';

interface PaginationProps {
    onPageChange: (event: { selected: number }) => void;
    pageCount: number;
    currentPage?: number;
    className?: string;
}

function Pagination({
    className,
    onPageChange,
    currentPage = 1,
    pageCount = 0,
}: PaginationProps) {
    const [pageRange, setPageRange] = useState(5);

    useEffect(() => {
        const updateRange = () => {
            const width = window.innerWidth;
            if (width < 480) setPageRange(1); // Mobile
            else if (width < 768) setPageRange(3); // Tablet
            else setPageRange(5); // Desktop
        };

        updateRange(); // initial run
        window.addEventListener('resize', updateRange);
        return () => window.removeEventListener('resize', updateRange);
    }, []);

    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel=">>>"
            previousLabel="<<<"
            forcePage={currentPage - 1}
            onPageChange={onPageChange}
            pageRangeDisplayed={pageRange}
            marginPagesDisplayed={1}
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
    );
}

export default Pagination;