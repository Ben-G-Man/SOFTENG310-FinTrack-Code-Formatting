const express = require('express');
const { checkEmailExists, checkPasswordCorrect, createUser  , getUserID,  makeTransaction , getBalance, getUserTransactionsByPage} = require('../services/userService');
const {isAuthenticated} = require('../middleware/autMiddleware')
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/checkEmailExists', async (req, res) => {
    const email = req.body.email;
    const emailExists = await checkEmailExists(email);
    res.send({ emailExists });
});

router.post('/checkPasswordCorrect', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const passwordCorrect = await checkPasswordCorrect(email, password);
    res.send({ passwordCorrect });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.send({ success: false, error: 'Email does not exist' });
        }

        const passwordCorrect = await checkPasswordCorrect(email, password);
        if (!passwordCorrect) {
            return res.send({ success: false, error: 'Incorrect password' });
        }

        const userId = await getUserID(email);
        const token = jwt.sign({
            id: userId,
            email: email
        }, "my key", { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Checking if email exists');
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.send({ success: false, error: 'Email already in use' });
        }

        console.log('Creating user');
        await createUser(email, password);

        console.log('Getting user ID');
        const userId = await getUserID(email);
        
        console.log('Creating JWT token');
        const token = jwt.sign({
            id: userId,
            email: email
        }, "my key", { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});
router.get('/getBalance', isAuthenticated, async (req, res) => {
    const userID = req.user.id;
    try {
        const result = await getBalance(userID);
        res.send({ result: result });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});
router.post('/makeTransaction', isAuthenticated, async (req, res) => { 
    const {amount,title,description} = req.body;

    const userID = req.user.id;
    try {
        await makeTransaction(userID , amount , title , description );
        res.send({ success: true });
    } catch (error) {
        console.error('Error making transactions', error);
        res.status(500).send({ success: false, error: error.message });
    }
});
router.post('/getTransactionByPage' , isAuthenticated , async(req , res) =>{
    const {pageNumber} = req.body;
    const userID = req.user.id;
    try{
       const result =  await getUserTransactionsByPage(userID , pageNumber);
       res.status(200).send({sucess : true , result : result})
    }catch{
        console.error('Error when getting transactions' , error);
        res.status(500).send({ success: false, error: error.message });
    }
})

module.exports = router;