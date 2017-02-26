// mix credo [fileName]
let no_options = `Checking 1 source file ...

  Code Readability
┃
┃ [R] → Functions should have a @spec type specification.
┃       lib/rumbl.ex:27:7 (Rumbl.config_change)
┃ [R] → Functions should have a @spec type specification.
┃       lib/rumbl.ex:6:7 (Rumbl.start)
┃ [R] → Modules should have a @moduledoc tag.
┃       lib/rumbl.ex:1:11 (Rumbl)

Please report incorrect results: https://github.com/rrrene/credo/issues

Analysis took 0.1 seconds (0.01s to load, 0.1s running checks)
3 mods/funs, found 3 code readability issues.

Showing priority issues: ↑ ↗ →  (use \`--strict\` to show all issues, \`--help\` for options).
`

// mix credo list [fileName]
let example_list_output = `

Checking 1 source file ...

  Rumbl
┃
┃ [R] → Modules should have a @moduledoc tag.
┃       lib/rumbl.ex:1:11 (Rumbl)
┃
┃       defmodule Rumbl do
┃                 ^^^^^
┃
┃ [R] → Functions should have a @spec type specification.
┃       lib/rumbl.ex:6:7 (Rumbl.start)
┃
┃         def start(_type, _args) do
┃           ^^^^^
┃
┃ [R] → Functions should have a @spec type specification.
┃       lib/rumbl.ex:27:7 (Rumbl.config_change)
┃
┃         def config_change(changed, _new, removed) do
┃           ^^^^^^^^^^^^^
┃

Please report incorrect results: https://github.com/rrrene/credo/issues

Analysis took 0.1 seconds (0.00s to load, 0.1s running checks)
3 mods/funs, found 3 code readability issues.

Showing priority issues: ↑ ↗ →  (use \`--strict\` to show all issues, \`--help\` for options).
`
// mix credo list --format=oneline [fileName]
let example_list_output_oneline = `
[R] → lib/rumbl.ex:1:11 Modules should have a @moduledoc tag.
[R] → lib/rumbl.ex:6:7 Functions should have a @spec type specification.
[R] → lib/rumbl.ex:27:7 Functions should have a @spec type specification.
`
export let output = {
  listOneline: example_list_output_oneline,
  list: example_list_output,
  noOptions: no_options
}