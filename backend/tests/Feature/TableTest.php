<?php

namespace Tests\Feature;

use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TableTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/tables';

    private User $admin;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    public function test_list_tables(): void
    {
        Table::factory(3)->create();

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $res->assertStatus(200)->assertJsonCount(3, 'data');
    }

    public function test_create_table(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'table_number' => 10,
            'capacity' => 4,
        ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('tables', ['table_number' => '10']);
    }

    public function test_create_duplicate_table_number(): void
    {
        Table::factory()->create(['table_number' => '5']);

        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'table_number' => 5,
            'capacity' => 4,
        ]);

        $res->assertStatus(422);
    }

    public function test_show_table(): void
    {
        $table = Table::factory()->create();

        $res = $this->withToken($this->token)->getJson("{$this->baseUrl}/{$table->id}");

        $res->assertStatus(200);
    }

    public function test_update_table(): void
    {
        $table = Table::factory()->create();

        $res = $this->withToken($this->token)->putJson("{$this->baseUrl}/{$table->id}", [
            'capacity' => 6,
        ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('tables', ['id' => $table->id, 'capacity' => 6]);
    }

    public function test_delete_table(): void
    {
        $table = Table::factory()->create();

        $res = $this->withToken($this->token)->deleteJson("{$this->baseUrl}/{$table->id}");

        $res->assertStatus(204);
    }

    public function test_tables_ordered_by_number(): void
    {
        Table::factory()->create(['table_number' => '3']);
        Table::factory()->create(['table_number' => '1']);
        Table::factory()->create(['table_number' => '2']);

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $numbers = collect($res['data'])->pluck('table_number')->toArray();
        $this->assertEquals(['1', '2', '3'], $numbers);
    }
}
