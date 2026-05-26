<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    use ApiResponse;

    public function sales(Request $request): JsonResponse
    {
        $period = $request->period ?? 'day';
        $from = $request->from;
        $to = $request->to;

        $groupBy = match ($period) {
            'week' => DB::raw("DATE_FORMAT(created_at, '%Y-%u')"),
            'month' => DB::raw("DATE_FORMAT(created_at, '%Y-%m')"),
            default => DB::raw("DATE(created_at)"),
        };

        $label = match ($period) {
            'week' => 'week',
            'month' => 'month',
            default => 'date',
        };

        $query = Order::where('status', 'completed')
            ->select($groupBy, DB::raw('COUNT(*) as total_orders'), DB::raw('SUM(total_amount) as total_revenue'));

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $sales = $query->groupBy(DB::raw('1'))
            ->orderBy(DB::raw('1'), 'asc')
            ->get()
            ->map(fn ($item) => [
                $label => $item->{$label},
                'total_orders' => (int) $item->total_orders,
                'total_revenue' => (float) $item->total_revenue,
            ]);

        return $this->success($sales);
    }

    public function topItems(Request $request): JsonResponse
    {
        $from = $request->from;
        $to = $request->to;
        $limit = $request->limit ?? 10;

        $query = OrderItem::select('menu_item_id', DB::raw('SUM(quantity) as total_quantity'), DB::raw('SUM(subtotal) as total_revenue'))
            ->whereHas('order', function ($q) {
                $q->where('status', 'completed');
            })
            ->groupBy('menu_item_id')
            ->orderBy('total_quantity', 'desc')
            ->limit($limit);

        if ($from) {
            $query->whereHas('order', fn ($q) => $q->whereDate('created_at', '>=', $from));
        }

        if ($to) {
            $query->whereHas('order', fn ($q) => $q->whereDate('created_at', '<=', $to));
        }

        $items = $query->get()->map(function ($item) {
            $menuItem = MenuItem::find($item->menu_item_id);
            return [
                'menu_item_id' => $item->menu_item_id,
                'name' => $menuItem?->name,
                'total_quantity' => (int) $item->total_quantity,
                'total_revenue' => (float) $item->total_revenue,
            ];
        });

        return $this->success($items);
    }

    public function export(Request $request): \Illuminate\Http\Response
    {
        $from = $request->from;
        $to = $request->to;

        $query = Order::with(['orderItems.menuItem', 'user', 'payment'])
            ->where('status', 'completed');

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $orders = $query->get();

        $csv = "Order ID,Date,User,Table,Total Amount,Payment Method,Payment Status\n";

        foreach ($orders as $order) {
            $csv .= implode(',', [
                $order->id,
                $order->created_at->format('Y-m-d H:i:s'),
                $order->user?->name ?? 'N/A',
                $order->table_id ?? 'N/A',
                $order->total_amount,
                $order->payment?->method ?? 'N/A',
                $order->payment?->payment_status ?? 'N/A',
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="sales_report.csv"',
        ]);
    }
}
