<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuItemTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/menu-items';

    private User $admin;

    private Category $category;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->category = Category::factory()->create();
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    public function test_list_menu_items(): void
    {
        MenuItem::factory(3)->create(['category_id' => $this->category->id]);

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $res->assertStatus(200);
    }

    public function test_filter_by_category(): void
    {
        $cat2 = Category::factory()->create();
        MenuItem::factory()->create(['category_id' => $this->category->id]);
        MenuItem::factory()->create(['category_id' => $cat2->id]);

        $res = $this->withToken($this->token)->getJson("{$this->baseUrl}?category_id={$this->category->id}");

        $res->assertStatus(200);
        $this->assertCount(1, $res['data']['data']);
    }

    public function test_create_menu_item(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'category_id' => $this->category->id,
            'name' => 'Cappuccino',
            'price' => 25000,
            'stock_qty' => 10,
        ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('menu_items', ['name' => 'Cappuccino']);
    }

    public function test_create_requires_valid_category(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'category_id' => 999,
            'name' => 'Test',
            'price' => 10000,
        ]);

        $res->assertStatus(422);
    }

    public function test_show_menu_item_with_category(): void
    {
        $item = MenuItem::factory()->create(['category_id' => $this->category->id]);

        $res = $this->withToken($this->token)->getJson("{$this->baseUrl}/{$item->id}");

        $res->assertStatus(200)->assertJsonPath('data.category_id', $this->category->id);
    }

    public function test_update_menu_item(): void
    {
        $item = MenuItem::factory()->create(['category_id' => $this->category->id]);

        $res = $this->withToken($this->token)->putJson("{$this->baseUrl}/{$item->id}", [
            'price' => 30000,
        ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('menu_items', ['id' => $item->id, 'price' => 30000]);
    }

    public function test_update_stock(): void
    {
        $item = MenuItem::factory()->create(['category_id' => $this->category->id, 'stock_qty' => 10]);

        $res = $this->withToken($this->token)->patchJson("{$this->baseUrl}/{$item->id}/stock", [
            'stock_qty' => 5,
        ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('menu_items', ['id' => $item->id, 'stock_qty' => 5]);
    }

    public function test_delete_menu_item(): void
    {
        $item = MenuItem::factory()->create(['category_id' => $this->category->id]);

        $res = $this->withToken($this->token)->deleteJson("{$this->baseUrl}/{$item->id}");

        $res->assertStatus(204);
    }

    public function test_low_stock_indicator(): void
    {
        MenuItem::factory()->create(['category_id' => $this->category->id, 'stock_qty' => 2, 'stock_min_threshold' => 5]);

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $res->assertStatus(200);
    }
}
