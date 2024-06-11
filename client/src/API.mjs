
const SERVER_URL = 'http://localhost:3001';




const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};

const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
};

const getMeme = async () => {
  const response = await fetch(SERVER_URL + '/api/meme');
  if (response.ok) {
    const meme = await response.json();
    return meme;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const verifyCaption = async (imageId, captionId) => {
  const response = await fetch(SERVER_URL + '/api/meme/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId: imageId, captionId: captionId }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errMessage = await response.text();
    throw new Error(errMessage);
  } else {
    const result = await response.json(); // Parse the JSON response
    return result;
  }
};

const getCorrectCaptions = async(imageId) =>{
  const response = await fetch(SERVER_URL + '/api/meme/correct-captions',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId: imageId}),
    credentials: 'include'
  });
  if (!response.ok) {
    const errMessage = await response.text();
    throw new Error(errMessage);
  } else {
    const result = await response.json(); // Parse the JSON response
    return result;
  }
};

const startGame = async() =>{
  const response = await fetch(SERVER_URL + '/api/games',{
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    const errMessage = await response.text();
    throw new Error(errMessage);
  }else{
    const game = await response.json(); // Parse the JSON response
    return game.gameId;
  }
}

const saveRound = async(gameId, imageId, selectedCaptionId) =>{
  const response = await fetch(SERVER_URL + `/api/games/${gameId}/rounds`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId: imageId, selectedCaptionId: selectedCaptionId}),
    credentials: 'include'
  });
  if(!response.ok){
    const errMessage = await response.text();
    throw new Error(errMessage);
  }else{
    return null
  }
}

const endGame = async(gameId, score) =>{
  const response = await fetch(SERVER_URL + `/api/games/${gameId}/end`,{
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: score}),
    credentials: 'include'
  });
  if(!response.ok){
    const errMessage = await response.text();
    throw new Error(errMessage);
  }else{
    const result = await response.json(); // Parse the JSON response
    return result;
  }
}

const getGameSummary = async(gameId) =>{
  const response = await fetch(SERVER_URL + `/api/games/${gameId}/summary`);
  if(!response.ok){
    const errMessage = await response.text();
    throw new Error(errMessage);
  }else{
    const result = await response.json(); // Parse the JSON response
    return result;
  }
}


const API = {logIn, logOut, getUserInfo, getMeme, verifyCaption, getCorrectCaptions, startGame, saveRound, endGame, getGameSummary};
export default API;
  
  