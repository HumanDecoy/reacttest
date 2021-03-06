import React, { Component } from 'react';
import firebase from'./firebase.js';
import './App.css';
import Login from './components/login/Login.js';
import Sheep from './sheep.gif';


class App extends Component {

  state ={
        todos: [],
        employees: [],
        todoValue: '',
        username:'',
        password:'',
        user:"",
        currentusername:'',
     
    }


  
  toArray(firebaseObject) {
    let array = []
    for(let item in firebaseObject){
      array.push({ key: item, value: firebaseObject[item] })
    }
    return array;
  }

  componentDidMount(){

        firebase.auth().onAuthStateChanged(user => {
          if (user) {
        //Logged in, change states!
        this.setState({user:user})
        
           } else{
        this.setState({user:''})
      
            }
        })


        firebase.database().ref("employees").orderByChild("born")
        .startAt("1985").endAt("1995")
         .on('value', (snapshot) => {
            let sortedEmploy = [];
            snapshot.forEach(item => {
                sortedEmploy.push(item.val());
            })
            this.setState({employees: sortedEmploy})
        })


        firebase.database().ref(`todos`).on('child_added', (snapshot) => {
            console.log("Adding item")
            const todos = [...this.state.todos];
            const todo = {
                key: snapshot.key,
                value:snapshot.val()
            }
            todos.push(todo);
            this.setState({ todos: todos })
        })

        firebase.database().ref(`todos`).on('child_removed', (snapshot) => {
            const todos = [...this.state.todos];
            console.log("Filtering for delete")
            const filteredTodo = todos.filter((item) => { return item.key !== snapshot.key})
            this.setState({ todos: filteredTodo })
        })

        firebase.database().ref(`todos`).on('child_changed', (snapshot) => {
           const todos = [...this.state.todos];
            // Loop the object
           const updatedTodos = todos.map(item =>{
            // if object is found  
            console.log("Mapping uppdate")
            if (item.key === snapshot.key){
                 return Object.assign({}, item, {value: snapshot.val()})
               }else{
                 return item;
               }
           })
            this.setState({ todos: updatedTodos })
        })
  }

  
        
     onSubmit = e => {
    e.preventDefault();
    firebase.auth()
      .createUserWithEmailAndPassword(this.state.username, this.state.password)
      .then(user => console.log("Created user", user))
      .catch(error => console.log(error))
  };

    signIn = (e) => {
    e.preventDefault();
    firebase.auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(user => console.log("Signed in !", user))
      .catch(error => console.log(error));
  }


    
     signOut = (e) => {
      e.preventDefault();
      console.log("SIGN OUT!")
      firebase.auth().signOut();
  }

      addTodo = (e) => {
       e.preventDefault();
       //Create a new object with value from inputfield, value
       //saved in state
       const objectToPush = {
          name: this.state.todoValue,
          completed: false,
          date: (new Date().toLocaleString())
       }
       //And push the object, callbacks are optional, could be 
       //a good idea to catch errors and display som helper logs
       firebase.database().ref(`todos`).push(objectToPush)
        .then(()=> { console.log('Pushed!') })
        .catch(error => { console.log('You messed up', error) })
    }

    removeTodo = (key) => {
        //If we have the key we can do pretty much anything
        //the location of the todo is "todos/key". So we use that as a ref.
        //Every value inside the todo is accessed by "todos/key/value"
        firebase.database().ref(`todos/${key}`).remove()
            .then(()=> {console.log('Removed!')})
            .catch(error => {console.log('You messed up', error)})
    }

    toggleCompleted = (todo) => {
        //Everything is an object. 'completed' is an object inside 'todos/key'
        //so we can choose to set only that value. We just negate the current
        //value we have: !todo.value.completed
        firebase.database().ref(`todos/${todo.key}/completed`)
            .set(!todo.value.completed)
            .then (()=> {console.log('Todo is Completed')})
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value})
  

  
 
    render(){
      


        const employ = this.state.employees.map(item => 
          
          <div key={item.key} className="App-Nocolor" >
              <li>Name : {item.firstName} {item.lastName}</li>
              <li>Dollars: {item.amountOnBank}</li>
              <li>Born: {item.born}</li>
            
          </div> 
      )



         const list = this.state.todos.map(todo => 
            !todo.value.completed ? 
          <div key={todo.key} className={todo.value.completed ? "App-color" : "App-Nocolor" }>
              <p>{todo.value.name}</p>
              <p>{todo.value.date}</p>
              <button onClick={() => {this.removeTodo(todo.key)}}> Remove </button>
          <button onClick={() => {this.toggleCompleted(todo)}}> Done </button>
          </div> :null
      )

      const doneList =  this.state.todos.map(todo => 
        todo.value.completed ? 
            <div key={todo.key} className={todo.value.completed ? "App-color" : "App-Nocolor" }>
                <p>{todo.value.name}</p>
                <p> {todo.value.date}</p>
                <button onClick={() => {this.removeTodo(todo.key)}}> Remove </button>
               
            </div> : null
  )
      return(
         
         <div className="App">
             <img src={Sheep} alt="HTML5 Icon"/>
               {!this.state.user ? 
              <Login onChange={this.onChange} username={this.state.username} password={this.state.password} register={this.onSubmit} signIn={this.signIn} />
              : 

          <div classname="App">
           <h1> Logged in as  {this.state.user.email} </h1>
            <button className="btn btn-danger" onClick={this.signOut}>Sign Out</button>
              <form onSubmit={this.addTodo}>
                  <input 
                      type="text" 
                      value={this.state.todoValue} 
                      onChange={this.onChange} 
                      name="todoValue"/>
                  <input type="submit" value="Add Todo" />
              </form>

          <h1> TODO ! </h1>
              { list }
        <h1> DONE ! </h1>
        {doneList}
          <h1> The thing : </h1>
          {employ}
          </div> }
          </div>

          )
  }
}
  export default App;
  
