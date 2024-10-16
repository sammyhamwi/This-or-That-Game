async function fetchVotingStats() {
    const response = await fetch('/api/votingStats'); // Endpoint to fetch votes
    if (!response.ok) {
        console.error('Failed to fetch voting statistics');
        return;
    }

    const votes = await response.json();
    const categories = [...new Set(Object.keys(votes).map(key => key.split('_')[0]))];
    const namesPromises = categories.map(category => fetchPairNames(category));

    // Wait for all pair names to be fetched
    const pairNamesArray = await Promise.all(namesPromises);
    const pairNames = Object.assign({}, ...pairNamesArray);

    displayVotingStats(votes, pairNames);
}

async function fetchPairNames(category) {
    const response = await fetch(`/media/pairs/${category}/pairNames.json`);
    if (!response.ok) {
        console.error(`Failed to fetch pair names for category: ${category}`);
        return {};
    }
    return { [category]: await response.json() };
}

function displayVotingStats(votes, pairNames) {
    const container = document.getElementById('statsContainer');
    container.innerHTML = '';

    // Check if there are any votes
    if (Object.keys(votes).length === 0) {
        document.getElementById('clearVotesButton').style.display = 'none';
        const message = document.createElement('p');
        message.textContent = 'Er zijn momenteel geen stemmen geregistreerd om gegevens te tonen.';
        message.classList.add('text-center', 'font-weight-bold');
        container.appendChild(message);
        return; // Exit if no votes
    }

    // Create a table to display the statistics
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-hover');
    table.id = "votingStatsTable";

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Categorie</th>
        <th>Niveau</th>
        <th>Optie 1</th>
        <th>Optie 2</th>
        <th>Stemmen voor Optie 1</th>
        <th>Stemmen voor Optie 2</th>
        <th>Tijdstip</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    // Iterate over votes to create rows for each vote entry
    for (const key in votes) {
        if (votes.hasOwnProperty(key)) {
            const [category, index] = key.split('_');
            const pairKey = `pair${parseInt(index) + 1}`;

            const option1Name = pairNames[category]?.[pairKey]?.names[0] || "Onbekend";
            const option2Name = pairNames[category]?.[pairKey]?.names[1] || "Onbekend";

            const level = parseInt(index) + 1;

            // Iterate over each vote (array of votes) for the current pair
            votes[key].forEach(voteEntry => {
                const vote1 = voteEntry.vote1;
                const vote2 = voteEntry.vote2;
                const timestamp = voteEntry.timestamp || "Onbekend";

                // Check if both votes are zero (skip those)
                if (vote1 === 0 && vote2 === 0) {
                    return;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category}</td>
                    <td>${level}</td>
                    <td class="${vote1 > vote2 ? 'highlight' : ''}">${option1Name}</td>
                    <td class="${vote2 > vote1 ? 'highlight' : ''}">${option2Name}</td>
                    <td>${vote1}</td>
                    <td>${vote2}</td>
                    <td>${timestamp}</td>
                `;

                if (vote1 === vote2) {
                    row.children[2].classList.add('highlight');
                    row.children[3].classList.add('highlight');
                }

                tbody.appendChild(row);
            });
        }
    }

    table.appendChild(tbody);
    container.appendChild(table);

    // Initialize DataTables with export buttons and custom styles
    $(table).DataTable({
        dom: 'B<"clear">lfrtip',
        buttons: [
            {
                extend: 'copy',
                className: 'btn btn-primary btn-rounded export-button',
                text: 'Kopieren',
            },
            {
                extend: 'excel',
                className: 'btn btn-success btn-rounded export-button',
                text: 'Excel',
            },
            {
                extend: 'pdf',
                className: 'btn btn-danger btn-rounded export-button',
                text: 'PDF',
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-rounded export-button',
                text: 'Afdrukken',
            }
        ],
        lengthMenu: [5, 10, 25, 50],
        pageLength: 10,
        responsive: true,
        language: {
            lengthMenu: "&emsp;&emsp;&emsp;Toon&ensp;_MENU_&ensp;items",
            search: "Zoekopdracht:",
            paginate: {
                "first":      "Eerst",
                "last":       "Laatst",
                "next":       "Volgende",
                "previous":   "Vorig"
            },
        }
    });
}

document.getElementById('clearVotesButton').addEventListener('click', async () => {
    $('#warningModal').modal('show');
    document.getElementById('warningYes').addEventListener('click', async () => {
        const response = await fetch('/api/clearVotes', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
        });
        location.reload();
    });
    document.getElementById('warningNo').addEventListener('click', async () => {
        $('#warningModal').modal('hide');
    });
});

fetchVotingStats();
