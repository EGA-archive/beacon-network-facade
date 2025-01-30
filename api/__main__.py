
import asyncio
import aiohttp
import aiohttp.web as web
from aiohttp.web_request import Request
from bson import json_util
import time
import os
import signal
from threading import Thread
from aiohttp_middlewares import cors_middleware
from aiohttp_cors import CorsViewMixin
from datetime import datetime
import ssl
import logging
import yaml
import json
import itertools
from time import perf_counter
from concurrent.futures import ThreadPoolExecutor

LOG = logging.getLogger(__name__)
fmt = '%(levelname)s - %(asctime)s - %(message)s'
formatter = logging.Formatter(fmt)
logging.basicConfig(format=fmt, level=logging.NOTSET)

class EndpointView(web.View, CorsViewMixin):
    def __init__(self, request: Request):
        self._request = request

async def beacon_get_request(session, url, data):
    async with session.get(url) as response:
        response_obj = await response.json()
        return response_obj

async def beacon_post_request(session, url, data):
    async with session.post(url, json=data) as response:
        response_obj = await response.json()
        return response_obj
    
async def get_requesting(burl, query):
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=60, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=10, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=10 # Maximal number of seconds for reading a portion of data from a peer
)
    async with aiohttp.ClientSession(timeout=my_timeout) as session:
        url = burl + query
        response_obj = await beacon_get_request(session, url, data)
        #LOG.warning(json.dumps(response_obj))
        return json.dumps(response_obj)
        #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')

async def requesting(burl, query, data):
    my_timeout = aiohttp.ClientTimeout(
    total=60, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=10, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=10 # Maximal number of seconds for reading a portion of data from a peer
)
    async with aiohttp.ClientSession(timeout=my_timeout) as session:
        url = burl + query
        response_obj = await beacon_post_request(session, url, data)
        #LOG.warning(json.dumps(response_obj))
        return json.dumps(response_obj)
        #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')

class Resultset(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        request = await self.request.json() if self.request.has_body else {}
        headers = self.request.headers
        post_data = request
        path_list = self.request.path.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, get_requesting, beacon, final_endpoint)
                tasks.append(task)

        with open('/responses/resultSets.json') as json_file:
            dict_response = json.load(json_file)

        for task in itertools.islice(asyncio.as_completed(tasks), 2):
            response = await task
            response = json.loads(response)
            beaconId=response["meta"]["beaconId"]
            count=response["responseSummary"]["numTotalResults"]
            dict_response["responseSummary"]["numTotalResults"]+=count
            for response1 in response["response"]["resultSets"]:
                try:
                    if response1["beaconId"]!=beaconId:
                        response1["beaconNetworkId"]=beaconId
                    else:
                        response1["beaconId"]=beaconId
                    dict_response["response"]["resultSets"].append(response1)
                except Exception:
                    response1["beaconId"]=beaconId
                    dict_response["response"]["resultSets"].append(response1)
            if dict_response["responseSummary"]["numTotalResults"] > 0:
                dict_response["responseSummary"]["exists"]=True
        LOG.warning(dict_response)
        
        return await self.resultset(dict_response)

    async def post(self):
        request = await self.request.json() if self.request.has_body else {}
        headers = self.request.headers
        post_data = request
        path_list = self.request.path.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, requesting, beacon, final_endpoint, post_data)
                tasks.append(task)

        with open('/responses/resultSets.json') as json_file:
            dict_response = json.load(json_file)

        for task in itertools.islice(asyncio.as_completed(tasks), 2):
            response = await task
            response = json.loads(response)
            beaconId=response["meta"]["beaconId"]
            count=response["responseSummary"]["numTotalResults"]
            dict_response["responseSummary"]["numTotalResults"]+=count
            for response1 in response["response"]["resultSets"]:
                try:
                    if response1["beaconId"]!=beaconId:
                        response1["beaconNetworkId"]=beaconId
                    else:
                        response1["beaconId"]=beaconId
                    dict_response["response"]["resultSets"].append(response1)
                except Exception:
                    response1["beaconId"]=beaconId
                    dict_response["response"]["resultSets"].append(response1)
            if dict_response["responseSummary"]["numTotalResults"] > 0:
                dict_response["responseSummary"]["exists"]=True
        LOG.warning(dict_response)
        
        return await self.resultset(dict_response)
        
async def initialize(app):# pragma: no cover
    LOG.info("Initialization done.")

def _on_shutdown(pid):# pragma: no cover
    time.sleep(6)

    #  Sending SIGINT to close server
    os.kill(pid, signal.SIGINT)

    LOG.info('Shutting down beacon v2')

async def _graceful_shutdown_ctx(app):# pragma: no cover
    def graceful_shutdown_sigterm_handler():
        nonlocal thread
        thread = Thread(target=_on_shutdown, args=(os.getpid(),))
        thread.start()

    thread = None

    loop = asyncio.get_event_loop()
    loop.add_signal_handler(
        signal.SIGTERM, graceful_shutdown_sigterm_handler,
    )

    yield

    loop.remove_signal_handler(signal.SIGTERM)

    if thread is not None:
        thread.join()


async def create_api():# pragma: no cover
    app = web.Application(
        middlewares=[
            cors_middleware(origins=["*"])
        ]
    )
    app.on_startup.append(initialize)
    app.cleanup_ctx.append(_graceful_shutdown_ctx)

    app.add_routes([web.post('/api/individuals', Resultset)])
    app.add_routes([web.get('/api/individuals', Resultset)])

    ssl_context = None

    LOG.debug("Starting app")
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 7080,  ssl_context=ssl_context)
    await site.start()

    while True:
        await asyncio.sleep(3600)

if __name__ == '__main__':# pragma: no cover
    asyncio.run(create_api())