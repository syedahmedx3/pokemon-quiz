const pkCache = {};

/**
 * Fetch a single Pokémon by numeric ID.
 * Results are cached in memory so the same Pokémon is never re-fetched.
 */
export async function fetchPk(id) {
  if (pkCache[id]) return pkCache[id];

  const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!r.ok) throw new Error(`PokéAPI error: HTTP ${r.status} for id=${id}`);

  const d = await r.json();

  return (pkCache[id] = {
    id,
    name: d.name,
    sprite:
      d.sprites.other?.["official-artwork"]?.front_default ||
      d.sprites.front_default ||
      d.sprites.front_shiny,
    types: d.types.map((t) => t.type.name),
    stats: {
      hp:      d.stats[0]?.base_stat ?? 0,
      attack:  d.stats[1]?.base_stat ?? 0,
      defense: d.stats[2]?.base_stat ?? 0,
      speed:   d.stats[5]?.base_stat ?? 0,
    },
  });
}
