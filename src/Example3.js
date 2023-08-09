import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    
    firstName: 'John',
    lastName: 'Doe',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    
    firstName: 'Jane',
    lastName: 'Doe',
    
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    
    firstName: 'Joe',
    lastName: 'Doe',
    
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    
    firstName: 'Kevin',
    lastName: 'Vandy',
    
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    
    firstName: 'Joshua',
    lastName: 'Rolluffs',
    
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];

const Example3 = () => {
  //should be memoized or stable
  const columns = [
      {
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 150,
      },
    ];

  return <MaterialReactTable columns={columns} data={data} />;
};

export default Example3;
