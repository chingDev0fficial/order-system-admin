<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class GuestUser extends Model
{
    protected $table = "guest_users";

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    protected $fillable = [
        'id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'device_info',
        'last_seen',
    ];

    protected $casts = [
        'device_info' => 'array',
        'last_seen_at' => 'datetime',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'guest_user_id');
    }
}
