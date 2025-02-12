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
import logging
import yaml
import json
import itertools
from time import perf_counter
from concurrent.futures import ThreadPoolExecutor
from conf.map_entry_types import get_entry_types_map
from conf import conf
from authorization.__main__ import get_token

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

async def registry(burl):
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=conf.timeout, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=conf.timeout, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=conf.timeout # Maximal number of seconds for reading a portion of data from a peer
)
    try:
        async with aiohttp.ClientSession(timeout=my_timeout) as session:
            url = burl + '/info'
            response_obj = await beacon_get_request(session, url, data)
            #LOG.warning(json.dumps(response_obj))
            return json.dumps(response_obj)
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
    except Exception:
        return json.dumps({"beacon": burl})

async def get_requesting(burl, query):
    start_time = perf_counter()
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=conf.timeout, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=conf.timeout, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=conf.timeout # Maximal number of seconds for reading a portion of data from a peer
)
    async with aiohttp.ClientSession(timeout=my_timeout) as session:
        url = burl + query
        try:
            response_obj = await beacon_get_request(session, url, data)
            #LOG.warning(json.dumps(response_obj))
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            return json.dumps(response_obj)
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
        except Exception:
            response_obj = await registry(burl)
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            return response_obj

async def returning(url):
    await asyncio.sleep(conf.timeout)
    return json.dumps({"beacon": url})

async def get_resultSets_requesting(burl, query):
    start_time = perf_counter()
    with ThreadPoolExecutor() as pool:
        data={}
        my_timeout = aiohttp.ClientTimeout(
        total=conf.timeout, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
        sock_connect=conf.timeout, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
        sock_read=conf.timeout # Maximal number of seconds for reading a portion of data from a peer
    )
        async with aiohttp.ClientSession(timeout=my_timeout) as session:
            if '?' in query:
                url = burl + query + '&includeResultsetResponses=ALL'
            else:
                url = burl + query + '?includeResultsetResponses=ALL'
            try:
                response_obj = await beacon_get_request(session, url, data)
                #LOG.warning(json.dumps(response_obj))
                end_time = perf_counter()
                final_time=end_time-start_time
                LOG.warning("{} response took {} seconds".format(burl, final_time))
                return json.dumps(response_obj)
            except Exception:
                response_obj = await registry(burl)
                end_time = perf_counter()
                final_time=end_time-start_time
                LOG.warning("{} response took {} seconds".format(burl, final_time))
                return response_obj
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')

async def get_resultset_or_timeout(burl, query, loop):
    secondarytasks=[]
    with ThreadPoolExecutor() as pool:
        secondarytask = await loop.run_in_executor(pool, get_resultSets_requesting, burl, query)
        secondarytasks.append(secondarytask)
    with ThreadPoolExecutor() as pool:
        secondarytask = await loop.run_in_executor(pool, returning, burl)
        secondarytasks.append(secondarytask)
    for sectask in itertools.islice(asyncio.as_completed(secondarytasks), 1):
        return await sectask
    
async def get_results_or_timeout(burl, query, loop):
    secondarytasks=[]
    with ThreadPoolExecutor() as pool:
        secondarytask = await loop.run_in_executor(pool, get_requesting, burl, query)
        secondarytasks.append(secondarytask)
    with ThreadPoolExecutor() as pool:
        secondarytask = await loop.run_in_executor(pool, returning, burl)
        secondarytasks.append(secondarytask)
    for sectask in itertools.islice(asyncio.as_completed(secondarytasks), 1):
        return await sectask
    

async def requesting(burl, query, data):
    start_time = perf_counter()
    my_timeout = aiohttp.ClientTimeout(
    total=conf.timeout, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=conf.timeout, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=conf.timeout # Maximal number of seconds for reading a portion of data from a peer
)
    async with aiohttp.ClientSession(timeout=my_timeout) as session:
        url = burl + query
        try:
            response_obj = await beacon_post_request(session, url, data)
            #LOG.warning(json.dumps(response_obj))
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            return json.dumps(response_obj)
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
        except Exception:
            response_obj = await registry(burl)
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(burl, final_time))
            return response_obj

