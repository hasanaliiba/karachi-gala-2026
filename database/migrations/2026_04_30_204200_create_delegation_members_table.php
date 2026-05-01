<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delegation_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delegation_id')->constrained()->cascadeOnDelete();
            $table->string('member_type')->default('player'); // player or spectator
            $table->string('full_name');
            $table->string('cnic');
            $table->string('student_id');
            $table->string('institute_name');
            $table->string('gender');
            $table->string('email');
            $table->string('contact');
            $table->string('emergency_contact')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delegation_members');
    }
};

