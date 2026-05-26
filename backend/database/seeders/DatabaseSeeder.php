<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo users
        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@pos.coffee',
        ]);

        User::factory()->kasir()->create([
            'name' => 'Kasir 1',
            'email' => 'kasir@pos.coffee',
        ]);

        User::factory()->barista()->create([
            'name' => 'Barista 1',
            'email' => 'barista@pos.coffee',
        ]);

        // Demo categories
        $kopi = Category::factory()->create(['name' => 'Kopi', 'description' => 'Minuman kopi']);
        $nonKopi = Category::factory()->create(['name' => 'Non-Kopi', 'description' => 'Minuman non-kopi']);
        $teh = Category::factory()->create(['name' => 'Teh', 'description' => 'Minuman teh']);
        $snack = Category::factory()->create(['name' => 'Makanan Ringan', 'description' => 'Cemilan dan pastry']);
        $makanan = Category::factory()->create(['name' => 'Makanan Berat', 'description' => 'Makanan utama']);

        // Demo menu items
        $items = [
            ['name' => 'Espresso', 'price' => 18000, 'category_id' => $kopi->id],
            ['name' => 'Cappuccino', 'price' => 25000, 'category_id' => $kopi->id],
            ['name' => 'Caffe Latte', 'price' => 25000, 'category_id' => $kopi->id],
            ['name' => 'Americano', 'price' => 22000, 'category_id' => $kopi->id],
            ['name' => 'Caramel Macchiato', 'price' => 30000, 'category_id' => $kopi->id],
            ['name' => 'Mocha', 'price' => 28000, 'category_id' => $kopi->id],
            ['name' => 'Matcha Latte', 'price' => 28000, 'category_id' => $nonKopi->id],
            ['name' => 'Chocolate', 'price' => 25000, 'category_id' => $nonKopi->id],
            ['name' => 'Red Velvet', 'price' => 28000, 'category_id' => $nonKopi->id],
            ['name' => 'Fresh Orange Juice', 'price' => 20000, 'category_id' => $nonKopi->id],
            ['name' => 'Green Tea', 'price' => 15000, 'category_id' => $teh->id],
            ['name' => 'Earl Grey Tea', 'price' => 15000, 'category_id' => $teh->id],
            ['name' => 'Thai Tea', 'price' => 18000, 'category_id' => $teh->id],
            ['name' => 'Croissant', 'price' => 20000, 'category_id' => $snack->id],
            ['name' => 'Banana Bread', 'price' => 18000, 'category_id' => $snack->id],
            ['name' => 'Cheesecake', 'price' => 25000, 'category_id' => $snack->id],
            ['name' => 'French Fries', 'price' => 22000, 'category_id' => $snack->id],
            ['name' => 'Nasi Goreng', 'price' => 30000, 'category_id' => $makanan->id],
            ['name' => 'Mie Goreng', 'price' => 28000, 'category_id' => $makanan->id],
            ['name' => 'Chicken Wrap', 'price' => 32000, 'category_id' => $makanan->id],
        ];

        foreach ($items as $item) {
            MenuItem::factory()->create($item);
        }

        // Demo tables
        for ($i = 1; $i <= 10; $i++) {
            Table::factory()->create([
                'table_number' => (string) $i,
                'capacity' => $i <= 4 ? 2 : ($i <= 8 ? 4 : 6),
            ]);
        }
    }
}
