import React from 'react';

// icons
import { Coins, Hourglass, Package, RefreshCw, X } from 'lucide-react';

// charts
import { AppLayout } from '@/custom/components/app-layout';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

// table imports
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
        id: 'date',
        label: 'Date',
        minWidth: 120,
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

interface StatProps {
    icon?: React.ReactNode;
    title?: string;
    value?: any;
    bgColor?: string;
}

interface LineChartProps {
    xAxis: Array<string>;
    yAxis: Array<number>;
}

interface PeiChartAttribProps {
    id: number;
    value: number;
    label: string;
    color: string;
}

interface PieChartProps {
    data: Array<PeiChartAttribProps>;
}

interface BarChartProps {
    xAxis: Array<string>;
    yAxis: Array<number>;
}

interface Column {
    id: 'orderId' | 'customer' | 'product' | 'amount' | 'status' | 'date';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string;
}

interface TableAttribProps {
    orderId: string;
    customer: string;
    product: string;
    amount: number;
    status: string;
    date: string;
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

function StatCard({ icon, title, value, bgColor }: StatProps) {
    return (
        <div
            className="w-full rounded-lg p-4 shadow"
            style={{
                backgroundColor: bgColor ? bgColor : undefined,
                // color: bgColor,
                color: bgColor ? '#fff' : '#000',
            }}
        >
            <div className="mb-5 flex justify-between">
                <div className="text-sm">{title}</div>
                <span>{icon}</span>
            </div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}

function LineChartVisual({ xAxis, yAxis }: LineChartProps) {
    return (
        <div className="mt-8 rounded-lg bg-white shadow">
            <h2 className="text-md mb-4 p-4 font-semibold text-[#2C3E50]">
                Revenue Trend (2025)
            </h2>
            <LineChart
                xAxis={[
                    {
                        data: xAxis,
                        scaleType: 'band',
                        label: 'Month',
                    },
                ]}
                series={[
                    {
                        data: yAxis,
                        label: 'Revenue (Php)',
                        color: '#10B981',
                        area: true,
                        type: 'line',
                    },
                ]}
                height={320}
                grid={{ vertical: true, horizontal: true }}
            />
        </div>
    );
}

function PieChartVisual({ data }: PieChartProps) {
    return (
        <div className="mt-8 rounded-lg bg-white p-4 shadow">
            <h2 className="text-md mb-4 font-semibold text-[#2C3E50]">
                Order Status Distribution
            </h2>
            <div className="flex justify-center">
                <PieChart
                    series={[
                        {
                            data: data,
                            highlightScope: {
                                fade: 'global',
                                highlight: 'item',
                            },
                            faded: {
                                innerRadius: 30,
                                additionalRadius: -30,
                                color: 'gray',
                            },
                        },
                    ]}
                    width={400}
                    height={300}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    slotProps={{
                        legend: {
                            direction: 'horizontal',
                            position: {
                                vertical: 'middle',
                                horizontal: 'center',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

function BarChartVisual({ xAxis, yAxis }: BarChartProps) {
    return (
        <div className="mt-8 rounded-lg bg-white p-4 shadow">
            <h2 className="text-md mb-4 font-semibold text-[#2C3E50]">
                Popular Products
            </h2>
            <BarChart
                xAxis={[
                    {
                        data: xAxis,
                        scaleType: 'band',
                        label: 'Products',
                    },
                ]}
                yAxis={[
                    {
                        label: 'Units Sold',
                    },
                ]}
                series={[
                    {
                        data: yAxis,
                        label: 'Sales',
                        color: '#F96901',
                    },
                ]}
                height={350}
                // margin={{ left: 60, right: 30, top: 30, bottom: 80 }}
                grid={{ horizontal: true }}
            />
        </div>
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
            <div className="mt-8 rounded-lg bg-white shadow">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer
                        className="scrollbar-thin"
                        sx={{ maxHeight: 440 }}
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

export default function Dashboard() {
    // area line chart
    const xAxisLine = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const yAxisLine = [
        12000, 15000, 18000, 14000, 20000, 22000, 25000, 24000, 21000, 23000,
        26000, 28000,
    ];

    // pei chart
    const peiChartData = [
        {
            id: 0,
            value: 60,
            label: 'Total Orders',
            color: '#F96901',
        },
        {
            id: 1,
            value: 30,
            label: 'Pending',
            color: '#6366F1',
        },
        {
            id: 2,
            value: 30,
            label: 'Processing',
            color: '#14B8A6',
        },
        {
            id: 3,
            value: 45,
            label: 'Completed',
            color: '#10B981',
        },
        {
            id: 4,
            value: 10,
            label: 'Cancelled',
            color: '#EF4444',
        },
    ];

    // bar chart
    const barChartProducts = [
        'Product A',
        'Product B',
        'Product C',
        'Product D',
        'Product E',
        'Product F',
    ];

    const barChartSales = [120, 95, 150, 80, 110, 135];

    // table
    const rows: TableAttribProps[] = [
        {
            orderId: '#ORD-001',
            customer: 'John Doe',
            product: 'Product A',
            amount: 1200,
            status: 'Completed',
            date: '2026-01-03',
        },
        {
            orderId: '#ORD-002',
            customer: 'Jane Smith',
            product: 'Product B',
            amount: 2500,
            status: 'Pending',
            date: '2026-01-02',
        },
        {
            orderId: '#ORD-003',
            customer: 'Mike Johnson',
            product: 'Product C',
            amount: 1800,
            status: 'Processing',
            date: '2026-01-01',
        },
        // Add more orders...
    ];

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-lg font-bold text-[#2C3E50]">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <StatCard
                    icon={<Package />}
                    title="Total Orders"
                    value={60}
                    bgColor="#F96901"
                />
                <StatCard
                    icon={<Hourglass />}
                    title="Pending"
                    value={30}
                    bgColor="#6366F1"
                />
                <StatCard
                    icon={<RefreshCw />}
                    title="Processing"
                    value={30}
                    bgColor="#14B8A6"
                />
                <StatCard
                    icon={<Coins />}
                    title="Revenue"
                    value={'10,000 Php'}
                    bgColor="#10B981"
                />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <LineChartVisual xAxis={xAxisLine} yAxis={yAxisLine} />
                <PieChartVisual data={peiChartData} />
            </div>

            <div>
                <BarChartVisual
                    xAxis={barChartProducts}
                    yAxis={barChartSales}
                />
            </div>
            <div>
                <StickyHeadTable rows={rows} />
            </div>
        </AppLayout>
    );
}
