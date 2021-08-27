// import React from 'react';
// import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
// import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
// import { useTable, useSortBy, Column } from 'react-table';

// interface Props {
//   columns: Column<{
//     [x: string]: string | number;
//   }>[];
//   data: { [key in string]: string | number }[];
// }

// export function DataTable({ columns, data }: Props): JSX.Element {
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

//   return (
//     <Table {...getTableProps()}>
//       <Thead>
//         {headerGroups.map((headerGroup) => (
//           <Tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map((column) => (
//               <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                 {column.render('Header')}
//                 <chakra.span pl="4">
//                   {column.isSorted ? (
//                     column.isSortedDesc ? (
//                       <TriangleDownIcon aria-label="sorted descending" />
//                     ) : (
//                       <TriangleUpIcon aria-label="sorted ascending" />
//                     )
//                   ) : null}
//                 </chakra.span>
//               </Th>
//             ))}
//           </Tr>
//         ))}
//       </Thead>
//       <Tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row);
//           return (
//             <Tr {...row.getRowProps()}>
//               {row.cells.map((cell) => (
//                 <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
//               ))}
//             </Tr>
//           );
//         })}
//       </Tbody>
//     </Table>
//   );
// }

export default 'dads';
