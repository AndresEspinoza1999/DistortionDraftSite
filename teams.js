document.addEventListener("DOMContentLoaded", function () {
    const teams = {
        "andres": document.getElementById("andres-table"),
        "dylan": document.getElementById("dylan-table"),
        "ethan": document.getElementById("ethan-table"),
        "tyler": document.getElementById("tyler-table")
    };

    const pokemonData = {
        "raichu": 1, "clefable": 3, "golduck": 1, "alakazam": 2, "machamp": 3,
        "tentacruel": 2, "golem": 1, "rapidash": 1, "gengar": 3, "seaking": 1,
        "scyther": 0, "gyarados": 3, "vaporeon": 2, "jolteon": 2, "flareon": 0,
        "snorlax": 3, "noctowl": 1, "crobat": 2, "azumarill": 2, "sudowoodo": 1,
        "quagsire": 2, "espeon": 2, "umbreon": 2, "girafarig": 0, "steelix": 2,
        "scizor": 3, "heracross": 2, "octillery": 1, "houndoom": 2, "porygon2": 1,
        "blissey": 2, "beautifly": 0, "dustox": 0, "pelipper": 2, "gardevoir": 2,
        "medicham": 2, "altaria": 1, "whiscash": 1, "milotic": 2, "dusclops": 0,
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

    Object.keys(teams).forEach(player => {
        const container = teams[player].parentElement;
        const dropdown = document.createElement("select");
        dropdown.innerHTML = Object.keys(pokemonData).map(pokemon => `<option value="${pokemon}">${pokemon}</option>`).join("");
        
        const addButton = document.createElement("button");
        addButton.textContent = "Add Pokémon";
        addButton.onclick = function () {
            const selectedPokemon = dropdown.value;
            addPokemonToTeam(player, selectedPokemon, pokemonData[selectedPokemon]);
        };

        container.appendChild(dropdown);
        container.appendChild(addButton);
    });

    function addPokemonToTeam(player, pokemon, points) {
        const table = teams[player];
        if (table.rows.length >= 7) return; // Limit to 6 Pokémon

        const row = table.insertRow();
        const spriteCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const pointsCell = row.insertCell(2);
        
        spriteCell.innerHTML = `<img src='https://img.pokemondb.net/sprites/home/normal/${pokemon}.png' width='50'>`;
        nameCell.textContent = pokemon;
        pointsCell.textContent = points;
    }
});
