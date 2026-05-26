<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_id' => ['nullable', 'exists:tables,id'],
            'order_type' => ['required', 'string', 'in:dine_in,takeaway'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
            'items.*.customization_notes' => ['nullable', 'string', 'max:500'],
            'items.*.size' => ['nullable', 'string', 'in:small,regular,large'],
            'items.*.toppings' => ['nullable', 'array'],
            'items.*.toppings.*' => ['string', 'max:100'],
        ];
    }
}
