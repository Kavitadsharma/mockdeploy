const jsonServer=require("json-server")
const fs=require("fs")
const server= jsonServer.create()
const router=jsonServer.router('db.json')
const middleware=jsonServer.defaults()
const bodyParser=require("body-parser")
server.use(bodyParser.json())
server.use(middleware)
const port=8080

server.get("/home",(req,res)=>{
    res.send("home page")
})
server.post("/events",(req,res)=>{
    const{poster,name,description,date,location,category,price}=req.body;
    fs.readFile("./db.json",(err,data)=>{
        if(err){
            res.send({message:"somwthing went wrong"})
 return
       }
       var data=JSON.parse(data.toString())
       var last_id=data.events[data.events.length-1].id;
       console.log(last_id)
       data.events.push({"id":last_id+1,poster,name,description,date,location,category,price})
       const writedata=fs.writeFile("./db.json",JSON.stringify(data),(err,result)=>{
        if(err){
            res.send(err)
        }
       })
       res.send("event registered")
    })
})
server.get("/events",(req,res)=>{
    fs.readFile("db.json",(err,data)=>{
        if(err){
            res.send({message:"something went wrong"})
            return
        }
        var data=JSON.parse(data.toString())
        res.send(data)
    })
})


server.delete("/events/:id", (req, res) => {
    const eventId = parseInt(req.params.id);
    fs.readFile("db.json", (err, data) => {
        if (err) {
            res.status(500).send({ message: "Something went wrong" });
            return;
        }
        
        const jsonData = JSON.parse(data.toString());
        const eventIndex = jsonData.events.findIndex(event => event.id === eventId);
        
        if (eventIndex === -1) {
            res.status(404).send({ message: "Event not found" });
            return;
        }

        jsonData.events.splice(eventIndex, 1);

        fs.writeFile("db.json", JSON.stringify(jsonData), err => {
            if (err) {
                res.status(500).send({ message: "Error while deleting event" });
                return;
            }
            
            res.send({ message: "Event deleted successfully" });
        });
    });
});


server.put("/events/:id", (req, res) => {
    const eventId = parseInt(req.params.id);
    const { poster, name, description, date, location, category, price } = req.body;

    fs.readFile("db.json", (err, data) => {
        if (err) {
            res.status(500).send({ message: "Something went wrong" });
            return;
        }

        const jsonData = JSON.parse(data.toString());
        const eventIndex = jsonData.events.findIndex(event => event.id === eventId);

        if (eventIndex === -1) {
            res.status(404).send({ message: "Event not found" });
            return;
        }
        const updatedEvent = {
            id: eventId,
            poster: poster || jsonData.events[eventIndex].poster,
            name: name || jsonData.events[eventIndex].name,
            description: description || jsonData.events[eventIndex].description,
            date: date || jsonData.events[eventIndex].date,
            location: location || jsonData.events[eventIndex].location,
            category: category || jsonData.events[eventIndex].category,
            price: price || jsonData.events[eventIndex].price
        };

        jsonData.events[eventIndex] = updatedEvent;

        fs.writeFile("db.json", JSON.stringify(jsonData), err => {
            if (err) {
                res.status(500).send({ message: "Error while updating event" });
                return;
            }

            res.send({ message: "Event updated successfully" });
        });
    });
});





server.use(router);
server.listen(port,()=>{
    console.log(`running to the port ${port}`)
})