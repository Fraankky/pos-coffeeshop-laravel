<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    use ApiResponse;

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|string|in:cash,qris_simulated',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $order = Order::findOrFail($validated['order_id']);

            if ($order->payment) {
                return $this->error('Order has already been paid', 422);
            }

            if ($order->status === 'cancelled') {
                return $this->error('Cannot pay a cancelled order', 422);
            }

            $changeAmount = max(0, $validated['amount_paid'] - $order->total_amount);

            $payment = Payment::create([
                'order_id' => $order->id,
                'method' => $validated['method'],
                'amount_paid' => $validated['amount_paid'],
                'change_amount' => $changeAmount,
                'payment_status' => 'completed',
                'confirmed_at' => now(),
            ]);

            $order->update(['status' => 'completed']);

            return $this->created($payment);
        });
    }

    public function show(Order $order): JsonResponse
    {
        $payment = $order->payment;

        if (!$payment) {
            return $this->notFound('No payment found for this order');
        }

        return $this->success($payment);
    }
}
