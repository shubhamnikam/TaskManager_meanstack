//get express
const express = require("express");
const app = express();
//JSON parser middleware
app.use(express.json());
//CORS middleware
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Origin, Authorize, X-Requested-With"
	);
	next();
});

//setup mongo db
const mongoose = require("./database/mongoose");
const List = require("./database/models/list");
const Task = require("./database/models/task");


//------------------------- LIST API -------------------------
//NOTE - get lists all items
app.get("/api/lists", (req, res) => {
	List.find({})
	.then((list) => {
		res.send(list);
	})
	.catch((err) => {
		console.error(err);
	});
});

//NOTE - get lists item by id
app.get("/api/lists/:listId", (req, res) => {
	List.find({ _id: req.params.listId })
	.then((list) => {
			res.send(list);
		})
		.catch((err) => {
			console.error(err);
		});
	});
	
//NOTE - add item into list
app.post("/api/lists", (req, res) => {
	new List({ title: req.body.title })
	.save()
	.then((list) => {
		res.status(201).send(list);
		})
		.catch((err) => {
			console.error(err);
		});
	});

	//NOTE - update lists item by id
app.patch("/api/lists/:listId", (req, res) => {
	List.findOneAndUpdate({ _id: req.params.listId }, { $set: req.body })
		.then((list) => {
			res.send(list);
		})
		.catch((err) => {
			console.error(err);
		});
});

//NOTE - delete lists item by id
app.delete("/api/lists/:listId", (req, res) => {
	//delete all tasks in list
	const deleteAllTasks = (list) =>{
		Task.deleteMany({_listId: req.params.listId})
		.then((list) => {
			return list;
		})
		.catch((err) => {
			console.error(err);
		});;
	}

	//delete list
	List.findOneAndDelete({ _id: req.params.listId })
	.then((list) => {
		res.status(200).send(deleteAllTasks(list));
	})
	.catch((err) => {
		console.error(err);
	});
});

//------------------------- TASK API -------------------------
//NOTE - get tasks all items by list id
app.get("/api/lists/:listId/tasks", (req, res) => {
	Task.find({ _listId: req.params.listId })
		.then((tasks) => {
			res.send(tasks);
		})
		.catch((err) => {
			console.error(err);
		});
});

//NOTE - get tasks all items by list id + task id
app.get("/api/lists/:listId/tasks/:taskId", (req, res) => {
	Task.find({
		$and: [{ _listId: req.params.listId }, { _id: req.params.taskId }],
	})
		.then((task) => {
			res.send(task);
		})
		.catch((err) => {
			console.error(err);
		});
});

//NOTE - add task item into list by list id
app.post("/api/lists/:listId/tasks", (req, res) => {
	new Task({ _listId: req.params.listId, title: req.body.title })
		.save()
		.then((task) => {
			res.status(201).send(task);
		})
		.catch((err) => {
			console.error(err);
		});
});

//NOTE - update list items by list id + task id
app.patch("/api/lists/:listId/tasks/:taskId", (req, res) => {
	Task.findOneAndUpdate(
		{ $and: [{ _listId: req.params.listId }, { _id: req.params.taskId }] },
		{ $set: req.body }
	)
		.then((task) => {
			res.send(task);
		})
		.catch((err) => {
			console.error(err);
		});
});

//NOTE - delete task item by list id + task id
app.delete("/api/lists/:listId/tasks/:taskId", (req, res) => {
	Task.findOneAndDelete({ $and: [{ _listId: req.params.listId }, { _id: req.params.taskId }] })
		.then((task) => {
			res.send(task);
		})
		.catch((err) => {
			console.error(err);
		});
});

// init listening port
app.listen(3000, () => {
	console.log("api listening...");
});
