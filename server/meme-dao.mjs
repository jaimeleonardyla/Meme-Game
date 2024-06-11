import { Image,Caption } from "./memeModel.mjs";

import {db} from './db.mjs'

export const getImage = () =>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * FROM image ORDER BY RANDOM() LIMIT 1';
        db.get(sql,[],(err,row)=>{
            if(err){
                reject(err);
            }else{
                resolve(new Image(row));
            }
        });
    });
}


const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getMeme = (usedImageIds = []) => {
  return new Promise((resolve, reject) => {
    let sqlImage = 'SELECT * FROM image ';
    if (usedImageIds.length > 0) {
      const placeholders = usedImageIds.map(() => '?').join(',');
      sqlImage += `WHERE id NOT IN (${placeholders}) `;
    }
    sqlImage += 'ORDER BY RANDOM() LIMIT 1';

    db.get(sqlImage, usedImageIds, (err, imageRow) => {
      if (err) {
        reject(err);
      } else if (!imageRow) {
        resolve({ error: 'No image found' });
      } else {
        const image = new Image(imageRow.id, imageRow.image_url);
        const sqlCaptions = `
          SELECT caption.* 
          FROM caption 
          JOIN meme ON caption.id = meme.caption_id 
          WHERE meme.image_id = ? 
          ORDER BY RANDOM()`;

        db.all(sqlCaptions, [image.id], (err, captionRows) => {
          if (err) {
            reject(err);
          } else {
            let captions = captionRows.map(row => new Caption(row.id, row.text));
            const captionsCount = captions.length;

            if (captionsCount < 7) {
              const sqlRandomCaptions = `
                SELECT * FROM caption 
                WHERE id NOT IN (
                  SELECT caption.id 
                  FROM caption 
                  JOIN meme ON caption.id = meme.caption_id 
                  WHERE meme.image_id = ?
                ) 
                ORDER BY RANDOM() 
                LIMIT ?`;

              db.all(sqlRandomCaptions, [image.id, 7 - captionsCount], (err, randomCaptionRows) => {
                if (err) {
                  reject(err);
                } else {
                  const randomCaptions = randomCaptionRows.map(row => new Caption(row.id, row.text));
                  captions = captions.concat(randomCaptions);
                  captions = shuffle(captions);  // Shuffle the combined list
                  resolve({ image, captions });
                }
              });
            } else {
              captions = shuffle(captions);  // Shuffle the list if there are already 7 or more captions
              resolve({ image, captions });
            }
          }
        });
      }
    });
  });
};

export const verifyCaption = (imageId, captionId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(*) AS count 
        FROM meme 
        WHERE image_id = ? AND caption_id = ?`;
      db.get(sql, [imageId, captionId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve({isCorrect: row.count > 0});
        }
      });
    });
  };

export const getCorrectCaptions = (image_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT caption.* FROM caption JOIN meme ON caption.id = meme.caption_id WHERE meme.image_id = ?';
    db.all(sql, [image_id],(err,rows) =>{
      if(err){
        reject(err);
      }else{
        resolve(rows);
      }

    })
})
}

export const saveRound = (gameId, imageId, selectedCaptionId, score) =>{
  return new Promise((resolve, reject) =>{
    const sql = 'INSERT INTO round (game_id, image_id, selected_caption_id, score) VALUES  (?,?,?,?)';
    db.run(sql,[gameId,imageId,selectedCaptionId,score],function(err){
      if(err){
        reject(err);
      }else{
        resolve(this.lastID);
      }
    });
  })
}

export const startGame = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO game (user_id, score) VALUES (?,0)';
    db.run(sql, [userId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export const endGame = (gameId, score) =>{
  return new Promise((resolve, reject) =>{
    const sql = 'UPDATE game SET score = ? WHERE id = ?'
    db.run(sql,[score,gameId],function(err){
      if(err){
        reject(err);
      }else{
        resolve({gameId, score});
      }
    });
  });
}

export const getGameSummary = (gameId) =>{
  return new Promise((resolve,reject)=>{
    const gameSummary = {
      totalScore: 0,
      rounds: []
    };

    const sqlGame = 'SELECT * FROM game WHERE id = ?';
    db.get(sqlGame, [gameId], (err, gameRow) => {
      if (err) {
        reject(err);
      } else if (!gameRow) {
        reject(new Error('Game not found'));
      } else {
        gameSummary.totalScore = gameRow.score;

        const sqlRounds = `
          SELECT round.*, image.image_url, caption.text AS selectedCaption 
          FROM round 
          JOIN image ON round.image_id = image.id 
          JOIN caption ON round.selected_caption_id = caption.id 
          WHERE round.game_id = ?`;
        
        db.all(sqlRounds, [gameId], (err, roundRows) => {
          if (err) {
            reject(err);
          } else {
            roundRows.forEach(row => {
              gameSummary.rounds.push({
                imageUrl: row.image_url,
                selectedCaption: row.selectedCaption,
                score: row.score
              });
            });
            resolve(gameSummary);
          }
        });
      }
    });
  });
};