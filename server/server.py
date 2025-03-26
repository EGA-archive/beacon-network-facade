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

async def requesting(websocket, burl, query, is_v2):
    start_time = perf_counter()
    default_v2_response = {}
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=15, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=10, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=10 # Maximal number of seconds for reading a portion of data from a peer
)
    query = query.replace('"', '')
    async with aiohttp.ClientSession(timeout=my_timeout) as session:
        if is_v2 == True:
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
            except Exception as e:
                LOG.warning(e)
                response_obj = await registry(websocket, burl, is_v2)
                end_time = perf_counter()
                final_time=end_time-start_time
                LOG.warning("{} response took {} seconds".format(burl, final_time))
                return response_obj
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
        elif is_v2 == False:
            try:
                query_splitted=query.split('&')
                defquery='https://beacon-network.org/api/responses?'
                for parameter in query_splitted:
                    if 'start' in parameter:
                        parametervalue=parameter.split('=')
                        defquery=defquery+'pos='+parametervalue[1]+'&'
                    elif 'alternateBases' in parameter:
                        parametervalue=parameter.split('=')
                        defquery=defquery+'allele='+parametervalue[1]+'&'
                    elif 'assemblyId' in parameter:
                        parametervalue=parameter.split('=')
                        defquery=defquery+'ref='+parametervalue[1]+'&'
                    elif 'referenceName' in parameter:
                        parametervalue=parameter.split('=')
                        defquery=defquery+'chrom='+parametervalue[1]+'&'
                beaconquery=burl+'/beacons'
                beacons_v1=await beacon_request(session,beaconquery,data)
                #LOG.warning(beacons_v1)
                list_of_beacons_v1=[]
                for beaconv1 in beacons_v1:
                    list_of_beacons_v1.append(beaconv1["id"])
                #LOG.warning(list_of_beacons_v1)
                default_v2_response={"meta": {"beaconId": "beacon.network.org"}, "responseSummary": {"exists": False}, "response": {"resultSets": []}}
                loop=asyncio.get_running_loop()
                querytasks=[]
                for beacontoquery in list_of_beacons_v1:
                    ultimatequery=defquery+'beacon=' + beacontoquery
                    
                    with ThreadPoolExecutor() as pool:
                        #LOG.warning(ultimatequery)
                        querytask = await loop.run_in_executor(pool, beacon_request, session, ultimatequery, data)
                        querytasks.append(querytask)

                #LOG.warning('tasks are readyyyy')
                for querytask in itertools.islice(asyncio.as_completed(querytasks), len(querytasks)):
                    beaconv1tov2={"beaconId": "", "exists": False}
                    response_obj = await querytask
                    try:
                        beaconv1tov2["beaconId"]=response_obj[0]["beacon"]["id"]
                    except Exception:
                        beaconv1tov2["beaconId"]=response_obj[0]["id"]
                    #LOG.warning(beaconv1tov2)
                    try:
                        if response_obj[0]["response"]== None:
                            beaconv1tov2["exists"]=False
                            default_v2_response["response"]["resultSets"].append(beaconv1tov2)
                        elif response_obj[0]["response"]== False:
                            beaconv1tov2["exists"]=response_obj[0]["response"]
                            default_v2_response["response"]["resultSets"].append(beaconv1tov2)
                        elif response_obj[0]["response"] == True:
                            beaconv1tov2["exists"]=response_obj[0]["response"]
                            default_v2_response["response"]["resultSets"].append(beaconv1tov2)
                            default_v2_response["responseSummary"]["exists"]=True
                    except Exception:
                        beaconv1tov2["exists"]=False
                        default_v2_response["response"]["resultSets"].append(beaconv1tov2)
                    end_time = perf_counter()
                    final_time=end_time-start_time
                    LOG.warning("{} response took {} seconds".format(beaconv1tov2["beaconId"], final_time))


                        
                    
                    
                #LOG.warning(default_v2_response)
                
                
                end_time = perf_counter()
                final_time=end_time-start_time
                LOG.warning("{} response took {} seconds".format(burl, final_time))
                #LOG.warning(json.dumps(response_obj))
                return json.dumps(default_v2_response)
            except Exception as e:
                LOG.warning('que siiii')
                LOG.warning(e)
                response_obj = await registry(websocket, burl, is_v2)
                end_time = perf_counter()
                final_time=end_time-start_time
                LOG.warning("{} response took {} seconds".format(burl, final_time))
                if default_v2_response != {}:
                    return json.dumps(default_v2_response)
                else:
                    return response_obj
            #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')

