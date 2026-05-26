<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Order::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $orders = $query->paginate($request->per_page ?? 15);

        return $this->success($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_id' => 'nullable|exists:tables,id',
            'order_type' => 'required|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.customization_notes' => 'nullable|string',
            'items.*.size' => 'nullable|string|max:50',
            'items.*.toppings' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $totalAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                if ($menuItem->stock_qty < $item['quantity']) {
                    return $this->error(
                        "Insufficient stock for {$menuItem->name}",
                        422
                    );
                }

                $unitPrice = $menuItem->price;
                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'customization_notes' => $item['customization_notes'] ?? null,
                    'subtotal' => $subtotal,
                    'size' => $item['size'] ?? null,
                    'toppings' => $item['toppings'] ?? null,
                ];

                $menuItem->decrement('stock_qty', $item['quantity']);
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'table_id' => $validated['table_id'] ?? null,
                'order_type' => $validated['order_type'],
                'status' => 'received',
                'total_amount' => $totalAmount,
            ]);

            $order->orderItems()->createMany($orderItems);

            $order->load('orderItems.menuItem');

            return $this->created($order);
        });
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['orderItems', 'payment', 'user', 'table']);

        return $this->success($order);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $validTransitions = [
            'received' => ['in_progress'],
            'in_progress' => ['completed', 'cancelled'],
            'completed' => [],
            'cancelled' => [],
        ];

        $currentStatus = $order->status;

        if (!isset($validTransitions[$currentStatus]) || !in_array($validated['status'], $validTransitions[$currentStatus])) {
            return $this->error(
                "Invalid status transition from {$currentStatus} to {$validated['status']}",
                422
            );
        }

        $order->update(['status' => $validated['status']]);

        return $this->success($order);
    }

    public function activeOrders(): JsonResponse
    {
        $orders = Order::with(['orderItems.menuItem', 'table'])
            ->whereIn('status', ['received', 'in_progress'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success($orders);
    }
}
