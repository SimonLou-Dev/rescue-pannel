<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property integer user_id
 * @property integer item_id
 * @property integer week_number
 * @property integer total
 * @property string service
 * @method static where(string $string, $id)
 * @method static orderByDesc(string $string)
 */
class RemboursementList extends Model
{
    use HasFactory;

    protected $table = 'RemboursementLists';
    protected $fillable = ['user_id', 'id', 'item_id', 'total'];


    public function getUser(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getItem(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ObjRemboursement::class, 'item_id')->withTrashed();
    }

    public function GetAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
