import React, { Component } from 'react';
// here we import in our loader spinner as an image 
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif.js';



const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length); 
  return arr[randIndex];
};

// we pick out our props inside the header component 
//  we can pass down fucntions as props as well as things 
//  like numbers, strings, arrays or objects
const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if we have results then show the clear button otherwise show the title */}
    {hasResults ? (
      <button onClick={clearSearch} >
        <img src={clearButton} alt="clear button" />
      </button>
      ) : (
        <h1 className='title'> Jiffy</h1>
      )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
  {/* here we check wheterh we have a loading state and render our either our spinner or hinttext based on that, using a ternary operator  */}
    {loading ?  <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

 
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      //  we make our array to store thr gifs.
      gifs: []
    };
  }

  // we want a fucntion that searches the giphy API using fetch and puts the search term into the query URL and then we can do something with the results.

  searchGiphy = async searchTerm => {
    this.setState({
      // here we set our loading state to true and this will show the spinner at the bottom
      loading: true
    })


    try {
      //  here we await keyowrd to wait for our response to come back 
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=PG9fZKG5G1RthcYOuzt65XNB8JQkJKy7&q=${searchTerm}&limit=25&offset=0&rating=R&lang=en`
      );
      //  convert the response to json
      //  const {data} gets the .data part of our response 
      const {data} = await response.json();

      // here we check if the array of results is empty and if it is then we throw an erro which will stop the code here

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }


      //  here we grab the radom result from our images
      const randomGif = randomChoice(data);
      console.log({randomGif})
      
      this.setState((prevState, props) => ({
        ...prevState,
        //  get the first result and put it in the state
        // here we use our spread to take the previous gifs and spread them out. Then we add our new random gif onto the end
        gifs: [...prevState.gifs, randomGif],
        // we turn offf our loading spinner   
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))

      // if our fetch fails then we catch it down here
    } catch (error) {
      this.setState((prevState, props) => ({
        hintText: error,
        loading: false
      }))
      console.log(error)
    }
  };

  // with create react app we can write our methods as arrows
  // functions which means we do not need the constructor methods and bind
  handleChange = event => {
    const {value} = event.target;
    //  by setting the searchTerm in our state and also using the input as the value
    //  we have created what is called a controlled input.
    this.setState((prevState, props) => ({
    //  we take our old props and spread them out here. 
    ...prevState,
    // and then we overwrite the ones we want after
    searchTerm: value,
    //  we set the hint text only when we have more than 2 characters 
    //  in our unout, otherwise we make it an empty string
    hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const {value} = event.target;
    // when we heave 2 or more characteristis in our search box
    // as we have also pressed enter, we want to run a search
    if (value.length > 2 && event.key === 'Enter') {
      // alert(`search for ${value}`);
      // use our searchGiphy function above
      this.searchGiphy(value)
    }
  };
  
  // here we reset our state by clearing everything out and making it default again (the saem as in our default state)
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    //  here we grab the input and then focus our cursor back on it 
    this.textInput.focus();
  };

  render() {
    // const searchTerm = this.state.searchTerm
    const {searchTerm, gifs} = this.state;
    // here we set a variable to see if we have any gifs. 
    const hasResults = gifs.length 

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        
        <div className="search grid">
          {/* our stack of gif images */}
          {/*  here we loop over our array of gif images from our state and we create many videso */}
          {this.state.gifs.map(gif => (
            //  we spread out all our properties onto our Gif component 
            <Gif {...gif} />
          ))}



    
          <input 
          className="input grid-item" 
          placeholder="Type something" 
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          value={searchTerm}
          ref={input => {
            this.textInput = input;
          }}
          />
        </div>
        {/*  here we pass our userHint  our state using a spread */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
