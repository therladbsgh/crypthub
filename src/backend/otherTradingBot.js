
console.log("hi);
//This is what a bot would look like

if (getPrice('BTC') > 10) {
  buy('BTC', 100)//Buy 100$ worth of BTC
}

if (own('BTC') > 1000) {    // Own more than 1000$ of BTC
  sell('BTC', 200)
}

if (getMemoryIndex(0)) {   // Bots have persistent memory to access
  buy('BTC', 1);
  setMemoryIndex(0, false);
}

