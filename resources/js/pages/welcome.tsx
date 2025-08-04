import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShoppingCart, Package, Tag, TrendingUp, Grid, List } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image: string | null;
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
    products_count: number;
    [key: string]: unknown;
}

interface Stats {
    total_products: number;
    total_categories: number;
    in_stock_products: number;
    featured_categories: Category[];
}

interface Props {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    stats: Stats;
    filters: {
        search?: string;
        category?: string;
        stock?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        direction?: string;
    };
    user?: {
        id: number;
        name: string;
        role: string;
    } | null;
    [key: string]: unknown;
}

export default function Welcome({ products, categories, stats, filters, user }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { ...filters, search: searchTerm, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/', { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };



    return (
        <>
            <Head title="🛍️ Product Catalog - Your One-Stop Shop" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Navigation */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <ShoppingCart className="h-8 w-8 text-indigo-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">ProductHub</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {user ? (
                                    <>
                                        <span className="text-gray-700">Welcome, {user.name}!</span>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/categories"
                                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                Manage Categories
                                            </Link>
                                        )}
                                        <Link
                                            href="/products"
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            My Products
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                        >
                                            Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            🛍️ Welcome to ProductHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                            Discover amazing products from our extensive catalog
                        </p>
                        
                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <Package className="h-12 w-12 mx-auto mb-2 text-indigo-200" />
                                <div className="text-3xl font-bold">{stats.total_products}</div>
                                <div className="text-indigo-100">Products Available</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <Tag className="h-12 w-12 mx-auto mb-2 text-indigo-200" />
                                <div className="text-3xl font-bold">{stats.total_categories}</div>
                                <div className="text-indigo-100">Categories</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-indigo-200" />
                                <div className="text-3xl font-bold">{stats.in_stock_products}</div>
                                <div className="text-indigo-100">In Stock</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                                            {category.name} ({category.products_count})
                                        </SelectItem>
                                    ))}
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
                                    <SelectItem value="">All Products</SelectItem>
                                    <SelectItem value="in_stock">In Stock</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select
                                value={`${filters.sort || 'created_at'}_${filters.direction || 'desc'}`}
                                onValueChange={(value) => {
                                    const [sort, direction] = value.split('_');
                                    router.get('/', { ...filters, sort, direction, page: 1 }, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    });
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at_desc">Newest First</SelectItem>
                                    <SelectItem value="created_at_asc">Oldest First</SelectItem>
                                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                                    <SelectItem value="price_asc">Price Low-High</SelectItem>
                                    <SelectItem value="price_desc">Price High-Low</SelectItem>
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
                    </div>

                    {/* Products Grid */}
                    {products.data.length > 0 ? (
                        <div className={viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                        }>
                            {products.data.map((product) => (
                                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                    {viewMode === 'grid' ? (
                                        <>
                                            <CardHeader className="p-0">
                                                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-t-lg"
                                                        />
                                                    ) : (
                                                        <Package className="h-16 w-16 text-gray-400" />
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <CardTitle className="text-lg mb-2 line-clamp-2">
                                                    {product.name}
                                                </CardTitle>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-2xl font-bold text-indigo-600">
                                                        ${product.price}
                                                    </span>
                                                    <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                                                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Category: {product.category.name}
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
                                                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-indigo-600">
                                                        ${product.price}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline">{product.category.name}</Badge>
                                                        <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                                                            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                            {user && (
                                <Link href="/products/create">
                                    <Button>Add Your First Product</Button>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="flex justify-center mt-8">
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

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">About ProductHub</h3>
                                <p className="text-gray-300">
                                    Your premier destination for discovering and managing products. 
                                    Join our community and start selling today!
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-gray-300">
                                    {user ? (
                                        <>
                                            <li><Link href="/products" className="hover:text-white">My Products</Link></li>
                                            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
                                        </>
                                    ) : (
                                        <>
                                            <li><Link href="/login" className="hover:text-white">Login</Link></li>
                                            <li><Link href="/register" className="hover:text-white">Register</Link></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Features</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>✅ Easy product management</li>
                                    <li>✅ Category organization</li>
                                    <li>✅ Advanced search & filters</li>
                                    <li>✅ User-friendly interface</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 ProductHub. Built with Laravel & React.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}