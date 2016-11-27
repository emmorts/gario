The Game
=======
A multiplayer online, binary websocket based game inspired by a custom map _Warlock_ from Wacraft III: TFT.

## TODO

Eseential:
 * Overall game scene boundaries
 * Spell variety and engine(leveling up, buying)

Important:
 * Game mode improvements, *rounds*

In the future:
 * Priority queue for rendering
 * Categorize opcodes properly(CSMG/SMSG)
 * WebRTC support with a fallback to the current workflow
 * Procedurally generated maps
 * Multiple game rooms (game.ext/room/_code_)

## Development

After cloning repo, install npm packages by running `npm install`.

Once it's done, simply start `npm run dev`, which will run both, client and server with watchers.

In case you want to run them individually, run `npm start` for server, and `gulp watch` for client code watchers.