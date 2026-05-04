<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_registration_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('social_registration_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->string('cnic');
            $table->string('email');
            $table->string('phone');
            $table->json('social_selections');
            $table->unsignedInteger('line_total_fee')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_registration_members');
    }
};
