<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with product catalog.
     */
    public function index(Request $request)
    {
        $query = Product::query()->with(['category', 'createdBy'])->active();
        
        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        
        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        
        // Filter by stock
        if ($request->filled('stock') && $request->stock === 'in_stock') {
            $query->inStock();
        }
        
        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $products = $query->paginate(12)->withQueryString();
        $categories = ProductCategory::active()->withCount('products')->orderBy('name')->get();
        
        // Statistics for welcome section
        $stats = [
            'total_products' => Product::active()->count(),
            'total_categories' => ProductCategory::active()->count(),
            'in_stock_products' => Product::active()->inStock()->count(),
            'featured_categories' => ProductCategory::active()->withCount(['products' => function ($query) {
                $query->active();
            }])->orderBy('products_count', 'desc')->take(6)->get(),
        ];
        
        return Inertia::render('welcome', [
            'products' => $products,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['search', 'category', 'stock', 'min_price', 'max_price', 'sort', 'direction']),
            'user' => auth()->user(),
        ]);
    }
}