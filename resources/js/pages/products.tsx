import { AppLayout } from '@/custom/components/app-layout';
import {
    CheckCircle2,
    Edit,
    ImagePlus,
    Plus,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// loading indicator
import { Mosaic } from 'react-loading-indicators';

// alert notification
import { ToastContainer, toast } from 'react-toastify';

// custom components
import { Input } from '@/custom/components/input';
import { RichTextEditor } from '@/custom/components/rich-text-editor';
import { Select } from '@/custom/components/select';

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
import { router } from '@inertiajs/react';
import type { SxProps, Theme } from '@mui/material/styles';

interface Column {
    id: 'productId' | 'name' | 'category' | 'price' | 'status' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string;
}

const columns: readonly Column[] = [
    { id: 'productId', label: 'Product ID', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'category', label: 'Category', minWidth: 100 },
    {
        id: 'price',
        label: 'Price',
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
    width: { xs: '90%', sm: 800 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

interface TableAttribProps {
    productId: string;
    name: string;
    category: string;
    price: number;
    status: string;
    [key: string]: string | number;
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

interface AddProductModalProps {
    open: boolean;
    handleClose: () => void;
    style?: SxProps<Theme>;
}

interface EditProductModalProps {
    open: boolean;
    handleClose: () => void;
    style?: SxProps<Theme>;
    data: string;
}

interface ProductsPageProps {
    products?: TableAttribProps[];
}

interface ProductAttribProps {
    productId: string;
    name: string;
    category: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

function AddProductModal({ open, handleClose, style }: AddProductModalProps) {
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview('');
    };

    const handleModalClose = () => {
        setName('');
        setCategory('');
        setDescription('');
        setPrice(undefined);
        setImage(null);
        setImagePreview('');
        handleClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('description', description);
        if (price !== undefined) formData.append('price', price.toString());
        if (image) formData.append('image', image);

        // Use Inertia router to submit
        router.post('/products/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Reset form and close modal
                handleModalClose();
                setIsSubmitting(false);
                toast.success('Product added successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    icon: <CheckCircle2 size={20} />,
                });
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                setIsSubmitting(false);
                // Display specific error messages
                if (errors.image) {
                    toast.error(errors.image, {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                } else if (errors.name) {
                    toast.error(errors.name, {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                } else {
                    toast.error('Failed to add product!', {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
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
                    Add New Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div
                        className="scrollbar-thin flex max-h-[calc(100vh-250px)] flex-col gap-3 overflow-y-auto"
                        style={{ marginTop: '16px', paddingRight: '4px' }}
                    >
                        {/* Image Upload */}
                        <div className="w-full">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Product Image
                            </label>
                            <div className="flex gap-4">
                                {/* Upload Area */}
                                <label
                                    htmlFor="image-upload"
                                    className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-[#F96901] hover:bg-[#F96901]/5"
                                >
                                    {imagePreview ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveImage();
                                                }}
                                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImagePlus
                                                size={32}
                                                className="mb-2 text-gray-400"
                                            />
                                            <span className="text-sm text-gray-500">
                                                Upload Image
                                            </span>
                                            <span className="mt-1 text-xs text-gray-400">
                                                Click to browse
                                            </span>
                                        </>
                                    )}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>

                                {/* Image Info */}
                                {image && (
                                    <div className="flex flex-1 flex-col justify-center gap-1">
                                        <p className="text-sm font-medium text-gray-700">
                                            {image.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(image.size / 1024).toFixed(2)} KB
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Accepted formats: JPG, PNG, GIF
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Product Name"
                                name="name"
                                id="name"
                                required
                            />
                            <Input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Category"
                                name="category"
                                id="category"
                                required
                            />
                        </div>

                        <div>
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Enter product description..."
                                minHeight="300px"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value === ''
                                            ? undefined
                                            : Number(e.target.value),
                                    )
                                }
                                placeholder="Price"
                                name="price"
                                id="price"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={handleModalClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg bg-[#F96901] px-4 py-2 text-white transition-colors hover:bg-[#d85a01] disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Add Product</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

function EditProductModal({
    open,
    handleClose,
    style,
    data,
}: EditProductModalProps) {
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<string>('');
    const [updatedAt, setUpdatedAt] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch product data when modal opens and data changes
    useEffect(() => {
        if (open && data) {
            setIsLoading(true);
            fetch(`/products/fetch?id=${data}`)
                .then((response) => response.json())
                .then((result) => {
                    if (result.success && result.products.length > 0) {
                        const product = result.products[0];
                        setName(product.name);
                        setCategory(product.category);
                        setDescription(product.description || '');
                        setPrice(product.price);
                        if (product.image) {
                            setImagePreview(`/storage/${product.image}`);
                        }
                        setStatus(product.status);
                        setCreatedAt(
                            new Date(product.createdAt).toLocaleString(),
                        );
                        setUpdatedAt(
                            new Date(product.updatedAt).toLocaleString(),
                        );
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    toast.error('Failed to fetch product!', {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                    setIsLoading(false);
                });
        }
    }, [open, data]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview('');
    };

    const handleModalClose = () => {
        setName('');
        setCategory('');
        setDescription('');
        setPrice(undefined);
        setImage(null);
        setImagePreview('');
        setStatus('');
        setCreatedAt('');
        setUpdatedAt('');
        handleClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('id', data);
        formData.append('name', name);
        formData.append('category', category);
        formData.append('description', description);
        if (price !== undefined) formData.append('price', price.toString());
        if (image) formData.append('image', image);
        formData.append('status', status);

        // Use Inertia router to submit
        router.post('/products/edit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Reset form and close modal
                handleModalClose();
                setIsSubmitting(false);
                toast.success('Product updated successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    icon: <CheckCircle2 size={20} />,
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                // Display specific error messages
                if (errors.image) {
                    toast.error(errors.image, {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                } else if (errors.name) {
                    toast.error(errors.name, {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                } else {
                    toast.error('Failed to add product!', {
                        position: 'top-right',
                        autoClose: 5000,
                        icon: <XCircle size={20} />,
                    });
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
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
                    Edit Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    {!isLoading ? (
                        <div
                            className="scrollbar-thin flex max-h-[calc(100vh-250px)] flex-col gap-3 overflow-y-auto"
                            style={{ marginTop: '16px', paddingRight: '4px' }}
                        >
                            {/* Image Upload */}
                            <div className="w-full">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Image
                                </label>
                                <div className="flex gap-4">
                                    {/* Upload Area */}
                                    <label
                                        htmlFor="image-upload"
                                        className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-[#F96901] hover:bg-[#F96901]/5"
                                    >
                                        {imagePreview ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-full w-full rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveImage();
                                                    }}
                                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <ImagePlus
                                                    size={32}
                                                    className="mb-2 text-gray-400"
                                                />
                                                <span className="text-sm text-gray-500">
                                                    Upload Image
                                                </span>
                                                <span className="mt-1 text-xs text-gray-400">
                                                    Click to browse
                                                </span>
                                            </>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Image Info */}
                                    {image && (
                                        <div className="flex flex-1 flex-col justify-center gap-1">
                                            <p className="text-sm font-medium text-gray-700">
                                                {image.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(image.size / 1024).toFixed(2)}{' '}
                                                KB
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Accepted formats: JPG, PNG, GIF
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Product Name"
                                    name="name"
                                    id="name"
                                    required
                                />
                                <Input
                                    type="text"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    placeholder="Category"
                                    name="category"
                                    id="category"
                                    required
                                />
                            </div>

                            <div>
                                <RichTextEditor
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Enter product description..."
                                    minHeight="300px"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(
                                            e.target.value === ''
                                                ? undefined
                                                : Number(e.target.value),
                                        )
                                    }
                                    placeholder="Price"
                                    name="price"
                                    id="price"
                                    required
                                />

                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    options={[
                                        { value: '', label: 'Set Status' },
                                        {
                                            value: 'Available',
                                            label: 'Available',
                                        },
                                        {
                                            value: 'Unavailable',
                                            label: 'Unavailable',
                                        },
                                    ]}
                                    placeholder="Status"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] items-center justify-center py-8">
                            <div style={{ transform: 'scale(0.5)' }}>
                                <Mosaic
                                    color="#F96901"
                                    size="small"
                                    text=""
                                    textColor=""
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <div className="mt-4 flex justify-end border-gray-200 pt-4">
                            <div className="border-r px-4 py-2 pr-2 pl-2 text-sm text-gray-500">
                                <p>Created At:</p>
                                {createdAt}
                            </div>
                            <div className="px-4 py-2 pr-2 pl-2 text-sm text-gray-500">
                                <p>Updated At:</p>
                                {updatedAt}
                            </div>
                        </div>

                        {/* =========== */}

                        <div className="mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4">
                            <button
                                type="button"
                                onClick={handleModalClose}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg bg-[#F96901] px-4 py-2 text-white transition-colors hover:bg-[#d85a01] disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Applying</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Apply</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

function StickyHeadTable({ rows }: StickyHeadTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
    const [tableRows, setTableRows] = useState<TableAttribProps[]>(rows);

    useEffect(() => {
        setTableRows(rows);
    }, [rows]);

    // edit modal
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [productId, setProductId] = useState<string>('');

    // button
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenEdit = (productId: string) => {
        setOpenEdit(true);
        setProductId(productId);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setProductId('');
    };

    const handleProductDelete = (productId: string) => {
        setDeletingIds((prev) => new Set(prev).add(productId));
        router.delete(`/products/delete/${productId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                toast.success('Product deleted successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    icon: <CheckCircle2 size={20} />,
                });
            },
            onError: (errors) => {
                setDeletingIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                console.error('Deletion errors:', errors);
                toast.error('Failed to delete product!', {
                    position: 'top-right',
                    autoClose: 5000,
                    icon: <XCircle size={20} />,
                });
            },
        });
    };

    const handleAddProduct = () => {
        setOpenAddProduct(true);
    };

    const handleOnCloseModal = () => {
        setOpenAddProduct(false);
    };

    const handleSearching = (keyword: string) => {
        if (!keyword.trim()) {
            setTableRows(rows);
            return;
        }

        let keywordLowered = keyword.toLowerCase();

        const filtered = rows.filter(
            (item) =>
                item.name.toLowerCase().includes(keywordLowered) ||
                item.category.toLowerCase().includes(keywordLowered) ||
                item.price
                    .toLocaleString('en-Us')
                    .toLowerCase()
                    .includes(keywordLowered) ||
                item.productId.toLowerCase().includes(keywordLowered) ||
                item.status.toLowerCase().includes(keywordLowered),
        );
        setTableRows(filtered);
    };

    return (
        <>
            <EditProductModal
                open={openEdit}
                handleClose={handleCloseEdit}
                style={modalStyle}
                data={productId}
            />

            <AddProductModal
                open={openAddProduct}
                handleClose={handleOnCloseModal}
                style={modalStyle}
            />
            <div className="rounded-lg bg-white shadow">
                <div className="flex items-center justify-between gap-4 p-4">
                    <input
                        onChange={(e) => handleSearching(e.target.value)}
                        className="flex-1 rounded border border-gray-400 p-2 outline-none focus:border-[#F96901] focus:ring-1 focus:ring-[#F96901]"
                        type="text"
                        placeholder="Search Product"
                    />
                    <button
                        onClick={handleAddProduct}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F96901] px-4 py-2 text-white transition-colors hover:bg-[#d85a01]"
                    >
                        <Plus size={20} />
                        <span>Add Product</span>
                    </button>
                </div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer
                        className="scrollbar-thin"
                        sx={{ maxHeight: 420 }}
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
                                {tableRows
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage,
                                    )
                                    .map((row) => {
                                        const isDeleting = deletingIds.has(
                                            row.productId,
                                        );

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.productId}
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
                                                                            handleOpenEdit(
                                                                                row.productId,
                                                                            );
                                                                        }}
                                                                        className="cursor-pointer rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleProductDelete(
                                                                                row.productId,
                                                                            );
                                                                        }}
                                                                        className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                                        title="Delete"
                                                                        disabled={
                                                                            isDeleting
                                                                        }
                                                                    >
                                                                        {isDeleting ? (
                                                                            <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                                                        ) : (
                                                                            <Trash2
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        )}
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
                    {/* how can I add button here? */}
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

export default function Product({ products = [] }: ProductsPageProps) {
    const [rows, setRows] = useState<TableAttribProps[]>(products);
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!window.Echo) {
            console.error('Echo is not initialized');
            return;
        }

        const channel = window.Echo.channel('products');

        channel.listen('.product.created', (e: any) => {
            setRows((prevRows) => {
                // Replace 'orderId' with the correct unique key if different
                if (prevRows.some((row) => row.productId === e.productId)) {
                    return prevRows;
                }
                return [e, ...prevRows];
            });
        });

        channel.listen('.product.updated', (e: any) => {
            setRows((prev) =>
                prev.map((p) =>
                    p.productId === e.productId ? { ...p, ...e } : p,
                ),
            );
        });

        channel.listen('.product.deleted', (e: any) => {
            setRows((prev) => prev.filter((p) => p.productId !== e.productId));
        });

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
