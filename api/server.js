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
        res.status(400).json({message: `name is required`});
    } else if (!body.bio) {
        res.status(400).json({message: `bio is required`});
    } else {
        model.insert(body)
            .then(users => {
                res.status(201).json(users);
            })
            .catch(()=> {
                res.status(500).json({message: `could not create user`});
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
                res.status(404).json({ message: `user ${id} not found!` });
            } else {
                res.json(users);
            }
        }).catch(()=> {
            res.status(500).json({message: `could not get a dog`});
        })
})
server.delete('/api/users/:id', (req,res)=> {
    let {id} = req.params;
    model.remove(id)
    .then(users => {
        if(users == null) {
            res.status(404).json({ message: `user ${id} not found!` });  
            return;
        }
        res.status(200).json(users)
    })
    .catch(()=> {
        res.status(500).json({message: 'couldnt not delete user'})
    })
})

server.put('/api/users/:id', async (req, res) => {
    let {id} = req.params;
    try {
    let users = await model.findById(id);
    if(users == null) {
        res.status(404).json({message: `user ${id} not found!`});
        return;
    }

    let body = req.body;
    if (!body.name) {
        res.status(500).json({message: `name is required`});
    } else if (!body.bio) {
        res.status(500).json({message: `bio is required`});
    } else {
        let newUser = await model.update(id, body);
        console.log(newUser);
        res.status(200).json(newUser)
    }
} catch(e) {
    res.status(500).json({ message: `could not update dog!` });
}
});
module.exports = server; // EXPORT YOUR SERVER instead of {}
