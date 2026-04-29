<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'image_path', 'intro', 'how_to_play', 'rules', 'registration', 'early_bird_price', 'normal_price', 'first_prize', 'second_prize', 'min_cap', 'max_cap', 'sort_order'])]
class Module extends Model
{
    protected function casts(): array
    {
        return [
            'how_to_play'  => 'array',
            'registration' => 'array',
        ];
    }
}
