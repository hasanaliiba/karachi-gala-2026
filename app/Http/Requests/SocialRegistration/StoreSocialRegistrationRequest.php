<?php

namespace App\Http\Requests\SocialRegistration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSocialRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'members' => ['required', 'array', 'min:1'],
            'members.*.full_name' => ['required', 'string', 'max:255'],
            'members.*.cnic' => ['required', 'regex:/^\d{5}-\d{7}-\d{1}$/'],
            'members.*.email' => ['required', 'email', 'max:255'],
            'members.*.phone' => ['required', 'string', 'max:100'],
            'members.*.social_selections' => ['required', 'array', 'min:1'],
            'members.*.social_selections.*' => ['required', Rule::in(['qawali_night', 'beach_party'])],
        ];
    }
}
