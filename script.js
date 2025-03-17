const pokemonPoints = {
    "raichu": 1, "clefable": 3, "golduck": 1, "alakazam": 2, "machamp": 3,
    "tentacruel": 2, "golem": 1, "rapidash": 1, "gengar": 3, "seaking": 1,
    "scyther": 0, "gyarados": 3, "vaporeon": 2, "jolteon": 2, "flareon": 0,
    "snorlax": 3, "noctowl": 1, "crobat": 2, "azumarill": 2, "sudowoodo": 1,
    "quagsire": 2, "espeon": 2, "umbreon": 2, "girafarig": 0, "steelix": 2,
    "scizor": 3, "heracross": 2, "octillery": 1, "houndoom": 2, "porygon2": 3,
    "blissey": 2, "beautifly": 0, "dustox": 0, "pelipper": 2, "gardevoir": 2,
    "medicham": 2, "altaria": 1, "whiscash": 1, "milotic": 2, "dusclops": 2,
    "tropius": 0, "chimecho": 0, "absol": 1, "glalie": 1, "torterra": 1,
    "infernape": 3, "empoleon": 3, "staraptor": 2, "bibarel": 0, "kricketune": 0,
    "luxray": 1, "roserade": 3, "rampardos": 1, "bastiodon": 1, "wormadam": 0,
    "mothim": 0, "vespiquen": 0, "pachirisu": 0, "floatzel": 1, "cherrim": 0,
    "gastrodon": 1, "ambipom": 2, "drifblim": 1, "lopunny": 1, "mismagius": 2,
    "honchkrow": 1, "purugly": 0, "skuntank": 2, "bronzong": 2, "chatot": 0,
    "spiritomb": 2, "lucario": 3, "hippowdon": 3, "drapion": 2, "toxicroak": 2,
    "carnivine": 0, "lumineon": 0, "abomasnow": 2, "weavile": 2, "magnezone": 2,
    "lickilicky": 2, "rhyperior": 2, "tangrowth": 2, "electivire": 2,
    "magmortar": 2, "togekiss": 2, "yanmega": 2, "leafeon": 1, "glaceon": 1,
    "gliscor": 2, "mamoswine": 3, "gallade": 2, "probopass": 1, "dusknoir": 2,
    "froslass": 2, "rotom": 1, "rotom-heat": 3, "rotom-wash": 3, "rotom-mow": 2, "rotom-fan": 2, "rotom-frost": 1
};

function toPascalCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokedex/6');
        if (!response.ok) throw new Error("Failed to fetch Pokédex data");
        const data = await response.json();
        let pokemonEntries = data.pokemon_entries.map(entry => entry.pokemon_species.name.toLowerCase());
        pokemonEntries.sort();

        const tiersDiv = document.getElementById("tiers");
        const tierElements = {};
        const uniquePoints = [...new Set(Object.values(pokemonPoints))].sort((a, b) => b - a);

        for (const points of uniquePoints) {
            if (!(points in tierElements)) {
                const tierDiv = document.createElement("div");
                tierDiv.classList.add("tier", "col-12", "p-3", "shadow-sm");
                tierDiv.innerHTML = `<button class='btn btn-primary w-100 mb-2' data-bs-toggle='collapse' data-bs-target='#tier-${points}'>Tier ${points} Points</button><div class='collapse show' id='tier-${points}'></div>`;
                tiersDiv.appendChild(tierDiv);
                tierElements[points] = tierDiv.querySelector(`#tier-${points}`);
            }
        }

        const fetchPokemonDetails = async (url, name, points) => {
            if (name.endsWith("mega") || name.endsWith("gmax")) return;
            
            let formattedName = toPascalCase(name);
            let wikiUrl = `https://pokemmo.shoutwiki.com/wiki/${formattedName}`;
            if (["rotom-heat", "rotom-wash", "rotom-mow", "rotom-fan", "rotom-frost"].includes(name)) {
                wikiUrl = `https://pokemmo.shoutwiki.com/wiki/Rotom#${formattedName}`;
            }
            
            const pokemonResponse = await fetch(url);
            if (!pokemonResponse.ok) return;
            const pokemonData = await pokemonResponse.json();
            const sprite = pokemonData.sprites.front_default;
            if (!sprite) return;

            const pokeDiv = document.createElement('div');
            pokeDiv.classList.add('pokemon', 'card', 'p-2', 'text-center', 'shadow-sm');
            pokeDiv.innerHTML = `<a href="${wikiUrl}" target="_blank"><img src="${sprite}" class='card-img-top' alt="${name}"></a><div class='card-body'><p class='card-text'>${name} (${points} Pts)</p></div>`;
            tierElements[points].appendChild(pokeDiv);
        };

        const promises = pokemonEntries.map(async (name) => {
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
            if (!speciesResponse.ok) return;
            const speciesData = await speciesResponse.json();
            
            const points = pokemonPoints[name];
            if (points !== undefined) {
                await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`, name, points);
            }
            
            if (speciesData.forms_switchable) {
                for (let i = 1; i < speciesData.varieties.length; i++) {
                    const variety = speciesData.varieties[i];
                    const varietyName = variety.pokemon.name;
                    if (varietyName.endsWith("mega") || varietyName.endsWith("gmax")) continue;
                    const varietyPoints = pokemonPoints[varietyName] || points;
                    await fetchPokemonDetails(variety.pokemon.url, varietyName, varietyPoints);
                }
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error("Error in fetchPokemonData:", error);
    }
}
fetchPokemonData();
