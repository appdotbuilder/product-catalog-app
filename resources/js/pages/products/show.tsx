import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Package, User, Calendar, Tag, DollarSign, Archive } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string | null;
    stock_quantity: number;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
    };
    created_by: {
        id: number;
        name: string;
    };
    [key: string]: unknown;
}

interface Props {
    product: Product;
    [key: string]: unknown;
}

export default function ProductShow({ product }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(`/products/${product.id}`, {
                onSuccess: () => {
                    router.visit('/products');
                }
            });
        }
    };

    const canEdit = () => {
        // Users can edit their own products, this would be handled by the backend
        return true;
    };

    return (
        <AppShell>
            <Head title={product.name} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                    {product.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    {canEdit() && (
                        <div className="flex space-x-2">
                            <Link href={`/products/${product.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Image */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Package className="h-24 w-24 text-gray-400" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {product.description ? (
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No description provided.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Product Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Price</p>
                                        <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Archive className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Stock Quantity</p>
                                        <p className="text-lg font-semibold">{product.stock_quantity}</p>
                                    </div>
                                </div>

                                {product.sku && (
                                    <div className="flex items-center space-x-3">
                                        <Tag className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">SKU</p>
                                            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                {product.sku}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <Tag className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Category</p>
                                        <Badge variant="outline">{product.category.name}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Meta Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Created By</p>
                                        <p className="text-sm">{product.created_by.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Created</p>
                                        <p className="text-sm">
                                            {new Date(product.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                        <p className="text-sm">
                                            {new Date(product.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}