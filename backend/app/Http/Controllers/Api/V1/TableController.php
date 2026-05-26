<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TableController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $tables = Table::orderBy('table_number')->get();

        return $this->success($tables);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'required|integer|min:1|unique:tables,table_number',
            'capacity' => 'required|integer|min:1',
            'status' => 'sometimes|string|max:50',
        ]);

        $table = Table::create($validated);

        return $this->created($table);
    }

    public function show(Table $table): JsonResponse
    {
        return $this->success($table);
    }

    public function update(Request $request, Table $table): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'sometimes|integer|min:1|unique:tables,table_number,' . $table->id,
            'capacity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|string|max:50',
        ]);

        $table->update($validated);

        return $this->success($table);
    }

    public function destroy(Table $table): JsonResponse
    {
        $table->delete();

        return $this->noContent();
    }
}
