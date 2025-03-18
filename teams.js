document.addEventListener("DOMContentLoaded", function () {
    const players = ["Andres", "Dylan", "Ethan", "Tyler"];
    const playerContainers = {
        "Andres": document.getElementById("team-Andres"),
        "Dylan": document.getElementById("team-Dylan"),
        "Ethan": document.getElementById("team-Ethan"),
        "Tyler": document.getElementById("team-Tyler")
    };

    function loadDraftedTeams() {
        console.log("Loading drafted teams...");
        const draftedPokemons = JSON.parse(localStorage.getItem("draftedPokemons")) || [];
        console.debug("Drafted Pokemon from storage:", draftedPokemons);
        
        players.forEach(player => {
            console.log(`Processing team for ${player}`);
            // Clear existing content for this player's container
            playerContainers[player].innerHTML = "";
            
            // Create table element for the player's team
            const table = document.createElement("table");
            table.classList.add("team-table");
            
            // Remove the original 3-column header so we can use a single header (or none)
            // Option 1: Remove header entirely:
            // (If desired, you could add a header that spans all columns.)
            // const thead = document.createElement("thead");
            // const headerRow = document.createElement("tr");
            // const headerCell = document.createElement("th");
            // headerCell.setAttribute("colspan", "3");
            // headerCell.textContent = "Team";
            // headerRow.appendChild(headerCell);
            // thead.appendChild(headerRow);
            // table.appendChild(thead);
            
            // Create table body with exactly 2 rows × 3 columns = 6 cells total
            const tbody = document.createElement("tbody");
            // Filter the drafted Pokémon for the current player
            const playerDrafts = draftedPokemons.filter(entry => entry.player === player);
            console.log(`${player} has ${playerDrafts.length} drafted Pokémon`);
            
            // Outer loop: 2 rows
            for (let r = 0; r < 2; r++) {
                const tr = document.createElement("tr");
                // Inner loop: 3 columns per row
                for (let c = 0; c < 3; c++) {
                    const td = document.createElement("td");
                    const index = r * 3 + c; // overall cell index (0 to 5)
                    if (index < playerDrafts.length) {
                        const entry = playerDrafts[index];
                        console.log(`Cell [${r}, ${c}] for ${player}: Using drafted Pokémon: ${entry.pokemon}`);
                        
                        // Create a mini-card inside the cell showing all info
                        const cardDiv = document.createElement("div");
                        cardDiv.classList.add("mini-card");
                        
                        const img = document.createElement("img");
                        img.src = entry.sprite;
                        img.alt = entry.pokemon;
                        img.classList.add("pokemon-img");
                        
                        const nameP = document.createElement("p");
                        nameP.classList.add("pokemon-name");
                        nameP.textContent = entry.pokemon.toUpperCase();
                        
                        const pointsP = document.createElement("p");
                        pointsP.classList.add("pokemon-points");
                        pointsP.textContent = `${entry.points} Pts`;
                        
                        cardDiv.appendChild(img);
                        cardDiv.appendChild(nameP);
                        cardDiv.appendChild(pointsP);
                        td.appendChild(cardDiv);
                    } else {
                        console.log(`Cell [${r}, ${c}] for ${player}: Creating placeholder cell`);
                        td.classList.add("placeholder");
                    }
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            
            // Create table footer for budget display
            const tfoot = document.createElement("tfoot");
            const footerRow = document.createElement("tr");
            const footerCell = document.createElement("td");
            footerCell.setAttribute("colspan", "3");
            let usedPoints = 0;
            playerDrafts.forEach(entry => {
                usedPoints += Number(entry.points);
            });
            const totalBudget = 15;
            const remaining = totalBudget - usedPoints;
            footerCell.textContent = `Budget: ${totalBudget} | Used: ${usedPoints} | Remaining: ${remaining}`;
            footerRow.appendChild(footerCell);
            tfoot.appendChild(footerRow);
            table.appendChild(tfoot);
            
            console.log(`Appending table for ${player}`);
            playerContainers[player].appendChild(table);
        });
    }
    
    // Initial load of drafted teams
    loadDraftedTeams();
    
    // Update teams when a new draft occurs
    window.addEventListener("draftUpdated", loadDraftedTeams);
});
