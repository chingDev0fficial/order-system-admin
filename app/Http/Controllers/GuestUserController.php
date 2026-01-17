<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

// models
use App\Models\Order;
use App\Models\OrderedProduct;
use App\Models\GuestUser;

// request
use App\Http\Requests\StoreGuestUserRequest;
use App\Http\Requests\UpdateAlterGuestUserRequest;

class GuestUserController extends Controller
{
    /**
     * for creating guest user
     * 
     * @param \App\Http\Requests\StoreGuestUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreGuestUserRequest $request)
    {
        try
        {
            $validated = $request->validated();

            $guestUser = GuestUser::where('id', $validated['id'])->first();

            if ($guestUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Device already registered.'
                ], 409); // 409 Conflict
            }

            // Register new device
            $guestUser = GuestUser::create([
                'id' => $validated['id'],
                'device_info' => $validated['device_info'],
                'last_seen_at' => $validated['last_seen_at'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Device registered successfully.',
                'data' => $guestUser
            ], 201); // 201 Created
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs $e");
            return response()->json([
                'success' => false,
                'message' => 'Error while registering device'
            ], 500);
        }
    }

    /**
     * fetching user data using guest user id
     * 
     * @param \Illuminate\Http\Request; $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch(Request $request)
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

            return response()->json([
                'success' => true,
                'guest' => $guest
            ], 200);
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs $e");
            return response()->json([
                'success' => false,
                'message' => 'Error while fetching data'
            ], 500);
        }
    }

    /**
     * use to update or alter data in guest user table
     * 
     * @param \App\Http\Requests\UpdateAlterGuestUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAlter(UpdateAlterGuestUserRequest $request)
    {
        try
        {
            $validated = $request->validated();

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

            return response()->json([
                'success' => true,
                'message' => 'Guest user updated successfully.',
                'data' => $guestUser
            ], 200);
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs $e");
            return response()->json([
                'success' => false,
                'message' => 'Error while altering or updating data'
            ], 500);
        }
    }
}
