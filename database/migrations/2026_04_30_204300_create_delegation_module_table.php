<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delegation_module', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delegation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('fee_snapshot')->default(0);
            $table->timestamp('event_datetime_snapshot')->nullable();
            $table->string('venue_snapshot')->nullable();
            $table->timestamps();
            $table->unique(['delegation_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delegation_module');
    }
};

