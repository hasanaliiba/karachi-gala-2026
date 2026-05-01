<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'image_path',
    'intro',
    'how_to_play',
    'rules',
    'registration',
    'early_bird_price',
    'normal_price',
    'event_datetime',
    'venue',
    'team_size',
    'first_prize',
    'second_prize',
    'min_delegations',
    'max_delegations',
    'min_participants',
    'max_participants',
    'sort_order',
])]
class Module extends Model
{
    protected function casts(): array
    {
        return [
            'how_to_play'  => 'array',
            'registration' => 'array',
            'event_datetime' => 'datetime',
        ];
    }
}
