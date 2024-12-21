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
        // Obtener los registros de auditoría relacionados con este cliente
        $logs = $client->audits()->get();

        return response()->json([
            'client_id' => $client->id,
            'logs' => $logs
        ]);
    }
}
