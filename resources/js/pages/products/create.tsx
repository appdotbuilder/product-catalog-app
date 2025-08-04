import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft, Package } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    [key: string]: unknown;
}

interface Props {
    categories: Category[];
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function ProductCreate({ categories, errors = {} }: Props) {
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        stock_quantity: '',
        category_id: '',
        image: null as File | null,
        is_active: true,
    });
    
    const [processing, setProcessing] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData(prev => ({ ...prev, image: file }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('sku', data.sku);
        formData.append('stock_quantity', data.stock_quantity);
        formData.append('category_id', data.category_id);
        formData.append('is_active', data.is_active ? '1' : '0');
        
        if (data.image) {
            formData.append('image', data.image);
        }

        router.post('/products', formData, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <AppShell>
            <Head title="Add New Product" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-gray-600">Create a new product for your catalog</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter product name"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter product description"
                                            rows={4}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div>
                                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                        <Input
                                            id="sku"
                                            type="text"
                                            value={data.sku}
                                            onChange={(e) => setData(prev => ({ ...prev, sku: e.target.value }))}
                                            placeholder="Enter SKU (optional)"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.sku} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing & Inventory */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing & Inventory</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price *</Label>
                                            <div className="relative mt-1">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.price}
                                                    onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
                                                    placeholder="0.00"
                                                    className="pl-8"
                                                />
                                            </div>
                                            <InputError message={errors.price} />
                                        </div>

                                        <div>
                                            <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                                            <Input
                                                id="stock_quantity"
                                                type="number"
                                                min="0"
                                                value={data.stock_quantity}
                                                onChange={(e) => setData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                                                placeholder="0"
                                                className="mt-1"
                                            />
                                            <InputError message={errors.stock_quantity} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Category & Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Category & Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={(value) => setData(prev => ({ ...prev, category_id: value }))}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData(prev => ({ ...prev, is_active: !!checked }))}
                                        />
                                        <Label htmlFor="is_active">Product is active</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Product Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            {imagePreview ? (
                                                <div className="space-y-4">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-h-40 mx-auto rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setData(prev => ({ ...prev, image: null }));
                                                        }}
                                                    >
                                                        Remove Image
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Package className="h-12 w-12 text-gray-400 mx-auto" />
                                                    <div className="text-sm text-gray-600">
                                                        <label htmlFor="image" className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                                                            Upload an image
                                                        </label>
                                                        <input
                                                            id="image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.image} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {processing ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}