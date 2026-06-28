<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/categories';

    private User $admin;

    private User $staff;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->staff = User::factory()->staff()->create();
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    public function test_list_categories(): void
    {
        Category::factory(3)->create();

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $res->assertStatus(200)->assertJsonCount(3, 'data');
    }

    public function test_list_only_active_categories(): void
    {
        Category::factory()->create(['is_active' => true]);
        Category::factory()->inactive()->create();

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $res->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_category(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'name' => 'Minuman Baru',
        ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('categories', ['name' => 'Minuman Baru']);
    }

    public function test_create_requires_name(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, []);

        $res->assertStatus(422);
    }

    public function test_show_category(): void
    {
        $category = Category::factory()->create();

        $res = $this->withToken($this->token)->getJson("{$this->baseUrl}/{$category->id}");

        $res->assertStatus(200)->assertJsonPath('data.id', $category->id);
    }

    public function test_update_category(): void
    {
        $category = Category::factory()->create();

        $res = $this->withToken($this->token)->putJson("{$this->baseUrl}/{$category->id}", [
            'name' => 'Updated Name',
        ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Updated Name']);
    }

    public function test_delete_category(): void
    {
        $category = Category::factory()->create();

        $res = $this->withToken($this->token)->deleteJson("{$this->baseUrl}/{$category->id}");

        $res->assertStatus(204);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $res = $this->getJson($this->baseUrl);
        $res->assertStatus(401);
    }
}
