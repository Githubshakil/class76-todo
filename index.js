const http = require("http")
const fs = require("fs")
const path = require("path")
const { error } = require("console")
// const url = require("url")

const PORT = 3000
const DATA_FILE = path.join(__dirname, "todos.json")

function readTodos(){
    const data = fs.readFileSync(DATA_FILE, "utf8")
    return data ? JSON.parse(data):[]
}

function writeTodos(todos){
   fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2))
    // console.log(abc)
    
}

const server = http.createServer((req,res)=>{
    let pathName = req.url
    let method = req.method
    if(pathName === "/todos" && method === "GET"){
            let todos = readTodos()
            res.end(JSON.stringify(todos))
    }



    if(pathName === "/todos" && method === "POST"){
            let body = ""
            req.on('data' , (chunk)=>{
                body += chunk.toString()
                // console.log(body)
            })
            req.on("end", ()=>{
                const {title} = JSON.parse(body)
                if(!title){
                    res.end(JSON.stringify({error: "title is requerd"}))
                    return
                }
                const todos = readTodos()
                let newTodos = {
                    id: todos.length + 1,
                    title: title,
                    complete: false
                }
                todos.push(newTodos)
                writeTodos(todos)
                res.end(JSON.stringify({sucess: "todos created"}))
            })
    }

//this is delet post

    if(pathName === '/todos' && method === 'DELETE'){
        let body = ''
        req.on('data', (chunk)=>{
            body += chunk.toString()
        })
        req.on('end', ()=>{
            const {id} = JSON.parse(body)
            const todos = readTodos()
            const todoId = todos.filter((item)=> item.id !== id)
            writeTodos(todoId)
            res.end(JSON.stringify({sucess: "todo deleted"}))
        })
    }

    //this is edit  post

    if(pathName === '/todos' && method === 'PUT'){
        let body = ""
        req.on('data', (chunk)=>{
            body += chunk.toString()
        })

        req.on('end', () => {
            const {id, title} = JSON.parse(body)
            const todos = readTodos()
            const todoIndex = todos.findIndex((item)=> item.id === id)
            
            const editTodos = {
                id: todos[todoIndex].id,
                title: title,
                complete: todos[todoIndex].complete
            }
            todos[todoIndex] = editTodos
            writeTodos(todos)
            res.end(JSON.stringify({sucess:"todos updated"}))
        })
    }
    

})



server.listen(PORT,()=>{
    console.log("server is running")
})
