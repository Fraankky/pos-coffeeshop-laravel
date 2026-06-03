<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private User $staff;
    private MenuItem $item;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->staff = User::factory()->staff()->create();
        $this->token = $this->staff->createToken('test')->plainTextToken;

        $category = Category::factory()->create();
        $this->item = MenuItem::factory()->create([
            'category_id' => $category->id,
            'price' => 25000,
            'stock_qty' => 10,
        ]);
    }

    public function test_create_order(): void
    {
        $res = $this->withToken($this->token)->postJson('/api/v1/orders', [
            'order_type' => 'takeaway',
            'items' => [
                ['menu_item_id' => $this->item->id, 'quantity' => 2],
            ],
        ]);

        $res->assertStatus(201);

        $this->assertDatabaseHas('orders', ['order_type' => 'takeaway']);
        $this->assertDatabaseHas('order_items', ['quantity' => 2]);
        $this->assertDatabaseHas('menu_items', ['id' => $this->item->id, 'stock_qty' => 8]);
    }

    public function test_create_order_dine_in(): void
    {
        $table = Table::factory()->create();

        $res = $this->withToken($this->token)->postJson('/api/v1/orders', [
            'order_type' => 'dine_in',
            'table_id' => $table->id,
            'items' => [
                ['menu_item_id' => $this->item->id, 'quantity' => 1],
            ],
        ]);

        $res->assertStatus(201);
    }

    public function test_create_order_insufficient_stock(): void
    {
        $this->item->update(['stock_qty' => 1]);

        $res = $this->withToken($this->token)->postJson('/api/v1/orders', [
            'order_type' => 'takeaway',
            'items' => [
                ['menu_item_id' => $this->item->id, 'quantity' => 5],
            ],
        ]);

        $res->assertStatus(422);
    }

    public function test_create_order_requires_items(): void
    {
        $res = $this->withToken($this->token)->postJson('/api/v1/orders', [
            'order_type' => 'takeaway',
            'items' => [],
        ]);

        $res->assertStatus(422);
    }

    public function test_list_orders(): void
    {
        $res = $this->withToken($this->token)->getJson('/api/v1/orders');
        $res->assertStatus(200);
    }

    public function test_show_order(): void
    {
        $order = $this->createOrder();

        $res = $this->withToken($this->token)->getJson("/api/v1/orders/{$order->id}");

        $res->assertStatus(200);
    }

    public function test_update_status(): void
    {
        $order = $this->createOrder();

        $res = $this->withToken($this->token)->patchJson("/api/v1/orders/{$order->id}/status", [
            'status' => 'in_progress',
        ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'in_progress']);
    }

    public function test_cancel_order_restores_stock(): void
    {
        $this->item->update(['stock_qty' => 5]);
        $order = $this->createOrder();

        $this->withToken($this->token)
            ->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'cancelled']);

        $this->assertDatabaseHas('menu_items', ['id' => $this->item->id, 'stock_qty' => 5]);
    }

    public function test_invalid_status_transition(): void
    {
        $order = $this->createOrder();

        $res = $this->withToken($this->token)
            ->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'completed']);

        $res->assertStatus(422);
    }

    public function test_active_orders(): void
    {
        $this->createOrder();

        $res = $this->withToken($this->token)->getJson('/api/v1/orders/active');

        $res->assertStatus(200);
        $this->assertGreaterThan(0, count($res['data']));
    }

    private function createOrder(): mixed
    {
        return $this->staff->orders()->create([
            'order_type' => 'takeaway',
            'status' => 'received',
            'total_amount' => $this->item->price,
        ])->orderItems()->create([
            'menu_item_id' => $this->item->id,
            'quantity' => 1,
            'unit_price' => $this->item->price,
            'subtotal' => $this->item->price,
        ])->order;
    }
}
