<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/users';
    private User $admin;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    public function test_list_users(): void
    {
        User::factory(2)->create();

        $res = $this->withToken($this->token)->getJson($this->baseUrl);

        $res->assertStatus(200);
        $this->assertCount(3, $res['data']);
    }

    public function test_create_user(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'name' => 'New Staff',
            'email' => 'newstaff@test.com',
            'password' => 'password123',
            'role' => 'staff',
        ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'newstaff@test.com', 'role' => 'staff']);
    }

    public function test_create_user_validates_role(): void
    {
        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'name' => 'Invalid',
            'email' => 'invalid@test.com',
            'password' => 'password123',
            'role' => 'superadmin',
        ]);

        $res->assertStatus(422);
    }

    public function test_create_user_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existing@test.com']);

        $res = $this->withToken($this->token)->postJson($this->baseUrl, [
            'name' => 'Test',
            'email' => 'existing@test.com',
            'password' => 'password123',
            'role' => 'staff',
        ]);

        $res->assertStatus(422);
    }

    public function test_update_user(): void
    {
        $user = User::factory()->staff()->create();

        $res = $this->withToken($this->token)->putJson("{$this->baseUrl}/{$user->id}", [
            'name' => 'Updated Name',
        ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name']);
    }

    public function test_toggle_active(): void
    {
        $user = User::factory()->staff()->create();

        $res = $this->withToken($this->token)->patchJson("{$this->baseUrl}/{$user->id}/toggle");

        $res->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_active' => false]);
    }

    public function test_cannot_deactivate_self(): void
    {
        $res = $this->withToken($this->token)->patchJson("{$this->baseUrl}/{$this->admin->id}/toggle");

        $res->assertStatus(403);
    }

    public function test_staff_cannot_access_user_management(): void
    {
        $staff = User::factory()->staff()->create();
        $staffToken = $staff->createToken('test')->plainTextToken;

        $res = $this->withToken($staffToken)->getJson($this->baseUrl);

        $res->assertStatus(403);
    }
}
