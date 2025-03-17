<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pokémon Draft Tier List</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .tier { margin: 20px 0; padding: 15px; border-radius: 10px; }
        .pokemon { display: inline-block; margin: 10px; text-align: center; }
        img { display: block; margin: auto; }
    </style>
</head>
<body class="bg-light">
    <div class="container py-4">
        <h1 class="text-center mb-4">Pokémon Draft Tier List 15 Points per Player</h1>
        <div id="tiers" class="row"></div>
    </div>
    
    <script>
        const pokemonPoints = {
    "raichu": 1,
    "clefable": 3,
    "golduck": 1,
    "alakazam": 2,
    "machamp": 3,
    "tentacruel": 2,
    "golem": 1,
    "rapidash": 1,
    "gengar": 3,
    "seaking": 1,
    "scyther": 1,
    "gyarados": 3,
    "vaporeon": 2,
    "jolteon": 2,
    "flareon": 1,
    "snorlax": 3,
    "noctowl": 1,
    "crobat": 2,
    "azumarill": 2,
    "sudowoodo": 1,
    "quagsire": 2,
    "espeon": 2,
    "umbreon": 2,
    "girafarig": 1,
    "steelix": 2,
    "scizor": 3,
    "heracross": 2,
    "octillery": 1,
    "houndoom": 2,
    "porygon2": 1,
    "blissey": 2,
    "beautifly": 1,
    "dustox": 1,
    "pelipper": 1,
    "gardevoir": 2,
    "medicham": 2,
    "altaria": 1,
    "whiscash": 1,
    "milotic": 2,
    "dusclops": 1,
    "tropius": 1,
    "chimecho": 1,
    "absol": 1,
    "glalie": 1,
    "torterra": 1,
    "infernape": 3,
    "empoleon": 3,
    "staraptor": 2,
    "bibarel": 1,
    "kricketune": 1,
    "luxray": 1,
    "roserade": 3,
    "rampardos": 1,
    "bastiodon": 1,
    "wormadam": 1,
    "mothim": 1,
    "vespiquen": 1,
    "pachirisu": 1,
    "floatzel": 1,
    "cherrim": 1,
    "gastrodon": 1,
    "ambipom": 2,
    "drifblim": 1,
    "lopunny": 1,
    "mismagius": 2,
    "honchkrow": 1,
    "purugly": 1,
    "skuntank": 2,
    "bronzong": 2,
    "chatot": 1,
    "spiritomb": 2,
    "lucario": 3,
    "hippowdon": 3,
    "drapion": 2,
    "toxicroak": 2,
    "carnivine": 1,
    "lumineon": 1,
    "abomasnow": 2,
    "weavile": 2,
    "magnezone": 2,
    "lickilicky": 2,
    "rhyperior": 2,
    "tangrowth": 2,
    "electivire": 2,
    "magmortar": 2,
    "togekiss": 2,
    "yanmega": 2,
    "leafeon": 1,
    "glaceon": 1,
    "gliscor": 2,
    "mamoswine": 3,
    "gallade": 2,
    "probopass": 1,
    "dusknoir": 2,
    "froslass": 2
};
        
        async function fetchPokemonData() {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokedex/6');
                if (!response.ok) throw new Error("Failed to fetch Pokédex data");
                const data = await response.json();
                const pokemonEntries = data.pokemon_entries.map(entry => entry.pokemon_species.name.toLowerCase());
                
                const tiersDiv = document.getElementById("tiers");
                const tierElements = {};
                const uniquePoints = [...new Set(Object.values(pokemonPoints))].sort((a, b) => b - a);
                
                for (const points of uniquePoints) {
                    const tierDiv = document.createElement("div");
                    tierDiv.classList.add("tier", "col-12", "p-3", "bg-white", "shadow-sm");
                    tierDiv.innerHTML = `<h2 class='text-center'>Tier ${points} Points</h2><div class='d-flex flex-wrap justify-content-center' id='tier-${points}'></div>`;
                    tiersDiv.appendChild(tierDiv);
                    tierElements[points] = tierDiv.querySelector(`#tier-${points}`);
                }
                
                const promises = pokemonEntries.map(async (name) => {
                    if (!(name in pokemonPoints)) return;
                    const points = pokemonPoints[name];
                    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                    if (!pokemonResponse.ok) return;
                    const pokemonData = await pokemonResponse.json();
                    const sprite = pokemonData.sprites.front_default;
                    if (!sprite) return;
                    
                    const pokeDiv = document.createElement('div');
                    pokeDiv.classList.add('pokemon', 'card', 'p-2', 'text-center', 'shadow-sm');
                    pokeDiv.innerHTML = `<img src="${sprite}" class='card-img-top' alt="${name}"><div class='card-body'><p class='card-text'>${name} (${points} Pts)</p></div>`;
                    tierElements[points].appendChild(pokeDiv);
                });
                
                await Promise.all(promises);
            } catch (error) {
                console.error("Error in fetchPokemonData:", error);
            }
        }
        fetchPokemonData();
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
