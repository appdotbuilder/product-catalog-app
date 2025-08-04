<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductCatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create regular users
        $users = User::factory()->user()->count(5)->create();
        $allUsers = collect([$admin])->merge($users);

        // Create categories
        $categories = ProductCategory::factory()->active()->count(8)->create();

        // Create products for each category
        foreach ($categories as $category) {
            Product::factory()
                ->active()
                ->inStock()
                ->count(random_int(3, 8))
                ->create([
                    'category_id' => $category->id,
                    'created_by' => $allUsers->random()->id,
                ]);
        }

        // Create some out of stock products
        Product::factory()
            ->active()
            ->outOfStock()
            ->count(5)
            ->create([
                'category_id' => $categories->random()->id,
                'created_by' => $allUsers->random()->id,
            ]);

        // Create some inactive products
        Product::factory()
            ->inactive()
            ->count(3)
            ->create([
                'category_id' => $categories->random()->id,
                'created_by' => $allUsers->random()->id,
            ]);
    }
}