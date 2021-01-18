const dump = (v: any) => game.print(serpent.block(v));
const dumpEvents = () =>
  Object.entries(defines.events).forEach(([name, evtId]) =>
    dump(`${name} - id: ${evtId}`)
  );
const tsPairs = (v: any): Tuple[] => {
  let res: Tuple[] = [];
  for (const it in v) res.push([it, v[it]]);
  return res;
};
type Tuple<A = any, B = any> = [A, B];

const onPositionChange = (evt: OnPlayerChangedPositionPayload) => {
  const player = game.get_player(evt.player_index);
  if (player.walking_state.walking) {
    const lastSpeed = player.character_running_speed_modifier;
    const baseSpeed = lastSpeed == 0 ? 1 : lastSpeed;
    player.character_running_speed_modifier = baseSpeed * 1.01;
  }
};

const onTick = (_evt: OnTickPayload) => {
  tsPairs(game.players).forEach(([id, player]: [number, LuaPlayer]) => {
    if (
      player.character_running_speed_modifier > 0 &&
      !player.walking_state.walking
    ) {
      player.character_running_speed_modifier = 0;
    }
  });
};

script.on_event(defines.events.on_player_changed_position, onPositionChange);
script.on_event(defines.events.on_tick, onTick);