async def post_resultset_or_timeout(burl, query, loop, data):
    secondarytasks=[]
    with ThreadPoolExecutor() as pool:
        secondarytask = await loop.run_in_executor(pool, requesting, burl, query, data)
        secondarytasks.append(secondarytask)
    with ThreadPoolExecutor() as pool:
        secondarytask = await loop.run_in_executor(pool, returning, burl)
        secondarytasks.append(secondarytask)
    for sectask in itertools.islice(asyncio.as_completed(secondarytasks), 1):
        return await sectask

def combine_filtering_terms(self, list1, list2):
    definitive_list=[]
    ids_used=[]
    for dict1 in list1:
        match=False
        for dict2 in list2:
            dict1.update({key: dict1[key] + list(set(dict2[key]) - set(dict1[key])) if key in dict2 else dict1[key] for key in dict1 if key == "scopes" and dict1["id"]==dict2["id"]})
            if dict1["id"]==dict2["id"]:
                match=True
        if match == False:
            definitive_list.append(dict2)
        definitive_list.append(dict1)

    LOG.warning(definitive_list)

    return definitive_list

async def manage_resultset_response(self, tasks):
    with open('/responses/resultSets.json') as json_file:
        dict_response = json.load(json_file)
    dict_response["meta"]["beaconId"]=conf.beaconId
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
    #LOG.warning(dict_response)
    return dict_response

async def manage_collection_response(self, tasks):
    with open('/responses/collections.json') as json_file:
        dict_response = json.load(json_file)
    dict_response["meta"]["beaconId"]=conf.beaconId
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
        dict_response["responseSummary"]["numTotalResults"]+=count
        try:
            for response1 in response["response"]["collections"]:
                dict_response["response"]["collections"].append(response1)
        except Exception:
            dict_response["response"]["collections"].append({"beaconId": beaconId, "exists": False})
        if dict_response["responseSummary"]["numTotalResults"] > 0:
            dict_response["responseSummary"]["exists"]=True
    #LOG.warning(dict_response)
    return dict_response

async def manage_registries_response(self, tasks):
    start_time = perf_counter()
    list_of_beacons=[]
    for task in itertools.islice(asyncio.as_completed(tasks), len(tasks)):
        finalinforesponse={}
        inforesponse = await task
        inforesponse = json.loads(inforesponse)
        #LOG.warning(inforesponse)
        try:
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
            dict_registries["meta"]["beaconId"]=conf.beaconId
            dict_registries["response"]["registries"]=list_of_beacons
            end_time = perf_counter()
            final_time=end_time-start_time
            LOG.warning("{} response took {} seconds".format(inforesponse["meta"]["beaconId"], final_time))
        except Exception:
            LOG.error('{} is not responding'.format(inforesponse["beacon"]))
            continue
    return dict_registries

async def manage_filtering_terms_response(self, tasks):
    with open('/responses/filtering_terms.json') as json_file:
        dict_response = json.load(json_file)
    dict_response["meta"]["beaconId"]=conf.beaconId

    for task in itertools.islice(asyncio.as_completed(tasks), len(tasks)):
        response = await task
        response = json.loads(response)
        try:
            beaconId=response["meta"]["beaconId"]
            if dict_response["response"]["filteringTerms"] == []:
                for response1 in response["response"]["filteringTerms"]:
                    dict_response["response"]["filteringTerms"].append(response1)
                #LOG.warning(dict_response["response"]["filteringTerms"])
            else:
                dict_response["response"]["filteringTerms"]=combine_filtering_terms(self, dict_response["response"]["filteringTerms"], response["response"]["filteringTerms"])
                #LOG.warning(dict_response["response"]["filteringTerms"])
            for response2 in response["response"]["resources"]:
                dict_response["response"]["resources"].append(response2)
        except Exception:
            continue
    #LOG.warning(dict_response)
    return dict_response
        
