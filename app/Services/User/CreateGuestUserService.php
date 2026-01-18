<?php

namespace App\Services\User;

class CreateGuestUserService {

    public function process(array $validated)
    {
        try
        {
            $guestUser = GuestUser::where('id', $validated['id'])->first();

            if ($guestUser) {
                return [
                    "success" => false,
                    'message' => 'Device already registered.',
                    "errorCode" => 409 // 409 Conflict
                ];
            }

            // Register new device
            $guestUser = GuestUser::create([
                'id' => $validated['id'],
                'device_info' => $validated['device_info'],
                'last_seen_at' => $validated['last_seen_at'],
            ]);

            return [
                'success' => true,
                'message' => 'Device registered successfully.',
                'data' => $guestUser,
                'errorCode' => 201 // 201 Created
            ];
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs $e");
            return [
                'success' => false,
                'message' => 'Device registered successfully.',
                'errorCode' => 500 // 500 Internal error
            ];
        }
    }
}