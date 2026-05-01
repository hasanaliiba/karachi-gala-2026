<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'intro'        => ['required', 'string'],
            'how_to_play'  => ['required', 'array', 'min:1'],
            'how_to_play.*'=> ['required', 'string', 'max:500'],
            'rules'        => ['required', 'string'],
            'registration' => ['required', 'array', 'min:1'],
            'registration.*' => ['required', 'string', 'max:500'],
            'early_bird_price' => ['required', 'string', 'max:255'],
            'normal_price' => ['required', 'string', 'max:255'],
            'first_prize'  => ['required', 'string', 'max:255'],
            'second_prize' => ['required', 'string', 'max:255'],
            'min_delegations' => ['required', 'integer', 'min:1'],
            'max_delegations' => ['required', 'integer', 'gte:min_delegations'],
            'min_participants' => ['required', 'integer', 'min:1'],
            'max_participants' => ['required', 'integer', 'gte:min_participants'],
        ]);

        $data['image_path'] = $request->hasFile('image')
            ? $request->file('image')->store('modules', 'public')
            : null;
        $data['sort_order'] = Module::max('sort_order') + 1;
        unset($data['image']);

        Module::create($data);

        return back()->with('success', 'Module created.');
    }

    public function update(Request $request, Module $module): RedirectResponse
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'image'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'intro'        => ['required', 'string'],
            'how_to_play'  => ['required', 'array', 'min:1'],
            'how_to_play.*'=> ['required', 'string', 'max:500'],
            'rules'        => ['required', 'string'],
            'registration' => ['required', 'array', 'min:1'],
            'registration.*' => ['required', 'string', 'max:500'],
            'early_bird_price' => ['required', 'string', 'max:255'],
            'normal_price' => ['required', 'string', 'max:255'],
            'first_prize'  => ['required', 'string', 'max:255'],
            'second_prize' => ['required', 'string', 'max:255'],
            'min_delegations' => ['required', 'integer', 'min:1'],
            'max_delegations' => ['required', 'integer', 'gte:min_delegations'],
            'min_participants' => ['required', 'integer', 'min:1'],
            'max_participants' => ['required', 'integer', 'gte:min_participants'],
        ]);

        if ($request->hasFile('image')) {
            if ($module->image_path) {
                Storage::disk('public')->delete($module->image_path);
            }

            $data['image_path'] = $request->file('image')->store('modules', 'public');
        }

        unset($data['image']);
        $module->update($data);

        return back()->with('success', 'Module updated.');
    }

    public function destroy(Module $module): RedirectResponse
    {
        if ($module->image_path) {
            Storage::disk('public')->delete($module->image_path);
        }

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
