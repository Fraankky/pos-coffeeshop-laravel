<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Models\Table;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class TableController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $tables = Table::orderBy('table_number')->get();

        return $this->success($tables);
    }

    public function store(StoreTableRequest $request): JsonResponse
    {
        $table = Table::create($request->validated());

        return $this->created($table);
    }

    public function show(Table $table): JsonResponse
    {
        return $this->success($table);
    }

    public function update(UpdateTableRequest $request, Table $table): JsonResponse
    {
        $table->update($request->validated());

        return $this->success($table);
    }

    public function destroy(Table $table): JsonResponse
    {
        $table->delete();

        return $this->noContent();
    }
}
