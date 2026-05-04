<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\SocialRegistration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_social_registration(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('social-registrations.store'), [
            'members' => [
                [
                    'full_name' => 'Test Guest',
                    'cnic' => '42201-1234567-1',
                    'email' => 'guest@example.com',
                    'phone' => '03001234567',
                    'social_selections' => ['qawali_night', 'beach_party'],
                ],
            ],
        ]);

        $response->assertRedirect(route('social-registrations.index'));
        $this->assertCount(1, SocialRegistration::all());
        $registration = SocialRegistration::firstOrFail();
        $this->assertSame($user->id, $registration->user_id);
        $this->assertSame('pending_payment', $registration->status);
        $this->assertGreaterThan(0, $registration->grand_total_fee);

        $payment = Payment::where('social_registration_id', $registration->id)->firstOrFail();
        $this->assertNull($payment->delegation_id);
        $this->assertSame($registration->grand_total_fee, $payment->amount_due);
        $this->assertSame('pending', $payment->status);
    }

    public function test_guest_cannot_create_social_registration(): void
    {
        $response = $this->post(route('social-registrations.store'), [
            'members' => [
                [
                    'full_name' => 'Test Guest',
                    'cnic' => '42201-1234567-1',
                    'email' => 'guest@example.com',
                    'phone' => '03001234567',
                    'social_selections' => ['beach_party'],
                ],
            ],
        ]);

        $response->assertRedirect(route('login'));
    }
}
