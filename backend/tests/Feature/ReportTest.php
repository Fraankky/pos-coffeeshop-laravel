<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->token = $this->admin->createToken('test')->plainTextToken;

        $category = Category::factory()->create();
        $item = MenuItem::factory()->create(['category_id' => $category->id, 'price' => 25000, 'stock_qty' => 10]);

        $order = $this->admin->orders()->create([
            'order_type' => 'takeaway',
            'status' => 'completed',
            'total_amount' => 50000,
            'created_at' => now(),
        ]);
        $order->orderItems()->create([
            'menu_item_id' => $item->id,
            'quantity' => 2,
            'unit_price' => 25000,
            'subtotal' => 50000,
        ]);
        $order->payment()->create([
            'method' => 'cash',
            'amount_paid' => 50000,
            'change_amount' => 0,
            'payment_status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function test_sales_report(): void
    {
        $res = $this->withToken($this->token)->getJson('/api/v1/reports/sales');

        $res->assertStatus(200);
        $this->assertGreaterThan(0, count($res['data']));
    }

    public function test_sales_report_with_period(): void
    {
        $res = $this->withToken($this->token)
            ->getJson('/api/v1/reports/sales?period=month');

        $res->assertStatus(200);
    }

    public function test_sales_report_with_date_filter(): void
    {
        $today = now()->format('Y-m-d');
        $res = $this->withToken($this->token)
            ->getJson("/api/v1/reports/sales?from={$today}&to={$today}");

        $res->assertStatus(200);
    }

    public function test_top_items(): void
    {
        $res = $this->withToken($this->token)->getJson('/api/v1/reports/top-items');

        $res->assertStatus(200);
        $this->assertGreaterThan(0, count($res['data']));
    }

    public function test_export_csv(): void
    {
        $res = $this->withToken($this->token)->getJson('/api/v1/reports/export');

        $res->assertStatus(200);
        $this->assertStringContainsString('text/csv', $res->headers->get('Content-Type'));
    }

    public function test_sales_report_empty_for_future_date(): void
    {
        $res = $this->withToken($this->token)
            ->getJson('/api/v1/reports/sales?from=2099-01-01&to=2099-12-31');

        $res->assertStatus(200);
        $this->assertCount(0, $res['data']);
    }
}
