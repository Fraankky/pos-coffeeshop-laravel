<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_number' => ['required', 'integer', 'min:1', 'unique:tables,table_number'],
            'capacity' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['sometimes', 'string', 'in:available,occupied'],
        ];
    }
}
