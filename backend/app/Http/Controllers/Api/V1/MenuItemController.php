<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Http\Requests\UpdateStockRequest;
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

        if ($request->boolean('available_only')) {
            $query->where('is_available', true);
        }

        $menuItems = $query->paginate($request->per_page ?? 50);

        return $this->success($menuItems);
    }

    public function store(StoreMenuItemRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('menu-items', 'public');
        }

        $menuItem = MenuItem::create($data);

        return $this->created($menuItem);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        $menuItem->load('category');

        return $this->success($menuItem);
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('menu-items', 'public');
        }

        $menuItem->update($data);

        return $this->success($menuItem);
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return $this->noContent();
    }

    public function updateStock(UpdateStockRequest $request, MenuItem $menuItem): JsonResponse
    {
        $menuItem->update(['stock_qty' => $request->validated()['stock_qty']]);

        return $this->success($menuItem);
    }
}