class FilteringTerms(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        relative_url=str(self.request.rel_url)
        path_list = relative_url.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, get_results_or_timeout, beacon, final_endpoint, loop)
                tasks.append(task)

        dict_response=await manage_filtering_terms_response(self, tasks)
        
        return await self.resultset(dict_response)

    async def post(self):
        request = await self.request.json() if self.request.has_body else {}
        headers = self.request.headers
        post_data = request
        relative_url=str(self.request.rel_url)
        path_list = relative_url.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, post_resultset_or_timeout, beacon, final_endpoint, loop, post_data)
                tasks.append(task)

        dict_response=await manage_filtering_terms_response(self, tasks)
        
        return await self.resultset(dict_response)
    
class Registries(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, registry, beacon)
                tasks.append(task)
        dict_registries=await manage_registries_response(self, tasks)
        return await self.resultset(dict_registries)
        

    async def post(self):
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, registry, beacon)
                tasks.append(task)
        dict_registries=await manage_registries_response(self, tasks)
        return await self.resultset(dict_registries)
    
class Map(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        dict_response=get_entry_types_map()
        dict_response["meta"]["beaconId"]=conf.beaconId
        
        return await self.resultset(dict_response)

    async def post(self):
        dict_response=get_entry_types_map()
        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        return await self.resultset(dict_response)
    
class Configuration(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        with open('/responses/configuration.json') as json_file:
            dict_response = json.load(json_file)

        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)

    async def post(self):
        with open('/responses/configuration.json') as json_file:
            dict_response = json.load(json_file)
        
        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)
    
class EntryTypes(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        with open('/responses/entryTypes.json') as json_file:
            dict_response = json.load(json_file)

        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)

    async def post(self):
        with open('/responses/entryTypes.json') as json_file:
            dict_response = json.load(json_file)

        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)
    
class ServiceInfo(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        with open('/responses/service-info.json') as json_file:
            dict_response = json.load(json_file)
        
        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)

    async def post(self):
        with open('/responses/service-info.json') as json_file:
            dict_response = json.load(json_file)
        
        dict_response["meta"]["beaconId"]=conf.beaconId
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)
    
class Info(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        with open('/responses/info.json') as json_file:
            dict_response = json.load(json_file)
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)

    async def post(self):
        with open('/responses/info.json') as json_file:
            dict_response = json.load(json_file)
        #LOG.warning(dict_response)
        
        return await self.resultset(dict_response)

class Collection(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        relative_url=str(self.request.rel_url)
        path_list = relative_url.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, get_results_or_timeout, beacon, final_endpoint, loop)
                tasks.append(task)

        dict_response=await manage_collection_response(self, tasks)
        
        return await self.resultset(dict_response)

    async def post(self):
        request = await self.request.json() if self.request.has_body else {}
        headers = self.request.headers
        post_data = request
        relative_url=str(self.request.rel_url)
        path_list = relative_url.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, post_resultset_or_timeout, beacon, final_endpoint, loop, post_data)
                tasks.append(task)

        dict_response=await manage_collection_response(self, tasks)

        
        return await self.resultset(dict_response)

