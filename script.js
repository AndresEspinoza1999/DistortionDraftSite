const pokemonPoints = {
  raichu: 1,
  clefable: 3,
  golduck: 1,
  alakazam: 2,
  machamp: 3,
  tentacruel: 2,
  golem: 1,
  rapidash: 1,
  gengar: 3,
  seaking: 1,
  scyther: 0,
  gyarados: 3,
  vaporeon: 2,
  jolteon: 2,
  flareon: 0,
  snorlax: 3,
  noctowl: 1,
  crobat: 2,
  azumarill: 2,
  sudowoodo: 1,
  quagsire: 2,
  espeon: 2,
  umbreon: 2,
  girafarig: 0,
  steelix: 2,
  scizor: 3,
  heracross: 2,
  octillery: 1,
  houndoom: 2,
  porygon2: 1,
  blissey: 2,
  beautifly: 0,
  dustox: 0,
  pelipper: 2,
  gardevoir: 2,
  medicham: 2,
  altaria: 1,
  whiscash: 1,
  milotic: 2,
  dusclops: 0,
  tropius: 0,
  chimecho: 0,
  absol: 1,
  glalie: 1,
  torterra: 1,
  infernape: 3,
  empoleon: 3,
  staraptor: 2,
  bibarel: 0,
  kricketune: 0,
  luxray: 1,
  roserade: 3,
  rampardos: 1,
  bastiodon: 1,
  wormadam: 0,
  mothim: 0,
  vespiquen: 0,
  pachirisu: 0,
  floatzel: 1,
  cherrim: 0,
  gastrodon: 1,
  ambipom: 2,
  drifblim: 1,
  lopunny: 1,
  mismagius: 2,
  honchkrow: 1,
  purugly: 0,
  skuntank: 2,
  bronzong: 2,
  chatot: 0,
  spiritomb: 2,
  lucario: 3,
  hippowdon: 3,
  drapion: 2,
  toxicroak: 2,
  carnivine: 0,
  lumineon: 0,
  abomasnow: 2,
  weavile: 2,
  magnezone: 2,
  lickilicky: 2,
  rhyperior: 2,
  tangrowth: 2,
  electivire: 2,
  magmortar: 2,
  togekiss: 2,
  yanmega: 2,
  leafeon: 1,
  glaceon: 1,
  gliscor: 2,
  mamoswine: 3,
  gallade: 2,
  probopass: 1,
  dusknoir: 2,
  froslass: 2,
  rotom: 1,
  "rotom-heat": 3,
  "rotom-wash": 3,
  "rotom-mow": 2,
  "rotom-fan": 2,
  "rotom-frost": 1,
};

let countdown; // Stores the countdown interval
let timeLeft = 5 * 60; // 5 minutes in seconds
let isTimerRunning = false; // Tracks if the timer is active
let isTimerPaused = false; // Tracks if the timer is paused

function toPascalCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
function restorePokemonToDraftBoard(pokemonName) {
  // 🎯 Get the tier container
  const tiersDiv = document.getElementById("tiers");

  // 🎯 Find the Pokémon's tier
  let points = pokemonPoints[pokemonName];

  if (points === undefined) {
    console.warn(`Pokemon ${pokemonName} not found in points list.`);
    return;
  }

  // 🎯 Find the correct tier section
  let tierSection = document.getElementById(`tier-${points}`);

  if (!tierSection) {
    console.warn(`Tier ${points} not found for ${pokemonName}.`);
    return;
  }

  // 🎯 Fetch Pokémon details again to re-add to the draft board
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
  .then(response => response.json())
  .then(data => {
      let frontSprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
      let backSprite = data.sprites.versions["generation-v"]["black-white"].animated.back_default;
      if (!frontSprite || !backSprite) return; // Ensure both sprites exist


      // 🎯 Generate correct PokeMMO Wiki link
      let formattedName =
        pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
      let wikiUrl = `https://pokemmo.shoutwiki.com/wiki/${formattedName}`;

      // 🎯 Handle special cases like Rotom forms
      if (
        [
          "rotom-heat",
          "rotom-wash",
          "rotom-mow",
          "rotom-fan",
          "rotom-frost",
        ].includes(pokemonName)
      ) {
        wikiUrl = `https://pokemmo.shoutwiki.com/wiki/Rotom#${formattedName}`;
      }

      // 🎯 Create new Pokémon card
      let pokeDiv = document.createElement("div");
      pokeDiv.classList.add("pokemon-card", "text-center", "shadow-sm");
      
      pokeDiv.innerHTML = `
          <img src="${frontSprite}" class="pokemon-gif" alt="${pokemonName}" data-front="${frontSprite}" data-back="${backSprite}">
          <p class="pokemon-name">${pokemonName.toUpperCase()} (${points} Pts)</p>
          <button class="draft-btn btn btn-sm" data-name="${pokemonName}">Draft</button>
          <a href="${wikiUrl}" target="_blank" class="pokemmo-btn btn btn-sm">Visit PokeMMO</a>
      `;
      
      // ✅ Add event listener to toggle sprite on click
      pokeDiv.querySelector(".pokemon-gif").addEventListener("click", function () {
          this.src = (this.src === this.dataset.front) ? this.dataset.back : this.dataset.front;
      });
      
      // 🎯 Add the restored Pokémon back to its tier section
      tierSection.appendChild(pokeDiv);
      

      // 🎯 Add back to the tier section
      tierSection.appendChild(pokeDiv);
    })
    .catch((error) => console.error("Error restoring Pokémon:", error));
}
function toggleDraftTimer() {
  const timerElement = document.getElementById("draft-timer");

  // 🔄 If the timer is paused, reset it
  if (isTimerPaused) {
    resetTimer();
    return;
  }

  // 🛑 If the timer is running, pause it
  if (isTimerRunning) {
    clearInterval(countdown);
    isTimerRunning = false;
    isTimerPaused = true;
    timerElement.textContent += " (Paused)";
    return;
  }

  // 🆕 If not running or paused, start a new timer
  resetTimer();
  startTimer();
}

