<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private string $loginUrl = '/api/v1/auth/login';

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'staff@test.com',
            'password' => bcrypt('password123'),
            'role' => 'staff',
        ]);

        $response = $this->postJson($this->loginUrl, [
            'email' => 'staff@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user' => ['id', 'name', 'email', 'role'], 'token'],
            ]);

        $this->assertTrue($response['success']);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'staff@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson($this->loginUrl, [
            'email' => 'staff@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid email or password',
            ]);
    }

    public function test_user_cannot_login_with_nonexistent_email(): void
    {
        $response = $this->postJson($this->loginUrl, [
            'email' => 'nonexistent@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->inactive()->create([
            'email' => 'inactive@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson($this->loginUrl, [
            'email' => 'inactive@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Account is deactivated',
            ]);
    }

    public function test_login_requires_email_and_password(): void
    {
        $response = $this->postJson($this->loginUrl, []);

        $response->assertStatus(422);
    }

    public function test_user_can_get_authenticated_user_info(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_me(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->assertEquals(1, $user->tokens()->count());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);

        $user->refresh();
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_user_with_staff_role_can_access_staff_endpoints(): void
    {
        $user = User::factory()->staff()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/categories');

        $response->assertStatus(200);
    }
}
