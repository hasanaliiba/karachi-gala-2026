<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VerifyDelegationPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('admin')->check();
    }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['approve', 'reject'])],
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

