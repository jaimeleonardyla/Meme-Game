// imports
import express from 'express';
import morgan from 'morgan';
import { getUser } from './user-dao.mjs';
import cors from 'cors';
import { getImage, getMeme, verifyCaption, getCorrectCaptions, saveRound, completeGame, getGameSummary, getGameHistory } from './meme-dao.mjs';


// passport
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'))

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));



passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

  


app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));



app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current -- NEW
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.get('/api/image', async (req, res) => {
  try{
    const image = await getImage();
    if(image.error)
      res.status(404).json(image);
    else
      res.json(image);
  }catch{
    res.status(500).end();
  }
});

app.post('/api/meme', async (req, res) => {
  const usedImageIds = req.body.usedImageIds || [];
  try {
    const meme = await getMeme(usedImageIds);
    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching meme' });
  }
});


app.post('/api/meme/verify',async(req, res) => {
  const { imageId, captionId } = req.body;
  try {
    const isCorrect = await verifyCaption(imageId, captionId);
    
    res.json(isCorrect);
    } catch (error) {
    res.status(500).end();
  }

});


app.post('/api/meme/correct-captions',async(req, res) => {
  const { imageId } = req.body;
  try {
    const captions = await getCorrectCaptions(imageId);
    
    res.json(captions);
    } catch (error) {
    res.status(500).end();
  }

});

app.post('/api/complete-game',isLoggedIn,async(req,res) =>{
  try{
    const {userId,score,rounds} = req.body
    const gameId = await completeGame(userId,score);

    for (const round of rounds) {
      await saveRound(gameId, round.meme_id, round.selected_caption, round.correct ? 5 : 0);
    }

    res.status(201).json({gameId});
  }catch(e){
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({ error: 'Impossible to complete game.' });

  }
})


app.get('/api/games/:gameId/summary',isLoggedIn, async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const summary = await getGameSummary(gameId);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching game summary' });
  }
});

app.get('/api/:userId/history', isLoggedIn, async (req, res) => {
  const userId = req.params.userId;

  try {
    const gameIds = await getGameHistory(userId);

    const history = {
      totalScore: 0,
      games: []
    };

    for (const gameId of gameIds) {
      try {
        const gameSummary = await getGameSummary(gameId);
        history.totalScore += gameSummary.totalScore;
        history.games.push(gameSummary);
      } catch (err) {
        return res.status(500).json({ error: 'Error fetching game summary' });
      }
    }

    res.json(history);
  } catch (err) {
    console.error('Error fetching game history:', err);
    res.status(500).json({ error: 'Error fetching game history' });
  }
});





// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
