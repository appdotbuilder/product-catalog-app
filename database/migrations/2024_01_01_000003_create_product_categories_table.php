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
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Category name');
            $table->text('description')->nullable()->comment('Category description');
            $table->string('slug')->unique()->comment('URL-friendly category identifier');
            $table->boolean('is_active')->default(true)->comment('Whether category is active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('slug');
            $table->index('is_active');
            $table->index(['is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_categories');
    }
};