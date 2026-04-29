<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            [
                'name'  => 'Chess',
                'intro' => 'Test your strategic mind in a classic battle of wits. Two players face off on a 64-square board in a timeless contest of foresight and tactics.',
                'how_to_play' => [
                    'Each player controls 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights, and 8 pawns.',
                    'Players alternate turns, moving one piece per turn.',
                    'The objective is to checkmate the opponent\'s king.',
                    'Special moves include castling, en passant, and pawn promotion.',
                    'Games are timed using a chess clock; exceeding the time limit results in a loss.',
                ],
                'rules' => 'Standard FIDE rules apply. No phones or electronic devices allowed during matches. Any disputes must be raised immediately and will be settled by the tournament arbiter.',
                'registration' => [
                    'Register as an individual player.',
                    'Participants must report to the venue 15 minutes before their scheduled match.',
                    'Late arrivals (>10 minutes) will forfeit the match.',
                ],
                'first_prize'  => 'PKR 15,000 + Trophy',
                'second_prize' => 'PKR 8,000 + Medal',
                'min_cap' => 8,
                'max_cap' => 32,
            ],
            [
                'name'  => 'FIFA (Console Football)',
                'intro' => 'Grab the controller and take your favourite club to glory. Compete head-to-head in the ultimate console football showdown.',
                'how_to_play' => [
                    'Matches are played on EA FC (FIFA) — latest available version.',
                    'Each match consists of 2×6-minute halves.',
                    'Players choose their team before each match; no team can be selected twice in the same bracket.',
                    'If the match ends in a draw, it proceeds to penalty shootout.',
                    'Tournament follows a single-elimination bracket format.',
                ],
                'rules' => 'No custom squads or house-rule modifications allowed. Default game settings apply. Any controller issues must be reported before kickoff. Unsportsmanlike conduct results in immediate disqualification.',
                'registration' => [
                    'Register as an individual player.',
                    'Each player must bring their own controller (spare controllers available on request).',
                    'Platform: PlayStation 5 (provided by organizers).',
                ],
                'first_prize'  => 'PKR 20,000 + Trophy',
                'second_prize' => 'PKR 10,000 + Medal',
                'min_cap' => 8,
                'max_cap' => 64,
            ],
            [
                'name'  => 'Badminton',
                'intro' => 'Fast reflexes, precise shots, and explosive rallies — bring your A-game to the badminton court and smash your way to the top.',
                'how_to_play' => [
                    'Matches follow BWF singles rules.',
                    'Best of 3 games; each game is played to 21 points.',
                    'A player wins a game by scoring 21 points with a 2-point lead (cap at 30).',
                    'Service alternates based on who wins each rally.',
                    'Tournament format: group stage followed by knockout rounds.',
                ],
                'rules' => 'Participants must provide their own rackets. Shuttlecocks will be provided. Proper sportswear and non-marking shoes are mandatory. Coaching from the sidelines is not permitted.',
                'registration' => [
                    'Register as an individual player.',
                    'Players must arrive at the court at least 10 minutes before their match.',
                    'Warm-up time: 5 minutes maximum before each match.',
                ],
                'first_prize'  => 'PKR 12,000 + Trophy',
                'second_prize' => 'PKR 6,000 + Medal',
                'min_cap' => 8,
                'max_cap' => 32,
            ],
            [
                'name'  => 'Tug of War',
                'intro' => 'Pure strength, teamwork, and grit. Rally your team, dig in your heels, and pull the opposition across the line in this crowd-favourite event.',
                'how_to_play' => [
                    'Each team consists of 8 members.',
                    'Best of 3 pulls; a pull ends when the centre mark on the rope crosses the winning marker.',
                    'Teams line up on opposite ends of the rope.',
                    'On the referee\'s signal, teams pull simultaneously.',
                    'Any member who falls or lets go results in a warning; two warnings forfeit the pull.',
                ],
                'rules' => 'No gloves, grip aids, or footwear spikes allowed. Team members must not loop the rope around any body part. The referee\'s decision is final. Substitutions are not permitted once a pull begins.',
                'registration' => [
                    'Register as a team of exactly 8 players.',
                    'Team captain must submit the final roster 30 minutes before the event.',
                    'Mixed-gender teams are welcome.',
                ],
                'first_prize'  => 'PKR 25,000 + Trophy',
                'second_prize' => 'PKR 12,000 + Medal',
                'min_cap' => 4,
                'max_cap' => 16,
            ],
            [
                'name'  => 'Carrom',
                'intro' => 'Flick, aim, and pocket your way to victory. This beloved indoor classic demands precision and cool nerves under pressure.',
                'how_to_play' => [
                    'Played in singles format following standard international carrom rules.',
                    'Each player/team alternates striking with the striker to pocket their colour carrom men.',
                    'The queen must be pocketed and then "covered" by pocketing another piece immediately after.',
                    'Player who pockets all their pieces (including the queen) first wins the board.',
                    'Match is best of 3 boards.',
                ],
                'rules' => 'Boards and carrom men are provided by the organizers. Participants must not move the board during play. Powder usage is allowed (provided on site). Mobile phones must be silenced during matches.',
                'registration' => [
                    'Register as an individual player.',
                    'Players must report to the carrom area 10 minutes before their scheduled match.',
                ],
                'first_prize'  => 'PKR 10,000 + Trophy',
                'second_prize' => 'PKR 5,000 + Medal',
                'min_cap' => 8,
                'max_cap' => 32,
            ],
        ];

        foreach ($modules as $order => $module) {
            Module::firstOrCreate(
                ['name' => $module['name']],
                array_merge($module, ['sort_order' => $order])
            );
        }
    }
}