async def registry(websocket, burl, is_v2):
    start_time = perf_counter()
    data={}
    my_timeout = aiohttp.ClientTimeout(
    total=60, # total timeout (time consists connection establishment for a new connection or waiting for a free connection from a pool if pool connection limits are exceeded) default value is 5 minutes, set to `None` or `0` for unlimited timeout
    sock_connect=10, # Maximal number of seconds for connecting to a peer for a new connection, not given from a pool. See also connect.
    sock_read=10 # Maximal number of seconds for reading a portion of data from a peer
)   
    if is_v2 == True:
        try:
            async with aiohttp.ClientSession(timeout=my_timeout) as session:
                url = burl + '/info'
                response_obj = await beacon_request(session, url, data)
                end_time = perf_counter()
                final_time=end_time-start_time
                LOG.warning("{} response took {} seconds".format(burl, final_time))
                response_obj["api"]=burl
                #LOG.warning(json.dumps(response_obj))
                return json.dumps(response_obj)
                #return web.Response(text=json.dumps(response_obj), status=200, content_type='application/json')
        except Exception:
            return json.dumps({"beacon": burl})
    elif is_v2 == False:
        try:
            async with aiohttp.ClientSession(timeout=my_timeout) as session:
                default_v2_response={"meta": {}, "response": {"organization": {}}}
                default_v2_response["meta"]["beaconId"]="beacon.network.org"
                default_v2_response["response"]["name"]="Beacon v1 Network"
                default_v2_response["response"]["environment"]="prod"
                default_v2_response["response"]["alternativeUrl"]="https://www.beacon-network.org"
                default_v2_response["response"]["organization"]["logoUrl"]="https://beacon-network.org/assets/images/beacon-network-logo-dark.svg"
                default_v2_response["responses"]=['tsri-civic',
                                                    'aauh-proseqs',
                                                    'tsri-clinvars',
                                                    'tsri-cosmics',
                                                    'tsri-geno2mps',
                                                    'tsri-dbsnps',
                                                    'tsri-snpedias',
                                                    'tsri-grasps',
                                                    'tsri-uniprots',
                                                    'aauh-retroseq',
                                                    'tsri-wellderlys',
                                                    'tsri-gnomad_exomes',
                                                    'phenomecentrals',
                                                    'tsri-exacs',
                                                    'tsri-dbnsfps',
                                                    'tsri-gnomad_genomes',
                                                    'tsri-gwassnpss',
                                                    'tsri-mutdb',
                                                    'tsri-emv',
                                                    'rdconnects',
                                                    'cogr-queenss',
                                                    'broads',
                                                    'cogr-sinais',
                                                    'bipmed',
                                                    'tsri-docm',
                                                    'tsri-evss',
                                                    'myvariants',
                                                    'ega',
                                                    'ucscs',
                                                    'vicc',
                                                    'swefreqs',
                                                    'hgmds',
                                                    'bemgi',
                                                    'sahgps',
                                                    'scilifelabs',
                                                    'curoverse',
                                                    'nbdc-humandbss',
                                                    'cogr-bc-cancers',
                                                    'cytognomix',
                                                    'scilifelab-clingens',
                                                    'cafe-cardiokits',
                                                    'ACpops',
                                                    'lovd',
                                                    'gigascience-2s',
                                                    'wgs',
                                                    'wtsis',
                                                    'altruists',
                                                    'elixir-fis',
                                                    'cafe-central',
                                                    'variant-matcher',
                                                    'icgcs',
                                                    'amplab',
                                                    'molgenis-emx2',
                                                    'cogr-consensus',
                                                    'ebis',
                                                    'tsri-cgi',
                                                    'clinbioinfosspa',
                                                    'cosmics',
                                                    'tsri-cadd',
                                                    'kaviars',
                                                    'thousandgenomes-phase3',
                                                    'conglomerate',
                                                    'mssng-db6',
                                                    'cafe-variome',
                                                    'cell_liness',
                                                    'ncbis',
                                                    'cosmic-alls',
                                                    'mygene2',
                                                    'brca-exchanges',
                                                    'aghas',
                                                    'narcissome',
                                                    'prism',
                                                    'agha-somatic',
                                                    'thousandgenomes',
                                                    'bob',
                                                    'agha-germline',
                                                    'cmh',
                                                    'inmegens',
                                                    'garvans',
                                                    'gigascience',
                                                    'bioreference',
                                                    'google',
                                                    'platinum',
                                                    'gigascience-1']
                end_time = perf_counter()
                response_obj=default_v2_response
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
    #LOG.warning(json.dumps(response_obj))
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

            for beacon in data["v2_Beacons"]:
                with ThreadPoolExecutor() as pool:
                    task = await loop.run_in_executor(pool, registry, websocket, beacon, True)
                    tasks.append(task)
            try:
                for beacon in data["v1_Beacons"]:
                    with ThreadPoolExecutor() as pool:
                        task = await loop.run_in_executor(pool, registry, websocket, beacon, False)
                        tasks.append(task)
            except Exception as e:
                LOG.error(e)

            list_of_beacons=[]
            
            for task in itertools.islice(asyncio.as_completed(tasks), len(tasks)):
                finalinforesponse={}
                inforesponse = await task
                inforesponse = json.loads(inforesponse)
                LOG.warning(inforesponse)
                try:
                    #LOG.warning(inforesponse)
                    beaconInfoId=inforesponse["meta"]["beaconId"]
                    beaconName=inforesponse["response"]["name"]
                    beaconMaturity=inforesponse["response"]["environment"]
                    beaconURL=inforesponse["response"]["alternativeUrl"]
                    beaconLogo=inforesponse["response"]["organization"]["logoUrl"]
                    try:
                        numberOfBeacons=len(inforesponse["responses"])
                    except Exception:
                        numberOfBeacons=1
                    try:
                        beaconAPI=inforesponse["api"]
                    except Exception:
                        beaconAPI="https://beacon-network.org/api"
                    finalinforesponse["beaconId"]=beaconInfoId
                    finalinforesponse["beaconName"]=beaconName
                    finalinforesponse["beaconMaturity"]=beaconMaturity
                    finalinforesponse["beaconURL"]=beaconURL
                    finalinforesponse["beaconLogo"]=beaconLogo
                    finalinforesponse["beaconAPI"]=beaconAPI
                    finalinforesponse["numberOfBeacons"]=numberOfBeacons
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

            for beacon in data["v2_Beacons"]:
                with ThreadPoolExecutor() as pool:
                    task = await loop.run_in_executor(pool, requesting, websocket, beacon, firstitem, True)
                    tasks.append(task)

            for beacon in data["v1_Beacons"]:
                with ThreadPoolExecutor() as pool:
                    task = await loop.run_in_executor(pool, requesting, websocket, beacon, firstitem, False)
                    tasks.append(task)

            with open('/responses/resultSets.json') as json_file:
                dict_response = json.load(json_file)

            for task in itertools.islice(asyncio.as_completed(tasks), len(tasks)):
                response = await task
                response = json.loads(response)
                #LOG.warning(response)
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
                            elif beaconId=='es.gdi.af.beacon-network' or beaconId=='eu.elixir.beacon-network':
                                response1["beaconNetworkId"]=beaconId
                            else:
                                response1["beaconId"]=beaconId
                            dict_response["response"]["resultSets"].append(response1)
                        except Exception:
                            response1["beaconId"]=beaconId
                            dict_response["response"]["resultSets"].append(response1)
                except Exception:
                    if beaconId=='es.gdi.af.beacon-network' or beaconId=='eu.elixir.beacon-network':
                        dict_response["response"]["resultSets"].append({"beaconNetworkId": beaconId, "exists": False})
                    else:
                        dict_response["response"]["resultSets"].append({"beaconId": beaconId, "exists": False})
                if dict_response["responseSummary"]["numTotalResults"] > 0 or dict_response["responseSummary"]["exists"] == True:
                    dict_response["responseSummary"]["exists"]=True
                dict_response = json.dumps(dict_response)
                LOG.warning(dict_response)
                await websocket.send(f"{dict_response}")
            
 
    except websockets.ConnectionClosedError as e:
        LOG.warning(e)
 
 
async def main():
    async with websockets.serve(ws_server, "0.0.0.0", 5700):
        await asyncio.Future()
 
if __name__ == "__main__":
    asyncio.run(main())