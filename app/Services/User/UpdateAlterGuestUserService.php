<?php

class UpdateAlterGuestUserService {

    public function process(array $validated)
    {
        try
        {
            $guestUser = GuestUser::find($validated['id']);
            if (!$guestUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Guest user not found.'
                ], 404);
            }

            $guestUser->customer_name = $validated['name'];
            $guestUser->customer_email = $validated['email'];
            $guestUser->customer_phone = $validated['phone'];
            $guestUser->customer_address = $validated['address'];
            $guestUser->save();

            return [
                'success' => true,
                'message' => 'Guest user updated successfully.',
                'data' => $guestUser,
                'errorCode' => 200
            ];
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs $e");
            return [
                'success' => false,
                'message' => 'Error while altering or updating data',
                'errorCode' => 500
            ];
        }
    }
}