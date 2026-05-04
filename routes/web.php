<?php

use App\Http\Controllers\DelegationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SocialRegistrationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('delegations', [DelegationController::class, 'index'])->name('delegations.index');
    Route::get('delegations/create', [DelegationController::class, 'create'])->name('delegations.create');
    Route::get('delegations/{delegation}', [DelegationController::class, 'show'])->name('delegations.show');
    Route::post('delegations', [DelegationController::class, 'store'])->name('delegations.store');
    Route::post('delegations/{delegation}/proof', [DelegationController::class, 'uploadProof'])->name('delegations.proof');

    Route::get('social-registrations', [SocialRegistrationController::class, 'index'])->name('social-registrations.index');
    Route::get('social-registrations/create', [SocialRegistrationController::class, 'create'])->name('social-registrations.create');
    Route::get('social-registrations/{socialRegistration}', [SocialRegistrationController::class, 'show'])->name('social-registrations.show');
    Route::post('social-registrations', [SocialRegistrationController::class, 'store'])->name('social-registrations.store');
    Route::post('social-registrations/{socialRegistration}/proof', [SocialRegistrationController::class, 'uploadProof'])->name('social-registrations.proof');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
