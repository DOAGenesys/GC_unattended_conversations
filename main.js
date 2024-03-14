// Define necessary global variables
let speedDials = [];

// PureCloud Platform Client and API instances
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
const externalContactsApi = new platformClient.ExternalContactsApi();

function getConfig() {
    return fetch('/api/getConfig')
        .then(response => {
            if (!response.ok) {
                throw new Error('Environment vars could not be retrieved');
            }
            return response.json();
        });
}

async function start() {
    try {
        const config = await getConfig();
        startGCSDKs(config.clientId);
    } catch (error) {
        console.error('Error occurred while starting:', error);
    }
}

// Search function triggered by the search button
async function searchExternalContacts() {
    const searchText = document.getElementById('searchTextbox').value;
    try {
        // Update the API call with search text and default paging options
        const data = await externalContactsApi.getExternalcontactsContacts({
            pageSize: 10,
            pageNumber: 1,
            q: searchText
        });

        // Display the search results
        displaySearchResults(data.entities);
    } catch (err) {
        console.error('Error searching external contacts:', err);
    }
}

// Function to display search results and add to the HTML
function displaySearchResults(contacts) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = ''; // Clear previous results

    // Check if there are no contacts and display the noResultsMessage if so
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (contacts.length === 0) {
        noResultsMessage.style.display = 'block'; // Show no results message
    } else {
        noResultsMessage.style.display = 'none'; // Hide no results message

        // Iterate through the contacts and create list items for each
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.textContent = `${contact.firstName} ${contact.lastName} - ${contact.workPhone ? contact.workPhone.e164 : 'N/A'}`;
            
            // Add a favorite button for each contact
            const favButton = document.createElement('button');
            favButton.textContent = 'Favorite';
            favButton.onclick = () => addToSpeedDials(contact);
            li.appendChild(favButton);

            resultsSection.appendChild(li);
        });
    }
}

// Function to add a contact to the speed dials list
function addToSpeedDials(contact) {
    // Ensure the speed dial does not exceed 10 contacts
    if (speedDials.length >= 10) {
        alert('Speed dial list can only contain up to 10 contacts.');
        return;
    }

    // Check if the contact is already in the speed dials
    if (speedDials.find(dial => dial.id === contact.id)) {
        alert('This contact is already in your speed dial list.');
        return;
    }

    // Add the contact to the speed dial list and update the UI
    speedDials.push(contact);
    updateSpeedDialUI();
}

// Function to update the speed dial section in the UI
function updateSpeedDialUI() {
    const speedDialList = document.getElementById('speedDialList');
    speedDialList.innerHTML = ''; // Clear existing entries

    // Iterate through the speed dials and add them to the list
    speedDials.forEach(contact => {
        const li = document.createElement('li');
        li.textContent = `${contact.firstName} ${contact.lastName} - ${contact.workPhone ? contact.workPhone.e164 : 'N/A'}`;
        speedDialList.appendChild(li);
    });
}
