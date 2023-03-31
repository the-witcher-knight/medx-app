import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';

import AppIcon from './AppIcon';
import usePagination from './usePagination';

function LinearPagination({ onPageChange, totalPages, siblingCount = 1, currentPage, pageSize }) {
  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ButtonGroup isAttached colorScheme="gray" size="sm">
      {/* Left navigation arrow */}
      <Button onClick={onPrevious}>
        <AppIcon icon="caret-left" />
      </Button>

      {paginationRange.map((pageNumber) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === '...') {
          return <Button>&#8230;</Button>;
        }

        // Render our Page Pills
        return (
          <Button
            key={`page_${pageNumber}`}
            onClick={() => onPageChange(pageNumber)}
            colorScheme={pageNumber === currentPage ? 'blue' : 'gray'}
          >
            {pageNumber}
          </Button>
        );
      })}

      {/*  Right Navigation arrow */}
      <Button onClick={onNext} isDisabled={currentPage === lastPage}>
        <AppIcon icon="caret-right" />
      </Button>
    </ButtonGroup>
  );
}

export default LinearPagination;
