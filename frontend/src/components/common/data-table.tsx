'use client';

import type React from 'react';

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DataTableProps<TData extends { id?: number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isClickable?: boolean;
  link?: string;
  linkFormat?: string;
  linkBuilder?: (row: TData) => string;
  openInNewTab?: boolean;
  nameColumnIds?: string[];
  cellClassName?: string;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  onRowClick?: (row: TData) => void;
}

const DEFAULT_NAME_COLUMN_IDS = ['name', 'invoiceNumber'];
const ACTIONS_COLUMN_ID = 'actions';

export function DataTable<
  TData extends { id?: number; isDeleted?: boolean },
  TValue,
>({
  columns,
  data,
  isClickable,
  link,
  nameColumnIds = DEFAULT_NAME_COLUMN_IDS,
  cellClassName,
  linkFormat,
  linkBuilder,
  openInNewTab,
  sorting: externalSorting,
  onSortingChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);

  const isControlled =
    externalSorting !== undefined && onSortingChange !== undefined;
  const sorting = isControlled ? externalSorting : internalSorting;

  const handleSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const newSorting =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting)
        : updaterOrValue;

    if (isControlled) {
      onSortingChange(newSorting);
    } else {
      setInternalSorting(newSorting);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: isControlled ? undefined : getSortedRowModel(),
    onSortingChange: handleSortingChange,
    manualSorting: isControlled,
    state: {
      sorting,
    },
  });

  const shouldSkipInteraction = (isActionCell: boolean, row: TData) =>
    isActionCell || !!row.isDeleted;

  const buildTargetUrl = (row: TData): string | undefined => {
    if (linkBuilder) return linkBuilder(row);

    if (linkFormat) {
      if (!row.id) {
        console.warn(
          'DataTable: Row is missing _id required for linkFormat navigation'
        );
        return undefined;
      }
      return linkFormat.replace('{id}', row.id.toString());
    }
    if (link) {
      if (!row.id) {
        console.warn(
          'DataTable: Row is missing _id required for link navigation'
        );
        return undefined;
      }
      return `${link}/${row.id}`;
    }
    return undefined;
  };

  const handleRowClick = (row: TData, isActionCell: boolean) => {
    if (shouldSkipInteraction(isActionCell, row)) return;
    if (onRowClick) {
      onRowClick(row);
      return;
    }
    const targetUrl = buildTargetUrl(row);
    if (!targetUrl) return;
    if (openInNewTab) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(targetUrl);
    }
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    row: TData,
    isActionCell: boolean
  ) => {
    if (shouldSkipInteraction(isActionCell, row)) return;
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      handleRowClick(row, false);
    }
  };

  const tableRowClasses = (isDeleted: boolean) =>
    cn(
      isClickable && !isDeleted && 'cursor-pointer hover:bg-muted/50 group',
      'transition-all duration-200 block md:table-row border-b-1 border-gray-200 last:border-b-0',
      'md:mb-0 relative md:hover:shadow-none',
      isDeleted ? 'bg-gray-50' : '',
      'md:rounded-none rounded-lg my-3 mx-2 first:mt-2 last:mb-2 shadow-sm hover:shadow md:shadow-none'
    );

  const mobileCellClasses = cn(
    'block w-full text-right p-4 border-b border-gray-100 last:border-b-0',
    'before:content-[attr(data-label)] before:float-left before:font-medium before:text-sm before:text-gray-600'
  );

  return (
    <div className="rounded-sm border">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className={
                    header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : ''
                  }
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {{
                      asc: <ChevronUp className="ml-2 h-4 w-4" />,
                      desc: <ChevronDown className="ml-2 h-4 w-4" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => {
              const isDeleted = row.original.isDeleted;
              const cells = row.getVisibleCells();
              const nameCell = cells.find(cell =>
                nameColumnIds.includes(cell.column.id)
              );
              const actionsCell = cells.find(
                cell => cell.column.id === ACTIONS_COLUMN_ID
              );
              const otherCells = cells.filter(
                cell =>
                  !nameColumnIds.includes(cell.column.id) &&
                  cell.column.id !== ACTIONS_COLUMN_ID
              );

              return (
                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected()
                      ? 'selected'
                      : isDeleted
                        ? 'disabled'
                        : undefined
                  }
                  className={tableRowClasses(!!isDeleted)}
                  onClick={
                    isClickable
                      ? () => handleRowClick(row.original, false)
                      : undefined
                  }
                  onKeyDown={
                    isClickable
                      ? e => handleRowKeyDown(e, row.original, false)
                      : undefined
                  }
                  role={isClickable && !isDeleted ? 'button' : undefined}
                  tabIndex={isClickable && !isDeleted ? 0 : undefined}
                  aria-disabled={isDeleted}
                >
                  {isMobile && (
                    <div className="flex items-center justify-between p-4 py-3 border-b border-gray-100 bg-gray-100">
                      {nameCell && (
                        <div className="font-medium">
                          {flexRender(
                            nameCell.column.columnDef.cell,
                            nameCell.getContext()
                          )}
                        </div>
                      )}
                      {actionsCell && (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                        <div onClick={e => e.stopPropagation()}>
                          {flexRender(
                            actionsCell.column.columnDef.cell,
                            actionsCell.getContext()
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!isMobile
                    ? cells.map(cell => {
                        const isAction = cell.column.id === ACTIONS_COLUMN_ID;
                        return (
                          <TableCell
                            key={cell.id}
                            onClick={
                              isAction ? e => e.stopPropagation() : undefined
                            }
                            className={cn(
                              isDeleted && 'text-gray-400',
                              'table-cell w-auto text-left p-2',
                              isAction && 'bg-transparent',
                              cellClassName
                            )}
                          >
                            {cell.getValue() || isAction
                              ? flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              : '-'}
                          </TableCell>
                        );
                      })
                    : otherCells.map(cell => (
                        <TableCell
                          key={cell.id}
                          data-label={String(cell.column.columnDef.header)}
                          className={cn(
                            isDeleted && 'text-gray-400',
                            mobileCellClasses
                          )}
                        >
                          {cell.getValue()
                            ? flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            : '-'}
                        </TableCell>
                      ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <p>No results found.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
