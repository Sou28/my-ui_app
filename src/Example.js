import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import { MaterialReactTable } from 'material-react-table';
  import { Typography } from '@mui/material';
  import {
    useInfiniteQuery,
  } from 'react-query';
  import {getPostsPage} from './api/axios';
  

  const columns = [
    {
      accessorKey: 'userId',
      header: 'User Id',
    },
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'body',
      header: 'Body',
    }
  ];
  
  const fetchSize = 25;
  
  const Example = () => {
    const tableContainerRef = useRef(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const rowVirtualizerInstanceRef = useRef(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method
  
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState();
    const [sorting, setSorting] = useState([]);
  
    const { data, fetchNextPage, isError, isFetching, isLoading } =
      useInfiniteQuery(
        '/posts',
        ({ pageParam = 1 }) => getPostsPage(pageParam),
        {getNextPageParam: (_lastGroup, groups) => {return _lastGroup.length ? groups.length + 1 : undefined},
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      });
  
      console.log("Before The data came ...",data)

      
    const flatData = useMemo(
      () => data?.pages[0]?? [],
        [data],
      );

  //   const flatData = data?.pages.map(pg => {
  //     return pg.map((post, i) => {
  //         if (pg.length === i + 1) {
  //             return <Post ref={lastPostRef} key={post.id} post={post} />
  //         }
  //         return <Post key={post.id} post={post} />
  //     })
  // })

    console.log("After The data came ...",data)

    console.log("The flatdata came ...",flatData)
    const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
    // const totalFetched = flatData.length;
    const totalFetched = flatData.length;
  
    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
      (containerRefElement) => {
        if (containerRefElement) {
          const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
          //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
          
          if (
            scrollHeight - scrollTop - clientHeight < 400 &&
            !isFetching
          ) {
            console.log('We are near the last post!')
            fetchNextPage();
          }
        }
      },
      [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
    );
  
    //scroll to top of table when sorting or filters change
    useEffect(() => {
      //scroll to the top of the table when the sorting changes
      try {
        rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      } catch (error) {
        console.error(error);
      }
    }, [sorting, columnFilters, globalFilter]);
  
    //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
      fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);
  
    return (
      <MaterialReactTable
        columns={columns}
        data={flatData}
        enablePagination={false}
        enableRowNumbers
        enableRowVirtualization //optional, but recommended if it is likely going to be more than 100 rows
        manualFiltering
        manualSorting
        muiTableContainerProps={{
          ref: tableContainerRef, //get access to the table container element
          sx: { maxHeight: '600px' }, //give the table a max height
          onScroll: (
            event, //add an event listener to the table container element
          ) => fetchMoreOnBottomReached(event.target),
        }}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data',
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onSortingChange={setSorting}
        renderBottomToolbarCustomActions={() => (
          <Typography>
            Fetched {totalFetched} of {totalDBRowCount} total rows.
          </Typography>
        )}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting,
        }}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
        rowVirtualizerProps={{ overscan: 4 }}
      />
    );
  };
  
  
  export default Example;
  