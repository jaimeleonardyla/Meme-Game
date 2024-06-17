
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

const getMeme = async (usedImageIds) => {
  const response = await fetch(SERVER_URL + '/api/meme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ usedImageIds })
  });
  if (response.ok) {
    return await response.json();
  } else {
    const errMessage = await response.text();
    throw new Error(errMessage);
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

const completeGame = async(userId,score,rounds) =>{
  const response = await fetch(SERVER_URL + '/api/complete-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, score, rounds }),
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

const getGameSummary = async(gameId) =>{
  const response = await fetch(SERVER_URL + `/api/games/${gameId}/summary`,{
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

const getGameHistory = async(userId) =>{
  const response = await fetch(SERVER_URL +`/api/${userId}/history`, {
    credentials: 'include'
  })
  if(!response.ok){
    const errMessage = await response.text();
    throw new Error(errMessage);
  }else{
    const result = await response.json(); // Parse the JSON response
    return result;
  }
}


const API = {logIn, logOut, getUserInfo, getMeme, verifyCaption, getCorrectCaptions, completeGame,  getGameSummary, getGameHistory};
export default API;
  
  