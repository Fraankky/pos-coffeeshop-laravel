<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function getSales(?string $period, ?string $from, ?string $to): array
    {
        $period = $period ?? 'day';
        $driver = DB::connection()->getDriverName();

        $selectDate = match ($period) {
            'week' => DB::raw($driver === 'sqlite'
                ? "strftime('%Y-%W', created_at) as period"
                : "DATE_FORMAT(created_at, '%Y-%u') as period"),
            'month' => DB::raw($driver === 'sqlite'
                ? "strftime('%Y-%m', created_at) as period"
                : "DATE_FORMAT(created_at, '%Y-%m') as period"),
            default => DB::raw("DATE(created_at) as period"),
        };

        $query = Order::where('status', 'completed')
            ->select(
                $selectDate,
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('COALESCE(SUM(total_amount), 0) as total_revenue')
            );

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        return $query->groupBy('period')
            ->orderBy('period')
            ->get()
            ->toArray();
    }

    public function getTopItems(?string $from, ?string $to, int $limit = 10): array
    {
        $query = OrderItem::select(
            'menu_item_id',
            DB::raw('SUM(quantity) as total_quantity'),
            DB::raw('COALESCE(SUM(subtotal), 0) as total_revenue')
        )
            ->whereHas('order', fn($q) => $q->where('status', 'completed'))
            ->groupBy('menu_item_id')
            ->orderByDesc('total_quantity')
            ->limit($limit);

        if ($from) {
            $query->whereHas('order', fn($q) => $q->whereDate('created_at', '>=', $from));
        }

        if ($to) {
            $query->whereHas('order', fn($q) => $q->whereDate('created_at', '<=', $to));
        }

        return $query->get()->map(function ($item) {
            $menuItem = MenuItem::find($item->menu_item_id);
            return [
                'menu_item_id' => $item->menu_item_id,
                'name' => $menuItem?->name ?? 'Deleted Item',
                'total_quantity' => (int) $item->total_quantity,
                'total_revenue' => (float) $item->total_revenue,
            ];
        })->toArray();
    }

    public function getExportData(?string $from, ?string $to)
    {
        $query = Order::with(['orderItems.menuItem', 'user', 'payment'])
            ->where('status', 'completed');

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        return $query->get();
    }

    public function generateCsv($orders): string
    {
        $csv = "Order ID,Date,Staff,Table,Items,Total Amount,Payment Method,Payment Status\n";

        foreach ($orders as $order) {
            $items = $order->orderItems->map(fn($i) => "{$i->menuItem?->name} x{$i->quantity}")->implode('; ');
            $csv .= implode(',', [
                $order->id,
                $order->created_at->format('Y-m-d H:i:s'),
                '"' . ($order->user?->name ?? 'N/A') . '"',
                $order->table_id ?? 'Takeaway',
                '"' . $items . '"',
                $order->total_amount,
                $order->payment?->method ?? 'N/A',
                $order->payment?->payment_status ?? 'N/A',
            ]) . "\n";
        }

        return $csv;
    }
}
