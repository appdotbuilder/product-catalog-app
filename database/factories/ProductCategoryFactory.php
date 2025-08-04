<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductCategory>
 */
class ProductCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\ProductCategory>
     */
    protected $model = ProductCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'Electronics',
            'Clothing & Fashion',
            'Home & Garden',
            'Sports & Outdoors',
            'Books & Media',
            'Health & Beauty',
            'Toys & Games',
            'Automotive',
            'Food & Beverages',
            'Office Supplies',
            'Pet Supplies',
            'Jewelry & Accessories',
        ]);

        return [
            'name' => $name,
            'description' => $this->faker->paragraph(2),
            'slug' => Str::slug($name),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Indicate that the category is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}