// BUILD YOUR SERVER HERE
const express = require('express')
const model = require('./users/model')
const server= express();

server.use(express.json());

server.get('/', (req,res) => {
    console.log('received get request');
    res.json('hello world');
});

server.post('/api/users', (req,res)=> {
    let body = req.body;
    if (!body.name) {
        res.status(400).json({message: "Please provide name and bio for the user"});
    } else if (!body.bio) {
        res.status(400).json({message: "Please provide name and bio for the user"});
    } else {
        model.insert(body)
            .then(users => {
                res.status(201).json(users);
            })
            .catch(()=> {
                res.status(500).json({message: "There was an error while saving the user to the database"});
            })
    }
})

server.get('/api/users', (req,res)=> {
    model.find()
    .then(users => {
        res.json(users)
    })
    .catch(()=> {
        res.status(500).json({message: `could not get user`});
    })
})

server.get('/api/users/:id', (req,res)=> {
    let {id} = req.params;
        model.findById(id)
        .then(users => {
            console.log(users);
            if(users == null) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            } else {
                res.json(users);
            }
        }).catch(()=> {
            res.status(500).json({message: "The user information could not be retrieved"});
        })
})
server.delete('/api/users/:id', (req,res)=> {
    let {id} = req.params;
    model.remove(id)
    .then(users => {
        if(users == null) {
            res.status(404).json({ message: `The user with the specified ID does not exist` });  
            return;
        }
        res.status(200).json(users)
    })
    .catch(()=> {
        res.status(500).json({message: 'The user could not be removed'})
    })
})

server.put('/api/users/:id', async (req, res) => {
    let {id} = req.params;
    try {
    let users = await model.findById(id);
    if(users == null) {
        res.status(404).json({message: "The user with the specified ID does not exist"});
        return;
    }

    let body = req.body;
    if (!body.name) {
        res.status(400).json({message: "Please provide name and bio for the user"});
    } else if (!body.bio) {
        res.status(400).json({message: "Please provide name and bio for the user"});
    } else {
        let newUser = await model.update(id, body);
        console.log(newUser);
        res.status(200).json(newUser)
    }
} catch(e) {
    res.status(500).json({ message: 'The user information could not be modified' });
}
});
module.exports = server; // EXPORT YOUR SERVER instead of {}
