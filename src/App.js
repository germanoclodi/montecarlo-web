import React, {Component} from 'react';
import axios from 'axios';
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { push as Menu } from 'react-burger-menu'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ReactTooltip from 'react-tooltip'
import logo from './icon.ico';

class App extends Component {

    state = {
      menuOpen: false,
      loading: true,
      chart_values: 0,
      optimistic: 0,
      likely: 0,
      pessimistic: 0,
      certainty_level: 0,
      card_count: 0,
      run_count: 0,
      outlier_cards: []
    };

    handleStateChange (state) {
      this.setState({menuOpen: state.isOpen})  
    }

    closeMenu () {
      this.setState({menuOpen: false})
    }

    handleOptimisticChange = event => {
      this.setState({ optimistic: event.target.value });
    }
    handleLikelyChange = event => {
      this.setState({ likely: event.target.value });
    }
    handlePessimisticChange = event => {
      this.setState({ pessimistic: event.target.value });
    }
    handleCertaintyLevelChange = event => {
      this.setState({ certainty_level: event.target.value });
    }
    handleCardCountChange = event => {
      this.setState({ card_count: event.target.value });
    }
    handleRunCountChange = event => {
      this.setState({ run_count: event.target.value });
    }
    handleChange = (e) => {
      let outlier_cards = [...this.state.outlier_cards];
      outlier_cards[e.target.dataset.id] = e.target.value;
      this.setState({ outlier_cards: outlier_cards });
    }
    
    addCard = (e) => {
      this.setState((prevState) => ({
        outlier_cards: [...prevState.outlier_cards, ""],
      }));
    }

    removeCards = (e) => {
      this.setState({ outlier_cards: [] });
    }

    handleSubmit = event => {
      event.preventDefault();
      
      this.setState({ loading: true });

      const montecarlo_parameters = {
        optimistic: this.state.optimistic,
        likely: this.state.likely,
        pessimistic: this.state.pessimistic,
        certainty_level: this.state.certainty_level,
        card_count: this.state.card_count,
        run_count: this.state.run_count,
        outlier_cards: this.state.outlier_cards
      };

      axios.post("http://0.0.0.0:5000/montecarlo", { montecarlo_parameters })
        .then(res => {
          this.setState({ chart_values: res.data });
          this.setState({ loading: false });
        })

        this.closeMenu();
    }
    
    render() {
      return (
        <div id="App">
          <Menu customBurgerIcon={ <img src={logo} alt="ateliware logo for opening the configuration sidebar"/> } pageWrapId={ "page-wrap" } outerContainerId={ "App" } isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}> 
          <ReactTooltip place="right" multiline={true}/>
          <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <label>
              <b>Optimistic</b>:
              </label><br/>
                <input type="text" name="optimistic" onChange={this.handleOptimisticChange} autoComplete={"off"} data-tip="Being optimistic, how many days does it take to<br />solve a card in this project?<br />If you're not sure, put 1." />
              <br/>
              <br/>
              <label>
              <b>Likely: </b>
              </label><br/>
                <input type="text" name="likely" onChange={this.handleLikelyChange} autoComplete={"off"} data-tip="Usually, how many days does it take to<br />solve a card in this project?<br />If you're not sure, put 2." />
              <br/>
              <br/>
              <label>
              <b>Pessimistic: </b>
              </label><br/>
                <input type="text" name="pessimistic" onChange={this.handlePessimisticChange} autoComplete={"off"} data-tip="Being pessimistic, how many days does it take to<br />solve a card in this project?<br />If you're not sure, put 5." />
              <br/>
              <br/>
              <label>
              <b>Certainty Level: </b>
              </label><br/>
                <input type="text" name="certainty_level" onChange={this.handleCertaintyLevelChange} autoComplete={"off"} data-tip="From 1 to 10, how sure are you about above assumptions?<br />If you're not sure, put 6."/>
              <br/>
              <br/>
              <label>
              <b>Card Count: </b>
              </label><br/>
                <input type="text" name="card_count" onChange={this.handleCardCountChange} autoComplete={"off"} data-tip="How many functionalities does this project have on it's WBS?" />
              <br/>
              <br/>
              <label>
              <b>How Many Runs: </b>
              </label><br/>
                <input type="text" name="run_count" onChange={this.handleRunCountChange} autoComplete={"off"} data-tip="How many times should the engine run?<br />If you're not sure, put 5000." />
              <br/>
              <br/>
              <label >
              <b>Outlier Cards: </b>
              </label><br/>
              <div className="row">
              {
                this.state.outlier_cards.map((val, idx)=> {
                  let cardId = `card-${idx}`
                  return (
                    <div key={idx}>
                      <input
                        type="text"
                        name={cardId}
                        data-id={idx}
                        id={cardId}
                        value={this.state.outlier_cards[idx].name} 
                        className="name"
                        style={{borderRadius:20, width:40, height:40, fontSize:20, marginLeft: 10, marginBottom: 10, fontWeight:"bold"}}
                      />
                    </div>
                  )
                })
              }
              <input type="button" onClick={this.addCard} style={{borderRadius:20, width:40, height:40, fontSize:20, marginLeft: 10, marginBottom: 10, fontWeight:"bold", backgroundColor: "#dbffe1"}} name="outlier_cards" value="+" data-tip="Insert here the duration in days of<br />atypical cards when compared to the average."/>
              <input type="button" onClick={this.removeCards} style={{borderRadius:20, width:40, height:40, fontSize:20, marginLeft: 10, marginBottom: 10, fontWeight:"bold", backgroundColor: "#ffdbe4"}} name="outlier_cards" value="×" data-tip="Clear added outliner cards."/>              
              </div>
              <br/>
              <button type="input" className="btn btn-outline-success" style={{display: "flex", margin: "0 auto"}}>Run Simulation!</button>
            </form>
          </Menu>
          <div id="page-wrap" >
            <h1 style={{textAlign: "center", marginTop: "2%", fontSize: "300%"}}><b>Monte Carlo</b></h1>
            <h2 style={{textAlign: "center", marginTop: "0"}}>Project Delivery Simulation</h2>
            
            {this.state.loading ? 
              <div style={{marginTop: 100}}>
                <Loader 
                  margin={{top: 100}}
                  type="Oval"
                  color="#00C8FF"
                  height={70}
                  width={70} />
              </div> : 
              <ResponsiveContainer aspect={2.19} style={{marginBottom: "10%"}}>
                <LineChart data={this.state.chart_values} margin={{top: 27, right: 160, left: 100, bottom: 30}}>
                  <Line type="monotone" dataKey="%" stroke="#00C8FF" strokeWidth="3" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip labelFormatter={(name) => "Days: " + name} />
                  <XAxis dataKey="day" />
                  <YAxis />
                </LineChart>
              </ResponsiveContainer>
            }
          </div>
        </div>
      );
    }

}

export default App;