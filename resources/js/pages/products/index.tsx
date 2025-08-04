import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, Edit, Trash2, Eye, Grid, List } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    stock_quantity: number;
    image: string | null;
    is_active: boolean;
    category: {
        id: number;
        name: string;
    };
    created_by: {
        name: string;
    };
    [key: string]: unknown;
}

interface Category {
    id: number;
    name: string;
    [key: string]: unknown;
}

interface Props {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
        stock?: string;
        sort?: string;
        direction?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', { ...filters, search: searchTerm, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/products', { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(`/products/${product.id}`, {
                onSuccess: () => {
                    // Success handled by flash message
                }
            });
        }
    };

    return (
        <AppShell>
            <Head title="My Products" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                        <p className="text-gray-600">Manage your product catalog</p>
                    </div>
                    <Link href="/products/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-end">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </form>

                            {/* Category Filter */}
                            <Select
                                value={filters.category || ''}
                                onValueChange={(value) => handleFilterChange('category', value)}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select
                                value={filters.status || ''}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Stock Filter */}
                            <Select
                                value={filters.stock || ''}
                                onValueChange={(value) => handleFilterChange('stock', value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Stock Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Stock</SelectItem>
                                    <SelectItem value="in_stock">In Stock</SelectItem>
                                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Mode Toggle */}
                            <div className="flex border rounded-md">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-r-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-l-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid/List */}
                {products.data.length > 0 ? (
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }>
                        {products.data.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                {viewMode === 'grid' ? (
                                    <>
                                        <CardHeader className="p-0">
                                            <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-t-lg"
                                                    />
                                                ) : (
                                                    <Package className="h-16 w-16 text-gray-400" />
                                                )}
                                                <div className="absolute top-2 right-2 space-x-1">
                                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <CardTitle className="text-lg mb-2 line-clamp-2">
                                                {product.name}
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-indigo-600">
                                                        ${product.price}
                                                    </span>
                                                    <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                                                        Stock: {product.stock_quantity}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Category: {product.category.name}
                                                </div>
                                                {product.sku && (
                                                    <div className="text-sm text-gray-500">
                                                        SKU: {product.sku}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link href={`/products/${product.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/products/${product.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </>
                                ) : (
                                    <CardContent className="p-4 flex items-center space-x-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Package className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                                <div className="flex space-x-1">
                                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xl font-bold text-indigo-600">
                                                    ${product.price}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">{product.category.name}</Badge>
                                                    <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                                                        Stock: {product.stock_quantity}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {product.sku && (
                                                    <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                                                )}
                                                <div className="flex space-x-2">
                                                    <Link href={`/products/${product.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/products/${product.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(product)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4">Get started by adding your first product</p>
                            <Link href="/products/create">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            {products.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(link.url);
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}