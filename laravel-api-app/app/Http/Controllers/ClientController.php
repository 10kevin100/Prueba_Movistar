<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientAudit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all();
        return response()->json(['clients' => $clients], 200);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|string',
            'phone' => 'required|string',
            'addresses' => 'array',
            'documents' => 'array',
        ]);
        $client = Client::create($fields);

        ClientAudit::create([
            'client_id' => $client->id,
            'user_id' => Auth::id(),
            'action' => 'create',
            'changes' => json_encode($fields),
        ]);

        if ($request->has('addresses')) {
            foreach ($request->addresses as $address) {
                $client->addresses()->create($address);
            }
        }

        if ($request->has('documents')) {
            foreach ($request->documents as $document) {
                $client->documents()->create($document);
            }
        }

        return response()->json(['message' => 'Client created successfully', 'client' => $client], 201);
    }

    public function show(Client $client)
    {
        $client->load(['addresses', 'documents']);
        return response()->json(['client' => $client], 200);
    }

    public function update(Request $request, Client $client)
    {
        // Validar los campos recibidos
        $fields = $request->validate([
            'name' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|string',
            'phone' => 'required|string',
            'addresses' => 'array',
            'documents' => 'array',
        ]);
    
        // Obtener datos antiguos
        $old_data = $client->toArray();
    
        // Identificar cambios
        $changes = [];
        foreach ($fields as $key => $value) {
            if (isset($old_data[$key]) && $old_data[$key] !== $value) {
                $changes[$key] = [
                    'old' => $old_data[$key],
                    'new' => $value,
                ];
            }
        }
    
        // Actualizar cliente
        $client->update($fields);
    
        // Registrar auditoría si hay cambios
        if (!empty($changes)) {
            ClientAudit::create([
                'client_id' => $client->id,
                'user_id' => Auth::id(),
                'action' => 'update',
                'changes' => json_encode($changes),
            ]);
        }
    
        // Actualizar direcciones si se envían
        if ($request->has('addresses')) {
            $client->addresses()->delete();
            foreach ($request->addresses as $address) {
                $client->addresses()->create($address);
            }
        }
    
        // Actualizar documentos si se envían
        if ($request->has('documents')) {
            $client->documents()->delete();
            foreach ($request->documents as $document) {
                $client->documents()->create($document);
            }
        }
    
        return response()->json(['message' => 'Client updated successfully', 'client' => $client], 200);
    }

    public function destroy(Client $client)
    {
        ClientAudit::create([
            'client_id' => $client->id,
            'user_id' => Auth::id(),
            'action' => 'delete',
            'old_data' => json_encode($client->toArray()),
            'new_data' => null,
        ]);
        $client->addresses()->delete();
        $client->documents()->delete();
        $client->delete();

        return response()->json(['message' => 'Client deleted successfully'], 200);
    }
}