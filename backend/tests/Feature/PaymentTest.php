<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $kasir;
    private Order $order;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->kasir = User::factory()->kasir()->create();
        $this->token = $this->kasir->createToken('test')->plainTextToken;

        $category = Category::factory()->create();
        $item = MenuItem::factory()->create(['category_id' => $category->id, 'price' => 25000, 'stock_qty' => 10]);

        $this->order = $this->kasir->orders()->create([
            'order_type' => 'takeaway',
            'status' => 'received',
            'total_amount' => 50000,
        ]);
        $this->order->orderItems()->create([
            'menu_item_id' => $item->id,
            'quantity' => 2,
            'unit_price' => 25000,
            'subtotal' => 50000,
        ]);
    }

    public function test_cash_payment_exact_amount(): void
    {
        $res = $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'cash',
                'amount_paid' => 50000,
            ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('payments', ['order_id' => $this->order->id, 'change_amount' => 0]);
        $this->assertDatabaseHas('orders', ['id' => $this->order->id, 'status' => 'completed']);
    }

    public function test_cash_payment_with_change(): void
    {
        $res = $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'cash',
                'amount_paid' => 100000,
            ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('payments', ['order_id' => $this->order->id, 'change_amount' => 50000]);
    }

    public function test_qris_payment(): void
    {
        $res = $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'qris_simulated',
                'amount_paid' => 50000,
            ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('payments', ['order_id' => $this->order->id, 'method' => 'qris_simulated']);
    }

    public function test_duplicate_payment_is_rejected(): void
    {
        $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'cash',
                'amount_paid' => 50000,
            ]);

        $res = $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'cash',
                'amount_paid' => 50000,
            ]);

        $res->assertStatus(422);
    }

    public function test_cannot_pay_cancelled_order(): void
    {
        $this->order->update(['status' => 'cancelled']);

        $res = $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'cash',
                'amount_paid' => 50000,
            ]);

        $res->assertStatus(422);
    }

    public function test_show_payment(): void
    {
        $this->withToken($this->token)
            ->postJson("/api/v1/orders/{$this->order->id}/payment", [
                'method' => 'cash',
                'amount_paid' => 50000,
            ]);

        $res = $this->withToken($this->token)
            ->getJson("/api/v1/orders/{$this->order->id}/payment");

        $res->assertStatus(200);
    }

    public function test_show_payment_not_found(): void
    {
        $res = $this->withToken($this->token)
            ->getJson("/api/v1/orders/{$this->order->id}/payment");

        $res->assertStatus(404);
    }
}
