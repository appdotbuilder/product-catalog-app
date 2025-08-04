<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - product catalog
Route::get('/', [HomeController::class, 'index'])->name('home');

// Dashboard redirects to products
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('products.index');
    })->name('dashboard');
});

// Product routes - authenticated users only
Route::middleware('auth')->group(function () {
    Route::resource('products', ProductController::class);
});

// Category routes - admin only for create/edit/delete, all users can view
Route::middleware('auth')->group(function () {
    Route::resource('categories', ProductCategoryController::class)
        ->names([
            'index' => 'categories.index',
            'create' => 'categories.create',
            'store' => 'categories.store',
            'show' => 'categories.show',
            'edit' => 'categories.edit',
            'update' => 'categories.update',
            'destroy' => 'categories.destroy',
        ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