// 🏁 Starts the countdown
function startTimer() {
  const timerElement = document.getElementById("draft-timer");
  isTimerRunning = true;
  isTimerPaused = false;

  function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `Draft Timer: ${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  updateTimerDisplay(); // Show initial time

  countdown = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerElement.textContent = "Pokémon Draft Tier List"; // Reset title
      isTimerRunning = false;
    } else {
      timeLeft--;
      updateTimerDisplay();
    }
  }, 1000);
}

// 🔄 Resets the timer
function resetTimer() {
  clearInterval(countdown);
  timeLeft = 5 * 60; // Reset to 5 minutes
  isTimerRunning = false;
  isTimerPaused = false;
  document.getElementById("draft-timer").textContent =
    "Pokémon Draft Tier List";
}
function undoLastDraftForPlayer(player) {
  let draftedPokemons =
    JSON.parse(localStorage.getItem("draftedPokemons")) || [];

  // 🔹 Find the last Pokémon drafted by this player
  let lastIndex = draftedPokemons.map((p) => p.player).lastIndexOf(player);

  if (lastIndex === -1) {
    alert(`${player} has no drafts to undo!`);
    return;
  }

  let removedPokemon = draftedPokemons.splice(lastIndex, 1)[0]; // Remove last Pokémon for this player
  localStorage.setItem("draftedPokemons", JSON.stringify(draftedPokemons));

  alert(`Removed ${removedPokemon.pokemon} from ${player}'s team.`);

  // 🎯 Step 1: Restore Pokémon to the draft board
  restorePokemonToDraftBoard(removedPokemon.pokemon);

  // 🎯 Step 2: Update UI elements
  updateBudgetTable();
  removeDraftedFromBoard();
}
async function fetchPokemonData() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokedex/6");
    if (!response.ok) throw new Error("Failed to fetch Pokédex data");
    const data = await response.json();
    let pokemonEntries = data.pokemon_entries.map((entry) =>
      entry.pokemon_species.name.toLowerCase()
    );
    pokemonEntries.sort();

    const tiersDiv = document.getElementById("tiers");
    const tierElements = {};
    const uniquePoints = [...new Set(Object.values(pokemonPoints))].sort(
      (a, b) => b - a
    );

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
      if (!tierElements[points]) {
        console.error(`Tier ${points} is not defined for ${name}`);
        return; // Avoid breaking the script if a tier isn't found
      }

      if (name.endsWith("mega") || name.endsWith("gmax")) return;

      let formattedName = toPascalCase(name);
      let wikiUrl = `https://pokemmo.shoutwiki.com/wiki/${formattedName}`;

      if (
        [
          "rotom-heat",
          "rotom-wash",
          "rotom-mow",
          "rotom-fan",
          "rotom-frost",
        ].includes(name)
      ) {
        wikiUrl = `https://pokemmo.shoutwiki.com/wiki/Rotom#${formattedName}`;
      }

      const pokemonResponse = await fetch(url);
      if (!pokemonResponse.ok) return;
      const pokemonData = await pokemonResponse.json();

      // Fetch animated GIF sprite from Gen 5 (Black & White)
      const frontSprite =
        pokemonData.sprites.versions["generation-v"]["black-white"].animated
          .front_default;
      const backSprite =
        pokemonData.sprites.versions["generation-v"]["black-white"].animated
          .back_default;
      if (!frontSprite || !backSprite) return; // Ensure both front & back sprites exist

      const pokeDiv = document.createElement("div");
      pokeDiv.classList.add("pokemon-card", "text-center", "shadow-sm");

      pokeDiv.innerHTML = `
      <img src="${frontSprite}" class="pokemon-gif" alt="${name}" data-front="${frontSprite}" data-back="${backSprite}">
      <p class="pokemon-name">${name.toUpperCase()} (${points} Pts)</p>
      <button class="draft-btn btn btn-sm" data-name="${name}">Draft</button>
      <a href="${wikiUrl}" target="_blank" class="pokemmo-btn btn btn-sm">Visit PokeMMO</a>
  `;

      // ✅ Add event listener to toggle sprite on click
      pokeDiv
        .querySelector(".pokemon-gif")
        .addEventListener("click", function () {
          this.src =
            this.src === this.dataset.front
              ? this.dataset.back
              : this.dataset.front;
        });
      tierElements[points].appendChild(pokeDiv);
    };

    await Promise.all(
      pokemonEntries.map(async (name) => {
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${name}`
        );
        if (!speciesResponse.ok) return;
        const speciesData = await speciesResponse.json();

        const points = pokemonPoints[name];
        if (points !== undefined) {
          await fetchPokemonDetails(
            `https://pokeapi.co/api/v2/pokemon/${name}`,
            name,
            points
          );
        }

        if (speciesData.forms_switchable) {
          for (let i = 1; i < speciesData.varieties.length; i++) {
            const variety = speciesData.varieties[i];
            const varietyName = variety.pokemon.name;
            if (varietyName.endsWith("mega") || varietyName.endsWith("gmax"))
              continue;
            const varietyPoints = pokemonPoints[varietyName] || points;
            await fetchPokemonDetails(
              variety.pokemon.url,
              varietyName,
              varietyPoints
            );
          }
        }
      })
    );

    // Now that all Pokémon have been rendered, remove those already drafted.
    removeDraftedFromBoard();
  } catch (error) {
    console.error("Error in fetchPokemonData:", error);
  }
}
async function updateBudgetTable() {
  const players = ["Andres", "Dylan", "Ethan", "Tyler"];
  const totalBudget = 13;
  const draftedPokemons =
    JSON.parse(localStorage.getItem("draftedPokemons")) || [];

  for (const player of players) {
    let usedPoints = draftedPokemons
      .filter((entry) => entry.player === player)
      .reduce((sum, entry) => sum + Number(entry.points), 0);
    let remainingBudget = totalBudget - usedPoints;

    document.getElementById(`budget-${player}-used`).textContent = usedPoints;
    document.getElementById(`budget-${player}-remaining`).textContent =
      remainingBudget;

    // 🎯 Update the Current Team Icons
    const teamIconsContainer = document.getElementById(`team-${player}-icons`);
    teamIconsContainer.innerHTML = ""; // Clear existing icons

    for (const entry of draftedPokemons.filter((p) => p.player === player)) {
      const iconUrl = await fetchPokemonIcon(entry.pokemon);
      if (iconUrl) {
        let img = document.createElement("img");
        img.src = iconUrl;
        img.classList.add("team-icon");
        teamIconsContainer.appendChild(img);
      }
    }
  }
}
function removeDraftedFromBoard() {
  const draftedPokemons =
    JSON.parse(localStorage.getItem("draftedPokemons")) || [];
  draftedPokemons.forEach(({ pokemon }) => {
    const draftButton = document.querySelector(
      `.draft-btn[data-name='${pokemon}']`
    );
    if (draftButton) {
      draftButton.closest(".pokemon-card").remove();
    }
  });
}

