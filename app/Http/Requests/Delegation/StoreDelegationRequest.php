<?php

namespace App\Http\Requests\Delegation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDelegationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['individual', 'group'])],
            'module_ids' => ['required', 'array', 'min:1', 'max:2'],
            'module_ids.*' => ['required', 'integer', 'exists:modules,id', 'distinct'],
            'socials' => ['nullable', 'array'],
            'socials.*' => ['required', Rule::in(['qawali_night', 'beach_party'])],
            'undertaking_accepted' => ['required', 'accepted'],

            'members' => ['required', 'array', 'min:1'],
            'members.*.full_name' => ['required', 'string', 'max:255'],
            'members.*.cnic' => ['required', 'regex:/^\d{5}-\d{7}-\d{1}$/'],
            'members.*.student_id' => ['required', 'string', 'max:100'],
            'members.*.institute_name' => ['required', 'string', 'max:255'],
            'members.*.gender' => ['required', Rule::in(['male', 'female'])],
            'members.*.email' => ['required', 'email', 'max:255'],
            'members.*.contact' => ['required', 'string', 'max:100'],
            'members.*.emergency_contact' => ['nullable', 'string', 'max:100'],
            'members.*.module_ids' => ['required', 'array', 'min:1', 'max:2'],
            'members.*.module_ids.*' => ['required', 'integer', 'exists:modules,id'],

            'spectators' => ['nullable', 'array', 'max:10'],
            'spectators.*.full_name' => ['required', 'string', 'max:255'],
            'spectators.*.cnic' => ['required', 'regex:/^\d{5}-\d{7}-\d{1}$/'],
            'spectators.*.student_id' => ['required', 'string', 'max:100'],
            'spectators.*.institute_name' => ['required', 'string', 'max:255'],
            'spectators.*.gender' => ['required', Rule::in(['male', 'female'])],
            'spectators.*.email' => ['required', 'email', 'max:255'],
            'spectators.*.contact' => ['required', 'string', 'max:100'],
            'spectators.*.emergency_contact' => ['nullable', 'string', 'max:100'],
        ];
    }
}

