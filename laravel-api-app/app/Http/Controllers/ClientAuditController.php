<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientAudit;
use Illuminate\Http\Request;

class ClientAuditController extends Controller
{
    /**
     * Obtener los logs de auditoría de un cliente específico.
     *
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function index(Client $client)
    {
        $logs = $client->audits()->with('user')->get();
        return response()->json([
            'client_id' => $client->id,
            'logs' => $logs->map(function ($log) {
                $log->user_name = $log->user ? $log->user->name : null;
                return $log;
            })
        ]);
    }
}
