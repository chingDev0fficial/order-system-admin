<?php

namespace App\Services\User;

class FetchGuestUserService {

    public function process($request)
    {
        try
        {
            $query = GuestUser::query();

            if ($request->has('id')) {
                $query->where('id', $request->input('id'));
            }

            $guest = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($data) {
                    return [
                        'guestId' => $data->id,
                        'name' => $data->customer_name,
                        'email' => $data->customer_email,
                        'phone' => $data->customer_phone,
                        'address' => $data->customer_address
                    ];
                });

            return [
                'success' => true,
                'data' => $guest,
                'errorCode' => 200
            ];
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs $e");
            return [
                'success' => false,
                'message' => 'Error while fetching data',
                'errorCode' => 500
            ];
        }
    }

}