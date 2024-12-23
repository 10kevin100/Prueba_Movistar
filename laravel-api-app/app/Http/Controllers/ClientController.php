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
        $clients = Client::with(['addresses', 'documents'])->get();
        return response()->json(['clients' => $clients], 200);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|string|email',
            'phone' => 'required|string|min:8',
            'addresses' => 'array',
            'documents' => 'array',
        ], [
            'name.required' => 'El campo Nombre es obligatorio.',
            'name.string' => 'El campo Nombre debe ser una cadena de texto',
            'lastName.required' => 'El campo Apellido es obligatorio.',
            'lastName.string' => 'El campo Apellido debe ser una cadena de texto',
            'email.required' => 'El campo Correo es obligatorio',
            'email.string' => 'El campo Correo debe ser una cadena de texto',
            'email.email' => 'El campo Correo debe tener un @',
            'phone.required' => 'El campo Teléfono es obligatorio.',
            'phone.string' => 'El campo Teléfono debe ser una cadena de texto.',
        ]);
    
        $client = Client::create($fields);

        ClientAudit::create([
            'client_id' => $client->id,
            'user_id' => Auth::id(),
            'action' => 'creacion',
            'old_values' => null,
            'new_values' => json_encode($fields),
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
        $fields = $request->validate([
            'name' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|string',
            'phone' => 'required|string',
            'addresses' => 'array',
            'documents' => 'array',
        ]);
    
        $old_data = $client->toArray();
        $changes = [];
        $modified_fields = [];
        foreach ($fields as $key => $value) {
            if (isset($old_data[$key]) && $old_data[$key] !== $value) {
                $changes[$key] = [
                    'old' => $old_data[$key],
                    'new' => $value,
                ];
                $modified_fields[] = $key;
            }
        }

        $client->update($fields);
        if (!empty($changes)) {
            $old_values = [];
            $new_values = [];
            foreach ($changes as $key => $change) {
                $old_values[] = [$key => $change['old']];
                $new_values[] = [$key => $change['new']];
            }
    
            ClientAudit::create([
                'client_id' => $client->id,
                'user_id' => Auth::id(),
                'action' => 'modificacion',
                'old_values' => json_encode($old_values),
                'new_values' => json_encode($new_values),
            ]);
        }
    
        if ($request->has('addresses')) {
            $client->addresses()->delete();
            foreach ($request->addresses as $address) {
                $client->addresses()->create($address);
            }
        }

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
        //Desactiva el cliente
        ClientAudit::create([
            'client_id' => $client->id,
            'user_id' => Auth::id(),
            'action' => 'desactivar',
            'old_values' => json_encode($client->toArray()),
            'new_values' => json_encode(['is_active' => false]),
        ]);
    
        $client->update(['is_active' => false]);
        return response()->json(['message' => 'Client deactivated successfully'], 200);
    }
}