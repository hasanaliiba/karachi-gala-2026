<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
class Admin extends Authenticatable
{
    use Notifiable;

    protected $hidden = ['password', 'remember_token'];

    protected $guard = 'admin';

    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }
}
