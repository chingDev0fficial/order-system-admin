<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderedProduct;

class Product extends Model
{

    protected $table = 'products';

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

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'category',
        'description',
        'price',
        'status',
        'image',
    ];

    public function orderedProducts()
    {
        return $this->hasMany(OrderedProduct::class, 'product_id');
    }

    /**
     * Boot the model and generate unique ID.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->id)) {
                $product->id = self::generateUniqueId();
            }
        });
    }

    /**
     * Generate a unique product ID in format PRD-XXX
     */
    private static function generateUniqueId(): string
    {
        do {
            // Get the last product by ID
            $lastProduct = self::orderBy('id', 'desc')->first();
            
            if ($lastProduct) {
                // Extract the number from PRD-XXX
                $lastNumber = (int) substr($lastProduct->id, 4);
                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }
            
            $newId = 'PRD-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            
        } while (self::where('id', $newId)->exists());
        
        return $newId;
    }
}