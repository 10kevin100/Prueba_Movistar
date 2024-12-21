<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{

    public function index()
    {
        $employees = Employee::with('user')->get();

        return response()->json([
            'employees' => $employees,
        ], 200);
    }


    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
            'job_title' => 'nullable|string',
            'joined_at' => 'nullable|date',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role' => 'employee',
        ]);

        $employee = Employee::create([
            'user_id' => $user->id,
            'job_title' => $fields['job_title'],
            'joined_at' => $fields['joined_at'],
        ]);
        $token = $user->createToken('EmployeeToken')->plainTextToken;

        return response()->json([
            'message' => 'Employee created successfully',
            'employee' => $employee,
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function show(Employee $employee)
    {
        $employee->load('user'); 

        return response()->json([
            'employee' => $employee,
        ], 200);
    }

    public function update(Request $request, Employee $employee)
    {
        $fields = $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $employee->user->id,
            'password' => 'sometimes|required|string|confirmed|min:8',
            'job_title' => 'nullable|string',
            'joined_at' => 'nullable|date',
        ]);

        if (isset($fields['name']) || isset($fields['email']) || isset($fields['password'])) {
            $user = $employee->user;
            if (isset($fields['name'])) {
                $user->name = $fields['name'];
            }
            if (isset($fields['email'])) {
                $user->email = $fields['email'];
            }
            if (isset($fields['password'])) {
                $user->password = Hash::make($fields['password']);
            }
            $user->save();
        }

        if (isset($fields['job_title'])) {
            $employee->job_title = $fields['job_title'];
        }
        if (isset($fields['joined_at'])) {
            $employee->joined_at = $fields['joined_at'];
        }
        $employee->save();

        return response()->json([
            'message' => 'Employee updated successfully',
            'employee' => $employee,
            'user' => $employee->user,
        ], 200);
    }

    public function destroy(Employee $employee)
    {
        $user = $employee->user;
        $employee->delete();
        $user->delete();

        return response()->json([
            'message' => 'Employee and associated user deleted successfully',
        ], 200);
    }
}