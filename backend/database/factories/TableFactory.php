<?php

namespace Database\Factories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

class TableFactory extends Factory
{
    protected $model = Table::class;

    public function definition(): array
    {
        return [
            'table_number' => (string) fake()->unique()->numberBetween(1, 20),
            'capacity' => fake()->randomElement([2, 4, 6]),
            'status' => 'available',
        ];
    }

    public function occupied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'occupied',
        ]);
    }
}
