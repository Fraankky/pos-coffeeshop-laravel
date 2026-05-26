<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_number' => ['sometimes', 'integer', 'min:1', Rule::unique('tables')->ignore($this->route('table'))],
            'capacity' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'status' => ['sometimes', 'string', 'in:available,occupied'],
        ];
    }
}
