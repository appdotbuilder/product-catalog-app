<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Product name');
            $table->text('description')->nullable()->comment('Product description');
            $table->decimal('price', 10, 2)->comment('Product price');
            $table->string('sku')->unique()->nullable()->comment('Stock Keeping Unit');
            $table->integer('stock_quantity')->default(0)->comment('Available stock quantity');
            $table->string('image')->nullable()->comment('Product image path');
            $table->foreignId('category_id')->constrained('product_categories')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->boolean('is_active')->default(true)->comment('Whether product is active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('price');
            $table->index('sku');
            $table->index('category_id');
            $table->index('created_by');
            $table->index('is_active');
            $table->index(['is_active', 'category_id']);
            $table->index(['is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};