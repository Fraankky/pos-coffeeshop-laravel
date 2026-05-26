<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ReportService $reportService
    ) {}

    public function sales(Request $request): JsonResponse
    {
        $sales = $this->reportService->getSales(
            $request->period,
            $request->from,
            $request->to
        );

        return $this->success($sales);
    }

    public function topItems(Request $request): JsonResponse
    {
        $items = $this->reportService->getTopItems(
            $request->from,
            $request->to,
            $request->integer('limit', 10)
        );

        return $this->success($items);
    }

    public function export(Request $request)
    {
        $orders = $this->reportService->getExportData(
            $request->from,
            $request->to
        );

        $csv = $this->reportService->generateCsv($orders);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="sales_report.csv"',
        ]);
    }
}
