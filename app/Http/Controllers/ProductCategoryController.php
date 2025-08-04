<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductCategory::query()->withCount('products');
        
        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }
        
        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }
        
        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $categories = $query->paginate(10)->withQueryString();
        
        return Inertia::render('categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductCategoryRequest $request)
    {
        $category = ProductCategory::create($request->validated());

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $category)
    {
        $category->load(['products' => function ($query) {
            $query->with('createdBy')->active()->latest();
        }]);
        
        return Inertia::render('categories/show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $category)
    {
        return Inertia::render('categories/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request, ProductCategory $category)
    {
        $category->update($request->validated());

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $category)
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete category that has products. Please move or delete all products first.');
        }
        
        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}