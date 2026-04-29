<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/modules', [
            'modules' => Module::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'intro'        => ['required', 'string'],
            'how_to_play'  => ['required', 'array', 'min:1'],
            'how_to_play.*'=> ['required', 'string', 'max:500'],
            'rules'        => ['required', 'string'],
            'registration' => ['required', 'array', 'min:1'],
            'registration.*' => ['required', 'string', 'max:500'],
            'first_prize'  => ['required', 'string', 'max:255'],
            'second_prize' => ['required', 'string', 'max:255'],
            'min_cap'      => ['required', 'integer', 'min:1'],
            'max_cap'      => ['required', 'integer', 'gte:min_cap'],
        ]);

        $data['sort_order'] = Module::max('sort_order') + 1;

        Module::create($data);

        return back()->with('success', 'Module created.');
    }

    public function update(Request $request, Module $module): RedirectResponse
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'intro'        => ['required', 'string'],
            'how_to_play'  => ['required', 'array', 'min:1'],
            'how_to_play.*'=> ['required', 'string', 'max:500'],
            'rules'        => ['required', 'string'],
            'registration' => ['required', 'array', 'min:1'],
            'registration.*' => ['required', 'string', 'max:500'],
            'first_prize'  => ['required', 'string', 'max:255'],
            'second_prize' => ['required', 'string', 'max:255'],
            'min_cap'      => ['required', 'integer', 'min:1'],
            'max_cap'      => ['required', 'integer', 'gte:min_cap'],
        ]);

        $module->update($data);

        return back()->with('success', 'Module updated.');
    }

    public function destroy(Module $module): RedirectResponse
    {
        $module->delete();

        return back()->with('success', 'Module deleted.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['integer', 'exists:modules,id'],
        ]);

        foreach ($request->ids as $order => $id) {
            Module::where('id', $id)->update(['sort_order' => $order]);
        }

        return back()->with('success', 'Order updated.');
    }
}
