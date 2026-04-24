<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'canRegister'   => Features::enabled(Features::registration()),
            'earlyBirdDate' => Setting::get('early_bird_date', '2026-05-28'),
        ]);
    }
}
