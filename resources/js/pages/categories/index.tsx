import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Tag, Edit, Trash2, Eye, Package } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string | null;
    slug: string;
    is_active: boolean;
    products_count: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

interface Props {
    categories: {
        data: Category[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        status?: string;
        sort?: string;
        direction?: string;
    };
    auth: {
        user: {
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function CategoriesIndex({ categories, filters, auth }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const isAdmin = auth.user.role === 'admin';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/categories', { ...filters, search: searchTerm, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/categories', { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (category: Category) => {
        if (category.products_count > 0) {
            alert(`Cannot delete category "${category.name}" because it has ${category.products_count} product(s). Please move or delete all products first.`);
            return;
        }

        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(`/categories/${category.id}`);
        }
    };

    return (
        <AppShell>
            <Head title="Product Categories" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
                        <p className="text-gray-600">Organize your products into categories</p>
                    </div>
                    {isAdmin && (
                        <Link href="/categories/create">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </Link>
                    )}
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
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </form>

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

                            {/* Sort */}
                            <Select
                                value={`${filters.sort || 'created_at'}_${filters.direction || 'desc'}`}
                                onValueChange={(value) => {
                                    const [sort, direction] = value.split('_');
                                    router.get('/categories', { ...filters, sort, direction, page: 1 }, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    });
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                                    <SelectItem value="created_at_desc">Newest First</SelectItem>
                                    <SelectItem value="created_at_asc">Oldest First</SelectItem>
                                    <SelectItem value="products_count_desc">Most Products</SelectItem>
                                    <SelectItem value="products_count_asc">Least Products</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Grid */}
                {categories.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.data.map((category) => (
                            <Card key={category.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center">
                                            <Tag className="h-5 w-5 mr-2 text-indigo-600" />
                                            {category.name}
                                        </CardTitle>
                                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {category.description && (
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {category.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Package className="h-4 w-4" />
                                        <span>{category.products_count} product(s)</span>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        Created {new Date(category.created_at).toLocaleDateString()}
                                    </div>

                                    <div className="flex space-x-2 pt-2 border-t">
                                        <Link href={`/categories/${category.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <Link href={`/categories/${category.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(category)}
                                                    className="text-red-600 hover:text-red-700"
                                                    disabled={category.products_count > 0}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
                            <p className="text-gray-500 mb-4">
                                {isAdmin 
                                    ? "Get started by creating your first product category"
                                    : "No categories match your search criteria"
                                }
                            </p>
                            {isAdmin && (
                                <Link href="/categories/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Category
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {categories.links && categories.links.length > 3 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            {categories.links.map((link, index) => (
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