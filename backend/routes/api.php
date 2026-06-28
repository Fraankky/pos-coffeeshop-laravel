<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\MenuItemController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\TableController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        return response()->json(['status' => 'ok']);
    });

    // Auth
    Route::post('/auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);

        // Menu Items
        Route::get('/menu-items', [MenuItemController::class, 'index']);
        Route::get('/menu-items/{menuItem}', [MenuItemController::class, 'show']);
        Route::patch('/menu-items/{menuItem}/stock', [MenuItemController::class, 'updateStock'])
            ->middleware('role:staff,admin');

        Route::middleware('role:admin')->group(function () {
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
            Route::post('/menu-items', [MenuItemController::class, 'store']);
            Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update']);
            Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy']);
        });

        // Tables
        Route::get('/tables', [TableController::class, 'index']);
        Route::get('/tables/{table}', [TableController::class, 'show']);

        Route::middleware('role:admin')->group(function () {
            Route::post('/tables', [TableController::class, 'store']);
            Route::put('/tables/{table}', [TableController::class, 'update']);
            Route::delete('/tables/{table}', [TableController::class, 'destroy']);
        });

        // Orders
        Route::middleware('role:staff,admin')->group(function () {
            Route::get('/orders/active', [OrderController::class, 'activeOrders']);
            Route::get('/orders', [OrderController::class, 'index']);
            Route::post('/orders', [OrderController::class, 'store']);
            Route::get('/orders/{order}', [OrderController::class, 'show']);
            Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        });

        // Payments
        Route::middleware('role:staff,admin')->group(function () {
            Route::post('/orders/{order}/payment', [PaymentController::class, 'store']);
            Route::get('/orders/{order}/payment', [PaymentController::class, 'show']);
        });

        // Reports
        Route::middleware('role:admin')->group(function () {
            Route::get('/reports/sales', [ReportController::class, 'sales']);
            Route::get('/reports/top-items', [ReportController::class, 'topItems']);
            Route::get('/reports/export', [ReportController::class, 'export']);
        });

        // Users (Admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{user}', [UserController::class, 'update']);
            Route::patch('/users/{user}/toggle', [UserController::class, 'toggleActive']);
            Route::delete('/users/{user}', [UserController::class, 'destroy']);
        });
    });
});
