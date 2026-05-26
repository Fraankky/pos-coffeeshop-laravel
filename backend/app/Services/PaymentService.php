<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function processPayment(Order $order, string $method, float $amountPaid): Payment
    {
        if ($order->payment) {
            throw new \RuntimeException('Order has already been paid');
        }

        if ($order->status === 'cancelled') {
            throw new \RuntimeException('Cannot pay a cancelled order');
        }

        return DB::transaction(function () use ($order, $method, $amountPaid) {
            $changeAmount = max(0, $amountPaid - $order->total_amount);

            $payment = Payment::create([
                'order_id' => $order->id,
                'method' => $method,
                'amount_paid' => $amountPaid,
                'change_amount' => $changeAmount,
                'payment_status' => 'confirmed',
                'confirmed_at' => now(),
            ]);

            $order->update(['status' => 'completed']);

            if ($order->table) {
                $order->table->update(['status' => 'occupied']);
            }

            return $payment;
        });
    }
}
