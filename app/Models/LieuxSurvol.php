<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class LieuxSurvol
 * @package App\Models
 * @property int id
 * @property string name
 * @method static where(string $column, string $operator = null, mixed $value = null)
 * @method static orderByDesc(string $string)
 *
 */
class LieuxSurvol extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = "LieuxSurvols";
    protected $fillable = ['name'];
}
