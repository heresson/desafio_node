const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req,res,next)  {
  const {id} = req.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(!isUuid(id)) {
    return res.status(400).json({error: "Invalid Repository id"})
  }

  if (repositoryIndex < 0) {
    return res.status(400).json({error: "Repository not found"})
  }

  return next();

}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const oldRepository = repositories[repositoryIndex];

  const newRepository = {
    id,
    title: title ? title : oldRepository.title,
    url: url ? url : oldRepository.url,
    techs: techs ? techs : oldRepository.techs,
    likes: oldRepository.likes,
  };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);

});

app.delete("/repositories/:id",validateRepositoryId, (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateRepositoryId,(request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const oldRepository = repositories[repositoryIndex];

  repositories[repositoryIndex] = {
    id,
    title: oldRepository.title,
    url: oldRepository.url,
    techs: oldRepository.techs,
    likes: (++oldRepository.likes),
  }

  return response.json(repositories[repositoryIndex]);

});


module.exports = app;
