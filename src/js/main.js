const playersContainer = document.getElementById("players-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const groupMembers = document.getElementById("group-members");

const select_players = [];
let players_list = [];

async function fetchPlayersByName(name) {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`
    );
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }
    const data = await res.json();

    if (data?.player) {
      return data;
    } else {
      return {
        player: [],
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      player: [],
    };
  }
}

(async function () {
  const data = await fetchPlayersByName("");

  players_list = data?.player;
  renderPlayers();
})();

async function handleSearchButton() {
  const value = searchInput.value;

  const data = await fetchPlayersByName(value);

  players_list = data?.player;

  renderPlayers();
}

function handleAddGroup(button, name) {
  button.innerText = "Already added"
  button.className = "btn btn-danger"
  button.disabled = true;

  select_players.push(name);

  if (select_players.length < 12) {
    groupMembers.innerHTML = `
      <h5 class="card-title mb-2">
        Total Members: ${select_players?.length}
      </h5>
    `;

    select_players.forEach((playerName) => {
      groupMembers.innerHTML =
        groupMembers.innerHTML += `<span class="badge text-bg-primary me-2">${playerName}</span>`;
    });
  } else {
    groupMembers.innerHTML += `<h5 class="mt-3">Max members are 11</h5>`;
  }
}

function renderPlayers() {
  playersContainer.innerHTML = "";

  if (players_list.length > 0) {
    players_list?.forEach((player) => {
      playersContainer.innerHTML = playersContainer.innerHTML +=
        playerCard(player);
    });
  } else {
    playersContainer.innerHTML = "<h3>No player found.</h3>";
  }
}

function playerCard(playerData) {
  const {
    strPlayer,
    strCutout,
    idPlayer,
    strBirthLocation,
    strNationality,
    strDescriptionEN,
    strFacebook,
    strInstagram,
    strTwitter,
    strGender,
    strSport,
  } = playerData || {};

  let img = "";

  if (strCutout) {
    img = `<img src="${strCutout}" class="card-img-top" alt="${idPlayer}"/>`;
  }

  return `
    <div class="card mb-4">
      ${img}
        <div class="card-body">
            <h3>
                <b>Name: </b> ${strPlayer}
            </h3>
            <p>
                ${
                  strDescriptionEN &&
                  strDescriptionEN?.split(" ")?.splice(0, 20)?.join(" ")
                }
            </p>
            <div class="d-flex justify-content-between">
                <p><b>Gender: </b> ${strGender}</p>
                <p><b>Sport: </b> ${strSport}</p>
            </div>
            <div class="mb-4">
                 <p><b>Nationality: </b> ${strNationality}</p>
                <p><b>Location: </b> ${strBirthLocation}</p>
            </div>

            <button class="btn btn-primary" onclick="handleAddGroup(this, '${strPlayer}')">Add to Group</button>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#${idPlayer}">
                Details
            </button>
      </div>
    </div>

    <div class="modal fade" id="${idPlayer}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">${strPlayer}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4><b>Name: </b> ${strPlayer}</h4>
                    <p>
                    ${
                      strDescriptionEN &&
                      strDescriptionEN?.split(" ")?.splice(0, 20)?.join(" ")
                    }
                    </p>
                
                    <p><b>Gender: </b> ${strGender}</p>
                    <p><b>Sport: </b> ${strSport}</p>
                    <p><b>Nationality: </b> ${strNationality}</p>
                    <p><b>Location: </b> ${strBirthLocation}</p>

                    <div class='d-flex gap-2 mt-4'>
                       <a href="${strFacebook}" target="_blank">
                           <i class="fa-brands fa-facebook fs-4"></i>
                       </a>

                       <a href="${strTwitter}" target="_blank">
                            <i class="fa-brands fa-x-twitter fs-4"></i>
                       </a>

                       <a href="${strInstagram}" target="_blank">
                            <i class="fa-brands fa-square-instagram fs-4"></i>
                       </a>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
}