async function fetchPokemonIcon(pokemonName) {
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!response.ok) throw new Error("Failed to fetch Pokémon data");

    let data = await response.json();
    return data.sprites.versions["generation-viii"].icons.front_default;
  } catch (error) {
    console.error(`Error fetching icon for ${pokemonName}:`, error);
    return null;
  }
}

// 🔹 Attach event listener to the H1 title
document
  .getElementById("draft-timer")
  .addEventListener("click", toggleDraftTimer);

// 🔹 Attach event listeners to all undo buttons
document.querySelectorAll(".undo-btn").forEach((button) => {
  button.addEventListener("click", function () {
    let player = this.getAttribute("data-player");
    undoLastDraftForPlayer(player);
  });
});

// 🔹 Attach event listeners to all undo buttons
document.querySelectorAll(".undo-btn").forEach((button) => {
  button.addEventListener("click", function () {
    let player = this.getAttribute("data-player");
    undoLastDraftForPlayer(player);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Modified to wait for fetchPokemonData to complete before removing drafted Pokémon
  fetchPokemonData().then(() => {
    removeDraftedFromBoard();
    updateBudgetTable();
  });
});

// 2️⃣ Setup the Modal & Event Listeners
let draftModal = new bootstrap.Modal(document.getElementById("draftModal"));
let selectedPokemon = null; // Stores selected Pokémon temporarily
document.addEventListener("click", function (event) {
  const draftBtn = event.target.closest(".draft-btn");

  if (draftBtn) {
    event.preventDefault();

    // Store selected Pokémon data
    selectedPokemon = {
      name: draftBtn.getAttribute("data-name"),
      points: pokemonPoints[draftBtn.getAttribute("data-name")],
      sprite: draftBtn.parentElement.querySelector("img").src,
    };

    // Update modal text with Pokémon name
    document.getElementById("pokemonNamePlaceholder").textContent =
      selectedPokemon.name.toUpperCase();

    // Show the modal
    draftModal.show();
  }
});

// 3️⃣ Confirm Draft Logic (🔹 Place this right after draft button listener)
document.getElementById("confirmDraft").addEventListener("click", function () {
  if (!selectedPokemon) return;

  let selectedPlayer = document.getElementById("playerSelect").value;
  let selectedPokemons =
    JSON.parse(localStorage.getItem("draftedPokemons")) || [];

  // Calculate remaining budget
  let usedPoints = selectedPokemons
    .filter((entry) => entry.player === selectedPlayer)
    .reduce((sum, entry) => sum + Number(entry.points), 0);
  let remainingBudget = 13 - usedPoints;

  if (remainingBudget - selectedPokemon.points < 0) {
    alert(
      `${selectedPlayer} does not have enough points to draft ${selectedPokemon.name}.`
    );
    return;
  }

  // Check if Pokémon is already drafted
  if (
    !selectedPokemons.some((entry) => entry.pokemon === selectedPokemon.name)
  ) {
    selectedPokemons.push({
      player: selectedPlayer,
      pokemon: selectedPokemon.name,
      sprite: selectedPokemon.sprite,
      points: selectedPokemon.points,
    });

    localStorage.setItem("draftedPokemons", JSON.stringify(selectedPokemons));
    ///alert(`${selectedPokemon.name} added to ${selectedPlayer}'s team!`);

    window.dispatchEvent(new Event("draftUpdated"));
    removeDraftedFromBoard();
    updateBudgetTable(); // ✅ Ensures icons update live

    draftModal.hide(); // Close modal after selection
  } else {
    alert(`${selectedPokemon.name} is already selected.`);
  }
});
// 4️⃣ Page Initialization (Keep existing document ready functions)
document.addEventListener("DOMContentLoaded", function () {
  removeDraftedFromBoard();
  updateBudgetTable();
});

function resetDraft() {
  localStorage.removeItem("draftedPokemons");
  updateBudgetTable();
  location.reload();
}
// The following setTimeout call is now redundant since removal is handled after fetch completion.
// setTimeout(removeDraftedFromBoard, 100);

// Add reset button to clear drafts
const resetButton = document.createElement("button");
resetButton.textContent = "Reset Draft";
resetButton.classList.add("btn", "btn-danger", "mt-3", "w-100");
resetButton.addEventListener("click", resetDraft);
document.body.appendChild(resetButton);
