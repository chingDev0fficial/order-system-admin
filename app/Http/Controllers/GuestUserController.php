<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

// request
use App\Http\Requests\StoreGuestUserRequest;
use App\Http\Requests\UpdateAlterGuestUserRequest;

// services
use App\Services\CreateGuestUserService;
use App\Services\FetchGuestUserService;
use App\Services\UpdateAlterGuestUserService;

class GuestUserController extends Controller
{

    /**
     * 
     * helper function
     * proccesses guest user services result
     * 
     * @param array $result
     * @return array
     */
    private function processResult(array $result): array
    {
        $response = [
            'success' => $result['success'],
            'message' => $result['message'],
        ];

        // Add 'data' key only if it exists in $result
        if (isset($result['data'])) {
            $response['data'] = $result['data'];
        }

        return $response;
    }

    /**
     * for creating guest user
     * 
     * @param \App\Http\Requests\StoreGuestUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(
        StoreGuestUserRequest $request,
        CreateGuestUserService $service    
    )
    {
        $result = $service->process($request->validated());
        $response = $this->processResult($result);

        return response()->json($response, $result['errorCode']);
    }

    /**
     * fetching user data using guest user id
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch(
        Request $request,
        FetchGuestUserService $service
    )
    {
        $result = $service->process($request);
        $response = $this->processResult($result);

        return response()->json($response, $result['errorCode']);
    }

    /**
     * use to update or alter data in guest user table
     * 
     * @param \App\Http\Requests\UpdateAlterGuestUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAlter(
        UpdateAlterGuestUserRequest $request,
        UpdateAlterGuestUserService $service
    )
    {
        $result = $service->process($request->validated());
        $response = $this->processResult($result);

        return response()->json($response, $result['errorCode']);
    }
}
