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
            'email' => 'admin@flocoffee.com',
        ]);

        User::factory()->staff()->create([
            'name' => 'Staff Kasir',
            'email' => 'staff@flocoffee.com',
        ]);

        // Demo categories
        $kopi     = Category::factory()->create(['name' => 'Kopi', 'description' => 'Minuman kopi segar']);
        $nonKopi  = Category::factory()->create(['name' => 'Non-Kopi', 'description' => 'Minuman non-kopi']);
        $teh      = Category::factory()->create(['name' => 'Teh', 'description' => 'Aneka teh pilihan']);
        $snack    = Category::factory()->create(['name' => 'Makanan Ringan', 'description' => 'Cemilan & pastry']);
        $makanan  = Category::factory()->create(['name' => 'Makanan Berat', 'description' => 'Makanan utama']);

        $img = fn (string $id) => "https://images.unsplash.com/{$id}?w=600&h=500&fit=crop&crop=center";

        $items = [
            // ── Kopi (14 items) ──
            ['name' => 'Espresso',              'description' => 'Shot espresso murni, bold & intense.',           'price' => 18000, 'category_id' => $kopi->id, 'image' => $img('photo-1510591509098-f4fdc6d0ff04')],
            ['name' => 'Double Espresso',       'description' => 'Double shot untuk pecinta kopi sejati.',         'price' => 22000, 'category_id' => $kopi->id, 'image' => $img('photo-1509042239860-f550ce710b93')],
            ['name' => 'Americano',             'description' => 'Espresso + air panas, ringan & smooth.',         'price' => 22000, 'category_id' => $kopi->id, 'image' => $img('photo-1551030173-122aabc4489c')],
            ['name' => 'Long Black',            'description' => 'Air panas dituang, espresso di atasnya.',         'price' => 22000, 'category_id' => $kopi->id, 'image' => $img('photo-1559496417-e7f25cb247f3')],
            ['name' => 'Cappuccino',            'description' => 'Espresso + steamed milk + thick foam.',          'price' => 25000, 'category_id' => $kopi->id, 'image' => $img('photo-1572442388796-11668a67e53d')],
            ['name' => 'Caffe Latte',           'description' => 'Espresso + steamed milk, creamy & smooth.',      'price' => 25000, 'category_id' => $kopi->id, 'image' => $img('photo-1461023058943-07fcbe16d735')],
            ['name' => 'Vanilla Latte',         'description' => 'Caffe latte dengan vanilla syrup premium.',      'price' => 28000, 'category_id' => $kopi->id, 'image' => $img('photo-1541167760496-1628856ab772')],
            ['name' => 'Hazelnut Latte',        'description' => 'Perpaduan hazelnut dan espresso yang nikmat.',   'price' => 28000, 'category_id' => $kopi->id, 'image' => $img('photo-1503480207415-fdddcc21a3cf')],
            ['name' => 'Caramel Macchiato',     'description' => 'Espresso, susu, vanilla & caramel drizzle.',     'price' => 30000, 'category_id' => $kopi->id, 'image' => $img('photo-1485808191679-5f86510681a2')],
            ['name' => 'Mocha',                 'description' => 'Espresso + chocolate + steamed milk.',           'price' => 28000, 'category_id' => $kopi->id, 'image' => $img('photo-1578314675249-a6910f80cc4e')],
            ['name' => 'Flat White',            'description' => 'Double ristretto + microfoam susu halus.',       'price' => 28000, 'category_id' => $kopi->id, 'image' => $img('photo-1577968897966-3d4325b36b61')],
            ['name' => 'Cold Brew',             'description' => 'Seduhan dingin 12 jam, smooth & low acid.',      'price' => 30000, 'category_id' => $kopi->id, 'image' => $img('photo-1517959105821-eaf2591984ca')],
            ['name' => 'Iced Coffee Milk',      'description' => 'Kopi susu dingin segar favorit semua umur.',     'price' => 25000, 'category_id' => $kopi->id, 'image' => $img('photo-1517701604599-bb29b5dd7359')],
            ['name' => 'Manual Brew V60',       'description' => 'Single-origin manual brew metode V60.',          'price' => 32000, 'category_id' => $kopi->id, 'image' => $img('photo-1497935586351-b67a33e84bfe')],

            // ── Non-Kopi (8 items) ──
            ['name' => 'Matcha Latte',          'description' => 'Matcha Jepang + susu steamed, earthy & creamy.',  'price' => 28000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1536256263959-770b48d82b0a')],
            ['name' => 'Chocolate',             'description' => 'Cokelat Belgia panas dengan whipped cream.',       'price' => 25000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1603459014227-2252a3c0d265')],
            ['name' => 'Red Velvet',            'description' => 'Minuman red velvet creamy dengan cream cheese.',  'price' => 28000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1586788680434-30d324b2d46f')],
            ['name' => 'Taro Latte',            'description' => 'Ube taro + susu, manis legit khas Nusantara.',     'price' => 28000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1558857563-c502823f2664')],
            ['name' => 'Fresh Orange Juice',    'description' => 'Jus jeruk peras segar tanpa gula tambahan.',       'price' => 20000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1621506289937-a8e4df240d0b')],
            ['name' => 'Lemon Squash',          'description' => 'Lemon segar + soda, asam manis menyegarkan.',      'price' => 18000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1513558161293-1d2b587c6f1e')],
            ['name' => 'Lychee Yakult',         'description' => 'Perpaduan yakult & lychee, manis dan segar.',      'price' => 20000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1551024601224-1f697f65cc57')],
            ['name' => 'Mineral Water',         'description' => 'Air mineral dingin botolan.',                      'price' =>  7000, 'category_id' => $nonKopi->id, 'image' => $img('photo-1523362628745-4c15015b8546')],

            // ── Teh (6 items) ──
            ['name' => 'Green Tea',             'description' => 'Teh hijau Jepang berkualitas premium.',            'price' => 15000, 'category_id' => $teh->id, 'image' => $img('photo-1627435601361-ec25f5b1d0e5')],
            ['name' => 'Earl Grey Tea',         'description' => 'Teh hitam bergamot klasik aromatik.',             'price' => 15000, 'category_id' => $teh->id, 'image' => $img('photo-1597318181409-cf64d0b5d8a2')],
            ['name' => 'Thai Tea',              'description' => 'Teh tarik Thailand, manis & creamy khas.',         'price' => 18000, 'category_id' => $teh->id, 'image' => $img('photo-1563379926898-05f4575a45d8')],
            ['name' => 'Lemon Tea',             'description' => 'Teh segar dengan perasan lemon pilihan.',          'price' => 15000, 'category_id' => $teh->id, 'image' => $img('photo-1556679343374-c4773a2c7f95')],
            ['name' => 'Lychee Tea',            'description' => 'Teh lychee manis dengan aroma buah tropis.',       'price' => 18000, 'category_id' => $teh->id, 'image' => $img('photo-1563911892310-f56cfa2b2e3c')],
            ['name' => 'Peach Tea',             'description' => 'Teh peach segar, favorit saat cuaca panas.',       'price' => 18000, 'category_id' => $teh->id, 'image' => $img('photo-1523921875593-30247830f44c')],

            // ── Makanan Ringan (9 items) ──
            ['name' => 'Croissant',             'description' => 'Croissant butter Prancis, flaky & renyah.',         'price' => 20000, 'category_id' => $snack->id, 'image' => $img('photo-1555507036-ab1f4038024a')],
            ['name' => 'Almond Croissant',      'description' => 'Croissant isi almond cream panggang.',              'price' => 25000, 'category_id' => $snack->id, 'image' => $img('photo-1509365465985-25d11c28e689')],
            ['name' => 'Banana Bread',          'description' => 'Banana bread homemade, lembut & wangi.',            'price' => 18000, 'category_id' => $snack->id, 'image' => $img('photo-1604909052743-94e838986d24')],
            ['name' => 'Cheesecake',            'description' => 'New York cheesecake dengan berry compote.',         'price' => 25000, 'category_id' => $snack->id, 'image' => $img('photo-1533134242443-d4fd215305ad')],
            ['name' => 'Brownies',              'description' => 'Brownies cokelat fudgy, lumer di mulut.',           'price' => 18000, 'category_id' => $snack->id, 'image' => $img('photo-1606313564200-e75d5e30476c')],
            ['name' => 'French Fries',          'description' => 'Kentang goreng renyah + saus pilihan.',             'price' => 22000, 'category_id' => $snack->id, 'image' => $img('photo-1573080496219-bb080dd4f877')],
            ['name' => 'Onion Rings',           'description' => 'Cincin bawang goreng crispy, camilan gurih.',       'price' => 18000, 'category_id' => $snack->id, 'image' => $img('photo-1639024471283-03510ba21258')],
            ['name' => 'Churros',               'description' => 'Churros cinnamon sugar + cokelat dip.',             'price' => 20000, 'category_id' => $snack->id, 'image' => $img('photo-1624371419438-5f2e4e6e86f4')],
            ['name' => 'Toast Kaya Butter',     'description' => 'Roti panggang selai kaya + butter slab.',           'price' => 15000, 'category_id' => $snack->id, 'image' => $img('photo-1529155421415-f21b8f62e719')],

            // ── Makanan Berat (8 items) ──
            ['name' => 'Nasi Goreng',           'description' => 'Nasi goreng spesial + telur mata sapi.',           'price' => 30000, 'category_id' => $makanan->id, 'image' => $img('photo-1512058564366-18510be2db19')],
            ['name' => 'Mie Goreng',            'description' => 'Mie goreng Jawa lengkap + ayam sayur.',            'price' => 28000, 'category_id' => $makanan->id, 'image' => $img('photo-1552611052-33e04de1b100')],
            ['name' => 'Chicken Wrap',          'description' => 'Tortilla isi ayam, sayur segar & saus.',           'price' => 32000, 'category_id' => $makanan->id, 'image' => $img('photo-1626700051175-6818013e1d4f')],
            ['name' => 'Chicken Katsu Rice',    'description' => 'Nasi putih + chicken katsu + curry sauce.',        'price' => 35000, 'category_id' => $makanan->id, 'image' => $img('photo-1569058242567-93b2c192a422')],
            ['name' => 'Beef Rice Bowl',        'description' => 'Beef bowl ala Jepang dengan saus teriyaki.',       'price' => 35000, 'category_id' => $makanan->id, 'image' => $img('photo-1567620905732-2d1ec7ab7445')],
            ['name' => 'Carbonara Pasta',       'description' => 'Pasta carbonara creamy dengan beef bacon.',        'price' => 32000, 'category_id' => $makanan->id, 'image' => $img('photo-1612874742237-6526221588e3')],
            ['name' => 'Aglio Olio',            'description' => 'Spaghetti aglio olio, garlic & chili flakes.',     'price' => 28000, 'category_id' => $makanan->id, 'image' => $img('photo-1608215636497-c55e2f620ba3')],
            ['name' => 'Chicken Sandwich',      'description' => 'Sandwich ayam panggang + salad segar.',            'price' => 30000, 'category_id' => $makanan->id, 'image' => $img('photo-1606755962773-d324e99e531b')],
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
