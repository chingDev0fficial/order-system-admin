<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

use App\Models\GuestUser;

class GuestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GuestUser::create([
            'id' => Str::uuid()->toString(),
            'customer_name' => 'John Doe',
            'customer_email' => 'john.doe@example.com',
            'customer_phone' => '+1234567890',
            'customer_address' => '123 Main Street, City, Country',
            'device_info' => json_encode([
                'device_type' => 'mobile',
                'os' => 'Android',
                'browser' => 'Chrome'
            ]),
            'last_seen_at' => now(),
        ]);
    }
}