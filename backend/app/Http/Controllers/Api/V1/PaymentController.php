<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Order;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PaymentService $paymentService
    ) {}

    public function store(ProcessPaymentRequest $request, Order $order): JsonResponse
    {
        try {
            $payment = $this->paymentService->processPayment(
                $order,
                $request->validated()['method'],
                $request->validated()['amount_paid']
            );

            return $this->created($payment);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function show(Order $order): JsonResponse
    {
        $payment = $order->payment;

        if (! $payment) {
            return $this->notFound('No payment found for this order');
        }

        return $this->success($payment);
    }
}
