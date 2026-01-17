import { AppLayout } from '@/custom/components/app-layout';
import { router } from '@inertiajs/react';
import { CheckCircle2, ThumbsDown, ThumbsUp, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
import { ToastContainer, toast } from 'react-toastify';

interface TableAttribProps {
    orderId: string;
    customer: string;
    totalPrice: number;
    status: string;
}

interface ProductsPageProps {
    orders?: TableAttribProps[];
}

const columns: readonly Column[] = [
    { id: 'orderId', label: 'Order ID', minWidth: 100 },
    { id: 'customer', label: 'Customer', minWidth: 100 },
    {
        id: 'totalPrice',
        label: 'Total Price',
        minWidth: 100,
        align: 'right',
        format: (value: number) => `₱${value.toLocaleString('en-US')}`,
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'action',
        label: 'Actions',
        minWidth: 150,
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
    id: 'orderId' | 'customer' | 'totalPrice' | 'status' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string;
}

interface TableAttribProps {
    orderId: string;
    customer: string;
    totalPirce: number;
    status: string;
    [key: string]: string | number;
}

interface StickyHeadTableProps {
    rows: TableAttribProps[];
}

interface modalActionConfirmationAcceptProps {
    open: boolean;
    handleClose: () => void;
    style: SxProps<Theme>;
    orderId: string;
}

function ModalActionConfirmationAccept({
    open,
    handleClose,
    style,
    orderId,
}: modalActionConfirmationAcceptProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleAccept = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            '',
            { orderId: orderId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleClose();
                    setIsSubmitting(false);
                    toast.success('Product updated successfully!', {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <CheckCircle2 size={20} />,
                    });
                },
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    setIsSubmitting(false);
                    toast.error('Failed to approve order!', {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                },
            },
        );
    };

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
                    Confirmation
                </Typography>
                <div>
                    <div>
                        <p>Are you sure you want to accept this order?</p>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                            // disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg bg-[#F96901] px-4 py-2 text-white transition-colors hover:bg-[#d85a01] disabled:cursor-not-allowed disabled:opacity-50"
                            // disabled={isSubmitting}
                        >
                            {/* {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Applying</span>
                                </>
                            ) : (
                                <>
                                    <span>Apply</span>
                                </>
                            )} */}
                            Accept
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

function modalActionConfirmationReject() {}

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

    // action controls
    // datas
    const [confirmOrderId, setConfirmOrderId] = React.useState<string>('');
    // Accept
    const [openConfirmationModal, setOpenConfirmationModal] =
        useState<boolean>(false);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const handleApprove = (orderId: string) => {
    //     console.log('Approve order:', orderId);
    //     // Add logic to approve the order
    // };

    // const handleReject = (orderId: string) => {
    //     console.log('Reject order:', orderId);
    //     // Add logic to reject the order
    // };

    const handleOpenModal = (orderId: string) => {
        setOrderId(orderId);
        setOpen(true);
    };

    const handleOnCloseModal = () => {
        setOrderId('');
        setOpen(false);
    };

    const handleAcceptAction = (orderId: string) => {
        // setConfirmOrderId(orderId);
        setOpenConfirmationModal(true);
    };

    const handleAcceptActionOnClose = () => {
        // setConfirmOrderId('');
        setOpenConfirmationModal(false);
    };

    return (
        <>
            <TableRowModal
                open={open}
                handleClose={handleOnCloseModal}
                style={modalStyle}
                data={orderId}
            />

            <ModalActionConfirmationAccept
                open={openConfirmationModal}
                handleClose={handleAcceptActionOnClose}
                style={modalStyle}
                orderId={confirmOrderId}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenModal(
                                                        row.orderId,
                                                    );
                                                }}
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
                                                            {column.id ===
                                                            'action' ? (
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleAcceptAction(
                                                                                row.orderId,
                                                                            );
                                                                        }}
                                                                        className="cursor-pointer rounded-lg p-2 text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                                                                        title="Approve"
                                                                    >
                                                                        <ThumbsUp
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        // onClick={(
                                                                        //     e,
                                                                        // ) => {
                                                                        //     e.stopPropagation();
                                                                        //     handleReject(
                                                                        //         row.orderId,
                                                                        //     );
                                                                        // }}
                                                                        className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                                                                        title="Reject"
                                                                    >
                                                                        <ThumbsDown
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            ) : column.format &&
                                                              typeof value ===
                                                                  'number' ? (
                                                                column.format(
                                                                    value,
                                                                )
                                                            ) : (
                                                                value
                                                            )}
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

export default function PendingOrders({ orders = [] }: ProductsPageProps) {
    const [rows, setRows] = useState<TableAttribProps[]>(orders);
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!window.Echo) {
            console.error('Echo is not initialized');
            return;
        }

        const channel = window.Echo.channel('orders');

        channel.listen('.order.created', (e: any) => {
            setRows((prevRows) => {
                // Replace 'orderId' with the correct unique key if different
                if (prevRows.some((row) => row.orderId === e.orderId)) {
                    return prevRows;
                }
                return [e, ...prevRows];
            });
        });

        // channel.listen('.product.updated', (e: any) => {
        //     setRows((prev) =>
        //         prev.map((p) =>
        //             p.productId === e.productId ? { ...p, ...e } : p,
        //         ),
        //     );
        // });

        // channel.listen('.product.deleted', (e: any) => {
        //     setRows((prev) => prev.filter((p) => p.productId !== e.productId));
        // });

        // Cleanup
        return () => {
            console.log('Leaving products channel');
            window.Echo.leave('products');
        };
    }, []);

    return (
        <AppLayout>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{
                    zIndex: 9999,
                }}
                toastStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
            />

            <div className="mb-5">
                <h1 className="text-lg font-bold text-[#2C3E50]">
                    Pending Orders
                </h1>
            </div>

            <div>
                <StickyHeadTable rows={rows} />
            </div>
        </AppLayout>
    );
}
