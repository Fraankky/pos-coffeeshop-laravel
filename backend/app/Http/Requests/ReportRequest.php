<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period' => ['nullable', 'string', 'in:day,week,month'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'period.in' => 'Periode harus day, week, atau month',
            'from.date_format' => 'Format tanggal dari harus Y-m-d',
            'to.date_format' => 'Format tanggal sampai harus Y-m-d',
            'to.after_or_equal' => 'Tanggal sampai harus >= tanggal dari',
            'limit.integer' => 'Limit harus berupa angka',
            'limit.min' => 'Limit minimal 1',
            'limit.max' => 'Limit maksimal 100',
        ];
    }
}
