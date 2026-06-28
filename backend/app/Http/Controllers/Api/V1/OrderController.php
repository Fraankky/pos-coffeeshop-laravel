<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getFilteredOrders(
            $request->status,
            $request->from,
            $request->to
        );

        return $this->success($orders);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->createOrder(
                $request->validated(),
                $request->user()->id
            );

            return $this->created($order);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['orderItems.menuItem', 'payment', 'user', 'table']);

        return $this->success($order);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        try {
            $order = $this->orderService->updateStatus(
                $order,
                $request->validated()['status']
            );

            return $this->success($order);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function activeOrders(): JsonResponse
    {
        $orders = $this->orderService->getActiveOrders();

        return $this->success($orders);
    }
}
