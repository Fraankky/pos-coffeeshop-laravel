<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $data, int $userId): Order
    {
        return DB::transaction(function () use ($data, $userId) {
            $totalAmount = 0;
            $orderItems = [];

            foreach ($data['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                if ($menuItem->stock_qty < $item['quantity']) {
                    throw new \RuntimeException("Insufficient stock for {$menuItem->name}");
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
                    'size' => $item['size'] ?? 'regular',
                    'toppings' => isset($item['toppings']) ? json_encode($item['toppings']) : null,
                ];

                $menuItem->decrement('stock_qty', $item['quantity']);
            }

            $order = Order::create([
                'user_id' => $userId,
                'table_id' => $data['table_id'] ?? null,
                'order_type' => $data['order_type'],
                'status' => 'received',
                'total_amount' => $totalAmount,
            ]);

            $order->orderItems()->createMany($orderItems);
            $order->load('orderItems.menuItem');

            return $order;
        });
    }

    public function updateStatus(Order $order, string $newStatus): Order
    {
        $validTransitions = [
            'received' => ['in_progress'],
            'in_progress' => ['completed', 'cancelled'],
            'completed' => [],
            'cancelled' => [],
        ];

        $currentStatus = $order->status;

        if (! isset($validTransitions[$currentStatus]) || ! in_array($newStatus, $validTransitions[$currentStatus])) {
            throw new \RuntimeException(
                "Invalid status transition from {$currentStatus} to {$newStatus}"
            );
        }

        if ($newStatus === 'cancelled') {
            $this->restoreStock($order);
        }

        $order->update(['status' => $newStatus]);

        if ($newStatus === 'completed' && $order->table) {
            $order->table->update(['status' => 'available']);
        }

        return $order->fresh();
    }

    public function restoreStock(Order $order): void
    {
        foreach ($order->orderItems as $item) {
            $item->menuItem->increment('stock_qty', $item->quantity);
        }
    }

    public function getActiveOrders()
    {
        return Order::with(['orderItems.menuItem', 'table'])
            ->whereIn('status', ['received', 'in_progress'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getFilteredOrders(?string $status, ?string $from = null, ?string $to = null)
    {
        $query = Order::query();

        if ($status) {
            $query->where('status', $status);
        }

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        return $query->with(['user:id,name', 'table:id,table_number', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(request('per_page', 15));
    }
}