class Resultset(EndpointView):
    async def resultset(self, dict_response):
        try:
            response_obj = dict_response
            return web.Response(text=json_util.dumps(response_obj), status=200, content_type='application/json')
        except Exception:# pragma: no cover
            raise

    async def get(self):
        relative_url=str(self.request.rel_url)
        path_list = relative_url.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, get_resultset_or_timeout, beacon, final_endpoint, loop)
                tasks.append(task)

        dict_response=await manage_resultset_response(self, tasks)
        
        return await self.resultset(dict_response)

    async def post(self):
        request = await self.request.json() if self.request.has_body else {}
        headers = self.request.headers
        try:
            token = headers["Authorization"][7:]
        except Exception:
            token = 'nothing'
        post_data = request
        relative_url=str(self.request.path)
        path_list = relative_url.split('/')
        endpoint=path_list[-1]
        final_endpoint='/'+endpoint
        LOG.warning(final_endpoint)
        loop=asyncio.get_running_loop()
        tasks=[]
        with open('registry.yml', 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        for beacon in data["Beacons"]:
            #LOG.warning(beacon)
            if token != 'nothing':
                # go to beacon's endpoint
                # call the get_token function to do the exchange token
                pass
            with ThreadPoolExecutor() as pool:
                task = await loop.run_in_executor(pool, post_resultset_or_timeout, beacon, final_endpoint, loop, post_data)
                tasks.append(task)

        dict_response=await manage_resultset_response(self, tasks)
        
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

    app.add_routes([web.post('/api', Info)])
    app.add_routes([web.post('/api/info', Info)])
    app.add_routes([web.post('/api/entry_types', EntryTypes)])
    app.add_routes([web.post('/api/service-info', ServiceInfo)])
    app.add_routes([web.post('/api/configuration', Configuration)])
    app.add_routes([web.post('/api/map', Map)])
    app.add_routes([web.post('/api/registries', Registries)])
    app.add_routes([web.post('/api/filtering_terms', FilteringTerms)])
    app.add_routes([web.post('/api/datasets', Collection)])
    app.add_routes([web.post('/api/datasets/{id}', Collection)])
    app.add_routes([web.post('/api/datasets/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/individuals', Resultset)])
    app.add_routes([web.post('/api/cohorts', Collection)])
    app.add_routes([web.post('/api/cohorts/{id}', Collection)])
    app.add_routes([web.post('/api/cohorts/{id}/individuals', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/g_variants', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/individuals', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/individuals', Resultset)])
    app.add_routes([web.post('/api/individuals/{id}', Resultset)])
    app.add_routes([web.post('/api/individuals/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/individuals/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/analyses', Resultset)])
    app.add_routes([web.post('/api/analyses/{id}', Resultset)])
    app.add_routes([web.post('/api/analyses/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/biosamples', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/runs', Resultset)])
    app.add_routes([web.post('/api/runs/{id}', Resultset)])
    app.add_routes([web.post('/api/runs/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/runs/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api', Info)])
    app.add_routes([web.get('/api/info', Info)])
    app.add_routes([web.get('/api/entry_types', EntryTypes)])
    app.add_routes([web.get('/api/service-info', ServiceInfo)])
    app.add_routes([web.get('/api/configuration', Configuration)])
    app.add_routes([web.get('/api/map', Map)])
    app.add_routes([web.get('/api/registries', Registries)])
    app.add_routes([web.get('/api/filtering_terms', FilteringTerms)])
    app.add_routes([web.get('/api/datasets', Collection)])
    app.add_routes([web.get('/api/datasets/{id}', Collection)])
    app.add_routes([web.get('/api/datasets/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/individuals', Resultset)])
    app.add_routes([web.get('/api/cohorts', Collection)])
    app.add_routes([web.get('/api/cohorts/{id}', Collection)])
    app.add_routes([web.get('/api/cohorts/{id}/individuals', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/g_variants', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/individuals', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/individuals', Resultset)])
    app.add_routes([web.get('/api/individuals/{id}', Resultset)])
    app.add_routes([web.get('/api/individuals/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/individuals/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/analyses', Resultset)])
    app.add_routes([web.get('/api/analyses/{id}', Resultset)])
    app.add_routes([web.get('/api/analyses/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/biosamples', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/runs', Resultset)])
    app.add_routes([web.get('/api/runs/{id}', Resultset)])
    app.add_routes([web.get('/api/runs/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/runs/{id}/g_variants', Resultset)])

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