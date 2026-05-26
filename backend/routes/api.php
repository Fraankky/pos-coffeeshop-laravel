<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/auth/login', [App\Http\Controllers\Api\V1\AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [App\Http\Controllers\Api\V1\AuthController::class, 'logout']);
        Route::get('/auth/me', [App\Http\Controllers\Api\V1\AuthController::class, 'me']);

        // Categories
        Route::apiResource('/categories', App\Http\Controllers\Api\V1\CategoryController::class);

        // Menu Items
        Route::get('/menu-items', [App\Http\Controllers\Api\V1\MenuItemController::class, 'index']);
        Route::get('/menu-items/{menuItem}', [App\Http\Controllers\Api\V1\MenuItemController::class, 'show']);
        Route::patch('/menu-items/{menuItem}/stock', [App\Http\Controllers\Api\V1\MenuItemController::class, 'updateStock']);

        Route::middleware('role:admin')->group(function () {
            Route::post('/menu-items', [App\Http\Controllers\Api\V1\MenuItemController::class, 'store']);
            Route::put('/menu-items/{menuItem}', [App\Http\Controllers\Api\V1\MenuItemController::class, 'update']);
            Route::delete('/menu-items/{menuItem}', [App\Http\Controllers\Api\V1\MenuItemController::class, 'destroy']);
        });

        // Tables
        Route::apiResource('/tables', App\Http\Controllers\Api\V1\TableController::class);

        // Orders
        Route::get('/orders', [App\Http\Controllers\Api\V1\OrderController::class, 'index']);
        Route::post('/orders', [App\Http\Controllers\Api\V1\OrderController::class, 'store']);
        Route::get('/orders/{order}', [App\Http\Controllers\Api\V1\OrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [App\Http\Controllers\Api\V1\OrderController::class, 'updateStatus']);
        Route::get('/orders/active', [App\Http\Controllers\Api\V1\OrderController::class, 'activeOrders']);

        // Payments
        Route::post('/orders/{order}/payment', [App\Http\Controllers\Api\V1\PaymentController::class, 'store']);
        Route::get('/orders/{order}/payment', [App\Http\Controllers\Api\V1\PaymentController::class, 'show']);

        // Reports
        Route::get('/reports/sales', [App\Http\Controllers\Api\V1\ReportController::class, 'sales']);
        Route::get('/reports/top-items', [App\Http\Controllers\Api\V1\ReportController::class, 'topItems']);
        Route::get('/reports/export', [App\Http\Controllers\Api\V1\ReportController::class, 'export']);

        // Users (Admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/users', [App\Http\Controllers\Api\V1\UserController::class, 'index']);
            Route::post('/users', [App\Http\Controllers\Api\V1\UserController::class, 'store']);
            Route::put('/users/{user}', [App\Http\Controllers\Api\V1\UserController::class, 'update']);
            Route::patch('/users/{user}/toggle', [App\Http\Controllers\Api\V1\UserController::class, 'toggleActive']);
        });
    });
});
