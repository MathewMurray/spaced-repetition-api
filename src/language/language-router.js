const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./linkedList')


const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const [word] = await LanguageService.getWordById(
        req.app.get('db'),
        req.language.head
      );

      res.json({
        nextWord:word.original,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
        totalScore: req.language.total_score
      });
      next()
    } catch(error){
      next(error)
    }
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    const db = req.app.get('db');
    const {guess} = req.body;
    const userGuess = guess
    let currentHead = req.language.head;
    let previousWord = currentHead

    if(!userGuess){
      return res.status(400).json({
        error: `Missing 'guess' in request body`,
      })
    }

    try{
      const wordList = new LinkedList();

      let [headNode] = await LanguageService.getWordById(db, req.language.head);
      wordList.insertFirst(headNode);

      while (headNode.next !== null) {
        const [nextNode] = await LanguageService.getWordById(db,headNode.next);
        wordList.insertLast(nextNode);
        headNode = nextNode;
      }

      let isCorrect = false;
      if(guess.toLowerCase() === wordList.head.value.translation.toLowerCase()){
        isCorrect = true;
        ++wordList.head.value.correct_count;
        wordList.head.value.memory_value *= 2;
        ++req.language.total_score;
      } else {
        ++wordList.head.value.incorrect_count;
        wordList.head.value.memory_value = 1;
      }

      let previousHead = wordList.head;
      wordList.remove(wordList.head.value);
      wordList.insertAt(previousHead.value.memory_value,previousHead.value);

      let tempNode = wordList.head;
      let langHead = tempNode.value.id;
      while (tempNode !== null){
        await LanguageService.updateWords(
          db,
          temp.value,
          tempNode.next !== null ? tempNode.next.value : null
        );
        tempNode = tempNode.next;
      }

      await LanguageService.uodateHead(
        db,
        req.language.id,
        req.language.user_id,
        langHead
      );

      await LanguageService.updateTotalScore(
        db,
        req.language.id,
        req.language.user_id,
        req.language.total_score
      );

      const response = {
        nextWord: wordList.head.value.original,
        wordCorrectCount: wordList.head.value.correct_count,
        wordIncorrectCount: wordList.head.value.incorrect_count,
        totalScore: req.language.total_score,
        answer: previousHead.value.translation,
        isCorrect: isCorrect
      };
      return res.status(200).json(response)
    } catch(error) {
      next(error)
    }
  })

module.exports = languageRouter
