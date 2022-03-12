<?php

namespace App\Exceptions;

use App\Events\Notify;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];


    public function report(Throwable $exception)
    {
        if($exception->getMessage() == "This action is unauthorized."){
            event(new Notify("Vous n'avez pas la permission",4, \Auth::user()->id));
        }

        if (app()->bound('sentry')) {
            app('sentry')->captureException($exception);
        }

        return parent::report($exception);
    }
}
