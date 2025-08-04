<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'stock_quantity' => 'required|integer|min:0|max:999999',
            'category_id' => 'required|exists:product_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.max' => 'Product name cannot exceed 255 characters.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price cannot be negative.',
            'price.max' => 'Price cannot exceed 999,999.99.',
            'sku.unique' => 'A product with this SKU already exists.',
            'stock_quantity.required' => 'Stock quantity is required.',
            'stock_quantity.integer' => 'Stock quantity must be a whole number.',
            'stock_quantity.min' => 'Stock quantity cannot be negative.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category does not exist.',
            'image.image' => 'File must be an image.',
            'image.mimes' => 'Image must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'image.max' => 'Image size cannot exceed 2MB.',
        ];
    }
}