<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::query();

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $menuItems = $query->paginate($request->per_page ?? 15);

        return $this->success($menuItems);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'is_available' => 'boolean',
            'stock_qty' => 'integer|min:0',
            'stock_min_threshold' => 'integer|min:0',
        ]);

        $menuItem = MenuItem::create($validated);

        return $this->created($menuItem);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        $menuItem->load('category');

        return $this->success($menuItem);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'nullable|string',
            'is_available' => 'boolean',
            'stock_qty' => 'integer|min:0',
            'stock_min_threshold' => 'integer|min:0',
        ]);

        $menuItem->update($validated);

        return $this->success($menuItem);
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return $this->noContent();
    }

    public function updateStock(Request $request, MenuItem $menuItem): JsonResponse
    {
        $validated = $request->validate([
            'stock_qty' => 'required|integer|min:0',
        ]);

        $menuItem->update(['stock_qty' => $validated['stock_qty']]);

        return $this->success($menuItem);
    }
}
