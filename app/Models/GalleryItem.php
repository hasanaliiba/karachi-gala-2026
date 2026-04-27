<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['label', 'image_path', 'wide', 'sort_order'])]
class GalleryItem extends Model
{
}
