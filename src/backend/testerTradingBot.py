#!/usr/bin/env python
import requests
import random
# This is a trading bot in python for testing purposes

def make_request(action, ticker):
    url = "http://localhost:5000"
    #payload = '{"uid":"1234", "action":"' + action + '", "ticker":"' + ticker + '", "testing":"true"}'
    payload = '{"uid":"1234", "action":"' + action + '", "ticker":"' + ticker + '"}'
    headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}
    r = requests.post(url, data=payload, headers=headers)
    print(r)

time = 100
while (time > 0):
    time = time - 1
    # pick random action
    action = random.choice(['buy', 'sell', 'get info']);
    # pick random ticker
    ticker = random.choice(['BTC', 'ETH', 'XRP']);
    make_request(action, ticker)
