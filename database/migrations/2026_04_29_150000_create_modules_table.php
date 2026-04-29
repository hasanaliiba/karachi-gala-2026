<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('intro');
            $table->json('how_to_play');
            $table->text('rules');
            $table->json('registration');
            $table->string('first_prize');
            $table->string('second_prize');
            $table->unsignedInteger('min_cap');
            $table->unsignedInteger('max_cap');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
