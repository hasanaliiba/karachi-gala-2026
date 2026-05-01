<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delegations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('delegation_code')->unique();
            $table->string('type'); // individual or group
            $table->json('socials')->nullable();
            $table->unsignedInteger('spectator_count')->default(0);
            $table->boolean('undertaking_accepted')->default(false);
            $table->unsignedInteger('base_fee')->default(0);
            $table->unsignedInteger('games_total_fee')->default(0);
            $table->unsignedInteger('social_total_fee')->default(0);
            $table->unsignedInteger('spectator_total_fee')->default(0);
            $table->unsignedInteger('grand_total_fee')->default(0);
            $table->string('status')->default('pending_payment');
            $table->string('qr_token')->nullable();
            $table->timestamp('qr_generated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delegations');
    }
};

