import { AppLayout } from '@/custom/components/app-layout';
import { X } from 'lucide-react';
import React from 'react';

// table components
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

// modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

// style
import type { SxProps, Theme } from '@mui/material/styles';

const columns: readonly Column[] = [
    { id: 'orderId', label: 'Order ID', minWidth: 100 },
    { id: 'customer', label: 'Customer', minWidth: 150 },
    { id: 'product', label: 'Product', minWidth: 170 },
    { id: 'category', label: 'Category', minWidth: 150 },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 100,
        align: 'right',
        format: (value: number) => `₱${value.toLocaleString('en-US')}`,
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 120,
        align: 'center',
    },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 120,
        align: 'center',
    },
];

const modalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

interface Column {
    id:
        | 'orderId'
        | 'customer'
        | 'product'
        | 'category'
        | 'amount'
        | 'status'
        | 'quantity';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string;
}

interface TableAttribProps {
    orderId: string;
    customer: string;
    product: string;
    category: string;
    amount: number;
    status: string;
    quantity: number;
}

interface StickyHeadTableProps {
    rows: TableAttribProps[];
}

interface TableRowModalProps {
    open: boolean;
    handleClose: () => void;
    style?: SxProps<Theme>;
    data: string;
}

function TableRowModal({ open, handleClose, style, data }: TableRowModalProps) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography
                    className="border-b border-gray-300"
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                >
                    <div className="flex items-center justify-between">
                        <h1>Order Details</h1>
                        <button
                            className="cursor-pointer rounded border border-gray-500 outline-none hover:border-black"
                            onClick={handleClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className="flex gap-2">
                        <label htmlFor="orderId">Order ID:</label>
                        <span id="orderId">{data}</span>
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
}

function StickyHeadTable({ rows }: StickyHeadTableProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState<boolean>(false);
    const [orderId, setOrderId] = React.useState<string>('');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenModal = (orderId: string) => {
        setOrderId(orderId);
        setOpen(true);
    };

    const handleOnCloseModal = () => {
        setOpen(false);
    };

    return (
        <>
            <TableRowModal
                open={open}
                handleClose={handleOnCloseModal}
                style={modalStyle}
                data={orderId}
            />
            <div className="rounded-lg bg-white shadow">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer
                        className="scrollbar-thin"
                        sx={{ maxHeight: 443 }}
                    >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage,
                                    )
                                    .map((row) => {
                                        return (
                                            <TableRow
                                                hover
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleOpenModal(row.orderId)
                                                }
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.orderId}
                                            >
                                                {columns.map((column) => {
                                                    const value =
                                                        row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                        >
                                                            {column.format &&
                                                            typeof value ===
                                                                'number'
                                                                ? column.format(
                                                                      value,
                                                                  )
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </>
    );
}

export default function CompletedOrders() {
    const rows: TableAttribProps[] = [
        {
            orderId: 'ORD-001',
            customer: 'Juan Dela Cruz',
            product: 'Chicken Adobo Meal',
            category: 'Main Course',
            amount: 250,
            status: 'Completed',
            quantity: 2,
        },
        {
            orderId: 'ORD-002',
            customer: 'Maria Santos',
            product: 'Pancit Canton with Drink',
            category: 'Noodles',
            amount: 180,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-003',
            customer: 'Pedro Reyes',
            product: 'Halo-Halo Special',
            category: 'Desserts',
            amount: 120,
            status: 'Completed',
            quantity: 3,
        },
        {
            orderId: 'ORD-004',
            customer: 'Ana Garcia',
            product: 'Sisig Rice Bowl',
            category: 'Main Course',
            amount: 200,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-005',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 2,
        },
        {
            orderId: 'ORD-006',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-007',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 2,
        },
        {
            orderId: 'ORD-008',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-009',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 3,
        },
        {
            orderId: 'ORD-010',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-011',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 2,
        },
        {
            orderId: 'ORD-012',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-013',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-014',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-015',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 2,
        },
        {
            orderId: 'ORD-016',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-017',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 3,
        },
        {
            orderId: 'ORD-018',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 1,
        },
        {
            orderId: 'ORD-019',
            customer: 'Jose Mendoza',
            product: 'Lumpiang Shanghai',
            category: 'Appetizers',
            amount: 150,
            status: 'Completed',
            quantity: 2,
        },
    ];

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-lg font-bold text-[#2C3E50]">
                    Completed Orders
                </h1>
            </div>

            <div>
                <StickyHeadTable rows={rows} />
            </div>
        </AppLayout>
    );
}
