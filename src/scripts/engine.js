const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox:
      document.getElementById("score_points") ||
      console.error("Element with ID 'score_points' not found."),
  },
  cardSprites: {
    avatar:
      document.getElementById("card-image") ||
      console.error("Element with ID 'card-image' not found."),
    name:
      document.getElementById("card-name") ||
      console.error("Element with ID 'card-name' not found."),
    type:
      document.getElementById("card-type") ||
      console.error("Element with ID 'card-type' not found."),
  },
  fieldCards: {
    player:
      document.getElementById("player-field-card") ||
      console.error("Element with ID 'player-field-card' not found."),
    computer:
      document.getElementById("computer-field-card") ||
      console.error("Element with ID 'computer-field-card' not found."),
  },
  actions: {
    button:
      document.getElementById("next-duel") ||
      console.error("Element with ID 'next-duel' not found."),
  },
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}magician.png`,
    WinOf: [1], // Ganha do Dark Magician
    LoseOf: [2], // Perde para Exodia
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}dragon.png`,
    WinOf: [2], // Ganha de Exodia
    LoseOf: [0], // Perde para Blue Eyes White Dragon
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0], // Ganha de Blue Eyes White Dragon
    LoseOf: [1], // Perde para Dark Magician
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return randomIndex; // Retorna o índice ao invés do ID da carta
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  state.actions.button.style.display = "none"; // Oculta o botão no início do duelo
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);
  await updateScore();
  await drawButton(duelResults); // Exibe o resultado do duelo no botão
}

async function checkDuelResults(playerCardId, computerCardId) {
  if (playerCardId == computerCardId) {
    return "Empate!";
  }

  // Verifica se a carta do jogador ganha da carta do computador
  if (cardData[playerCardId].WinOf.includes(computerCardId)) {
    await playAudio("win");
    state.score.playerScore++;
    return "Você ganhou!";
  }

  // Se não for empate e o jogador não ganhou, então o computador ganhou
  await playAudio("lose");
  state.score.computerScore++;
  return "Você perdeu!";
}

async function drawButton(text) {
  console.log("Exibindo resultado:", text); // Para debug no console
  state.actions.button.innerText = `${text}`;
  state.actions.button.style.display = "block"; // Exibe o botão
  state.actions.button.onclick = resetDuel; // Adiciona a funcionalidade de resetar o jogo
}

function resetDuel() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  state.actions.button.style.display = "none";
  drawCards(5, playerSides.player1); // Redesenha as cartas do jogador
  drawCards(5, playerSides.computer); // Redesenha as cartas do computador
}

async function drawSelectCard(idCard) {
  state.cardSprites.avatar.src = cardData[idCard].img;
  state.cardSprites.name.innerText = cardData[idCard].name;
  state.cardSprites.type.innerText = cardData[idCard].type;
}

async function removeAllCardsImages() {
  const computerCardsContainer = document.getElementById(playerSides.computer);
  const playerCardsContainer = document.getElementById(playerSides.player1);

  computerCardsContainer.innerHTML = "";
  playerCardsContainer.innerHTML = "";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawCards(numCards, fieldSide) {
  const cardContainer = document.getElementById(fieldSide);
  for (let i = 0; i < numCards; i++) {
    const randomCardId = await getRandomCardId();
    const cardImage = await createCardImage(randomCardId, fieldSide);
    cardContainer.appendChild(cardImage);
  }
}
async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

// Chame drawCards quando a página carregar
window.onload = async () => {
  await drawCards(5, playerSides.player1);
  await drawCards(5, playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
};
