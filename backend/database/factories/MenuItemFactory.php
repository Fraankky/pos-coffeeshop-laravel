<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 8000, 50000),
            'image' => null,
            'is_available' => true,
            'stock_qty' => fake()->numberBetween(0, 100),
            'stock_min_threshold' => 5,
        ];
    }

    public function unavailable(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_available' => false,
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_qty' => 2,
            'stock_min_threshold' => 5,
        ]);
    }
}
