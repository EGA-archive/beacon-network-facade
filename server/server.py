import websockets
import asyncio
import aiohttp
import json
import asyncio
import itertools
from time import perf_counter
from concurrent.futures import ThreadPoolExecutor
import logging
import yaml

LOG = logging.getLogger(__name__)

async def beacon_request(session, url, data):
    async with session.get(url) as response:
        response_obj = await response.json()
        return response_obj

async def requesting(websocket, burl, query):
    start_time = perf_counter()
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=60, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=10, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=10 # Maximal number of seconds for reading a portion of data from a peer
)
    query = query.replace('"', '')
    async with aiohttp.ClientSession(timeout=my_timeout) as session:
        try:
            url = burl + query
            if '?' in url:
                url = url + '&includeResultsetResponses=ALL'
            else:
                url = url + '?includeResultsetResponses=ALL'
            response_obj = await beacon_request(session, url, data)
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            #LOG.warning(json.dumps(response_obj))
            return json.dumps(response_obj)
        except Exception:
            response_obj = await registry(websocket, burl)
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            return response_obj
        #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')

async def registry(websocket, burl):
    start_time = perf_counter()
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=60, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=10, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=10 # Maximal number of seconds for reading a portion of data from a peer
)
    try:
        async with aiohttp.ClientSession(timeout=my_timeout) as session:
            url = burl + '/info'
            response_obj = await beacon_request(session, url, data)
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            #LOG.warning(json.dumps(response_obj))
            return json.dumps(response_obj)
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
    except Exception:
        return json.dumps({"beacon": burl})

async def returning(websocket):
    await asyncio.sleep(10)
    response_obj = {'timeout': 'more than 10 seconds'}
    LOG.warning(json.dumps(response_obj))
    #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
    return response_obj

# Creating WebSocket server
async def ws_server(websocket):
    LOG.warning("WebSocket: Server Started.")
    try:
        firstitem = await websocket.recv()
        token = await websocket.recv()
        # Prompt message when any of the field is missing
        if firstitem == "" or token == "":
            LOG.warning("Not accepted.")
        elif firstitem == '"/registries"':
            loop=asyncio.get_running_loop()
            tasks=[]
            LOG.warning(f"First: {firstitem}")
            LOG.warning(f"Token: {token}")
            with open('registry.yml', 'r') as f:
                data = yaml.load(f, Loader=yaml.SafeLoader)

            for beacon in data["Beacons"]:
                with ThreadPoolExecutor() as pool:
                    task = await loop.run_in_executor(pool, registry, websocket, beacon)
                    tasks.append(task)
            list_of_beacons=[]
            
            for task in itertools.islice(asyncio.as_completed(tasks), len(tasks)):
                finalinforesponse={}
                inforesponse = await task
                inforesponse = json.loads(inforesponse)
                try:
                    #LOG.warning(inforesponse)
                    beaconInfoId=inforesponse["meta"]["beaconId"]
                    beaconName=inforesponse["response"]["name"]
                    beaconMaturity=inforesponse["response"]["environment"]
                    beaconURL=inforesponse["response"]["alternativeUrl"]
                    beaconLogo=inforesponse["response"]["organization"]["logoUrl"]
                    finalinforesponse["beaconId"]=beaconInfoId
                    finalinforesponse["beaconName"]=beaconName
                    finalinforesponse["beaconMaturity"]=beaconMaturity
                    finalinforesponse["beaconURL"]=beaconURL
                    finalinforesponse["beaconLogo"]=beaconLogo
                    list_of_beacons.append(finalinforesponse)
                    with open('/responses/registries.json') as registries_file:
                        dict_registries = json.load(registries_file)
                    dict_registries["response"]["registries"]=list_of_beacons
                    dict_registries=json.dumps(dict_registries)
                    #LOG.warning(dict_registries)
                except Exception:
                    LOG.error('{} is not responding'.format(inforesponse["beacon"]))
                    continue
                await websocket.send(f"{dict_registries}")
        
        else:
            LOG.warning(f"First: {firstitem}")
            LOG.warning(f"Token: {token}")
            loop=asyncio.get_running_loop()
            tasks=[]
            with open('registry.yml', 'r') as f:
                data = yaml.load(f, Loader=yaml.SafeLoader)

            for beacon in data["Beacons"]:
                with ThreadPoolExecutor() as pool:
                    task = await loop.run_in_executor(pool, requesting, websocket, beacon, firstitem)
                    tasks.append(task)

            with open('/responses/resultSets.json') as json_file:
                dict_response = json.load(json_file)

            for task in itertools.islice(asyncio.as_completed(tasks), len(tasks)):
                response = await task
                response = json.loads(response)
                try:
                    beaconId=response["meta"]["beaconId"]
                except Exception:
                    LOG.error('{} is not responding'.format(response["beacon"]))
                    continue
                try:
                    count=response["responseSummary"]["numTotalResults"]
                except Exception:
                    count=0
                try:
                    dict_response = json.loads(dict_response)
                except Exception:
                    pass
                dict_response["responseSummary"]["numTotalResults"]+=count
                try:
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
                except Exception:
                    dict_response["response"]["resultSets"].append({"beaconId": beaconId, "exists": False})
                if dict_response["responseSummary"]["numTotalResults"] > 0:
                    dict_response["responseSummary"]["exists"]=True
                dict_response = json.dumps(dict_response)
                await websocket.send(f"{dict_response}")
            
 
    except websockets.ConnectionClosedError as e:
        LOG.warning(e)
 
 
async def main():
    async with websockets.serve(ws_server, "0.0.0.0", 5700):
        await asyncio.Future()
 
if __name__ == "__main__":
    asyncio.run(main())